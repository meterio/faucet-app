import { Request, Response, NextFunction, Router, response } from 'express';
import Controller from '../interfaces/controller.interface';
import AlreadyTappedException from '../exceptions/AlreadyTappedException';
import NotEnoughBalanceException from '../exceptions/NotEnoughBalanceException';
import AlreadyTappedIn24HoursException from '../exceptions/AlreadyTappedIn24HoursException';
import WalletService from '../services/wallet.service';
import TapRepo from '../repos/tap.repo';
import ServiceNotReadyException from '../exceptions/ServiceNotReadyException';
import BigNumber from 'bignumber.js';

const { FAUCET_NETWORK, FAUCET_ADDR } = process.env;
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
    this.router.get(`${this.path}/:address/history`, this.getHistoryTaps);
    this.router.post(`${this.path}`, this.execTap);
    this.router.get(`${this.path}/`, this.getAllTaps);
  }

  private getHistoryTaps = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { address } = req.params;
    const taps = await this.tapRepo.findByTo(address);
    let entries = [];
    const linkPrefix =
      FAUCET_NETWORK!.toLowerCase() === 'mainnet'
        ? 'https://explorer.meter.io/tx/'
        : 'https://explorer-warringstakes.meter.io/tx/';
    for (const tap of taps) {
      for (const tx of tap.txs) {
        entries.push({
          to: tap.to,
          url: `${linkPrefix}${tx.hash}`,
          amountStr: `${new BigNumber(tx.amount).dividedBy(1e18).toFixed()} ${
            tx.token
          }`,
          timestamp: tap.timestamp,
        });
      }
    }
    // res.send({ taps: taps.map((t) => t.toJSON()) });
    res.render('pages/history', { entries, address });
  };

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

    const rules = request.app.get('tap-rules');

    // check tap with the same address
    const address = request.params.address || request.body.address;
    const tap = await this.tapRepo.findByTo(address);
    if (tap && tap.length > 0) {
      console.log('already tapped address: ', address);
      return next(new AlreadyTappedException(address));
    }

    // check mtrg balance if reuqired
    const minMTRGBalance = rules.prerequisite.minimalMTRGBalance;
    if (minMTRGBalance.isGreaterThan(0)) {
      const balance = await this.wallet.getBalance(address);
      if (new BigNumber(balance).isGreaterThanOrEqualTo(minMTRGBalance)) {
        return next(new NotEnoughBalanceException(address));
      }
    }

    // start tapping
    console.log('tap for address:', address);
    let txs = [];
    let msgs = [];
    if (rules.tapMTR.enabled) {
      const amount = rules.tapMTR.amount;
      if (amount.isGreaterThan(0)) {
        const mtrTx = await this.wallet.transferMTR(address, amount); // transfer 0.05 MTR to target address
        if (!mtrTx) {
          return next(new ServiceNotReadyException());
        }
        txs.push({ hash: mtrTx.txid, amount, token: 'MTR' });
        msgs.push(`${amount.dividedBy(1e18).toFixed()} MTR`);
      }
    }

    if (rules.tapMTRG.amount) {
      const amount = rules.tapMTRG.amount;
      if (amount.isGreaterThan(0)) {
        const mtrgTx = await this.wallet.transferMTRG(address, amount); // transfer 0.05 MTR to target address
        if (!mtrgTx) {
          return next(new ServiceNotReadyException());
        }
        txs.push({ hash: mtrgTx.txid, amount, token: 'MTRG' });
      }
      if (msgs.length >= 1) {
        msgs.push('and');
      }
      msgs.push(`${amount.dividedBy(1e18).toFixed()} MTRG`);
    }

    console.log('tapped for address:', address, 'txs:', txs);

    const newTap = await this.tapRepo.create({
      from: FAUCET_ADDR!,
      to: address,
      txs,
      timestamp: Math.floor(Date.now() / 1000),
      ipAddr,
    });

    const links = [];
    for (const tx of txs) {
      if (FAUCET_NETWORK!.toLowerCase() === 'mainnet') {
        links.push({
          text: `Tx for ${new BigNumber(tx.amount).dividedBy(1e18).toFixed()} ${
            tx.token
          }`,
          url: `https://explorer.meter.io/tx/${tx.hash}`,
        });
      } else {
        links.push({
          text: `Tx for ${new BigNumber(tx.amount).dividedBy(1e18).toFixed()} ${
            tx.token
          }`,
          url: `https://explorer-warringstakes.meter.io/tx/${tx.hash}`,
        });
      }
    }
    response.send({
      tap: newTap.toJSON(),
      links,
      message: `Address ${address} has been isssued ${msgs.join(' ')}`,
    });
  };
}

export default TapController;
