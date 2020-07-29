import { Request, Response, NextFunction, Router } from 'express';
import Controller from '../interfaces/controller.interface';
import AlreadyTappedException from '../exceptions/AlreadyTappedException';
import NotEnoughBalanceException from '../exceptions/NotEnoughBalanceException';
import AlreadyTappedIn24HoursException from '../exceptions/AlreadyTappedIn24HoursException';
import WalletService from '../services/wallet.service';
import TapRepo from '../repos/tap.repo';
import ServiceNotReadyException from '../exceptions/ServiceNotReadyException';
import BigNumber from 'bignumber.js';

const {
  TAP_AMOUNT_MTR,
  TAP_AMOUNT_MTRG,
  FAUCET_ADDR,
  MTRG_BALANCE_THRESHOLD,
} = process.env;
class TapController implements Controller {
  public path = '/taps';
  public router = Router();
  private tapRepo = new TapRepo();
  private wallet = new WalletService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:address`, this.execTap);
    this.router.post(`${this.path}`, this.execTap);
    this.router.get(`${this.path}/`, this.getAllTaps);
  }

  private getAllTaps = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const taps = await this.tapRepo.findAll();
    const jTaps = taps.map((t) => t.toJSON());
    response.send({ taps: jTaps });
  };

  private execTap = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    // check tap within 24 hours by the same ip
    const ipAddr = request.headers['x-forwarded-for']
      ? <string>request.headers['x-forwarded-for']
      : request.connection.remoteAddress || '';
    console.log('IP Address:', ipAddr);
    const recentTaps = await this.tapRepo.findRecentTapsByIP(ipAddr);
    if (recentTaps && recentTaps.length > 0) {
      console.log('already tapped with this ip address:', ipAddr);
      return next(new AlreadyTappedIn24HoursException(ipAddr));
    }

    // check tap with the same address
    const address = request.params.address || request.body.address;
    const tap = await this.tapRepo.findByToAddr(address);
    if (tap && tap.length > 0) {
      console.log('already tapped address: ', address);
      return next(new AlreadyTappedException(address));
    }

    // check mtrg balance if reuqired
    const balance = await this.wallet.getBalance(address);
    if (Math.floor(balance / 1e18) < parseInt(MTRG_BALANCE_THRESHOLD!, 10)) {
      return next(new NotEnoughBalanceException(address));
    }

    // start tapping
    console.log('tap for address:', address);
    let txs = [];
    if (parseFloat(TAP_AMOUNT_MTR!) > 0) {
      const mtrAmount = new BigNumber(TAP_AMOUNT_MTR!)
        .multipliedBy(1e18)
        .toFixed();
      const mtrTx = await this.wallet.transferMTR(address, mtrAmount); // transfer 0.05 MTR to target address
      if (!mtrTx) {
        return next(new ServiceNotReadyException());
      }
      txs.push({ txID: mtrTx.txid, value: mtrAmount, token: 'MTR' });
    }

    if (parseFloat(TAP_AMOUNT_MTRG!) > 0) {
      const mtrgAmount = new BigNumber(TAP_AMOUNT_MTRG!)
        .multipliedBy(1e18)
        .toFixed();
      const mtrgTx = await this.wallet.transferMTRG(address, mtrgAmount); // transfer 0.05 MTR to target address
      if (!mtrgTx) {
        return next(new ServiceNotReadyException());
      }
      txs.push({ txID: mtrgTx.txid, value: mtrgAmount, token: 'MTRG' });
    }

    console.log('tapped for address:', address, 'txs:', txs);

    const newTap = await this.tapRepo.create({
      fromAddr: FAUCET_ADDR!,
      toAddr: address,
      txs: txs,
      timestamp: Math.floor(Date.now() / 1000),
      ipAddr,
    });

    response.send({
      tap: newTap.toJSON(),
      message: `Address ${address} has been isssued ${TAP_AMOUNT_MTR} MTR and ${TAP_AMOUNT_MTRG} MTRG`,
    });
  };
}

export default TapController;
