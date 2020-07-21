import { Request, Response, NextFunction, Router } from 'express';
import Controller from '../interfaces/controller.interface';
import AlreadyTappedException from '../exceptions/AlreadyTappedException';
import NotEnoughBalanceException from '../exceptions/NotEnoughBalanceException';
import AlreadyTappedIn24HoursException from '../exceptions/AlreadyTappedIn24HoursException';
import WalletService from '../services/wallet.service';
import TapRepo from '../repos/tap.repo';
import ServiceNotReadyException from '../exceptions/ServiceNotReadyException';

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
    const ipAddr = request.headers['x-forwarded-for']
      ? <string>request.headers['x-forwarded-for']
      : request.connection.remoteAddress || '';
    console.log('IP Address:', ipAddr);
    const recentTaps = await this.tapRepo.findRecentTapsByIP(ipAddr);
    if (recentTaps && recentTaps.length > 0) {
      console.log('already tapped with this ip address:', ipAddr);
      return next(new AlreadyTappedIn24HoursException(ipAddr));
    }

    const address = request.params.address || request.body.address;
    const tap = await this.tapRepo.findByToAddr(address);
    if (tap && tap.length > 0) {
      console.log('already tapped address: ', address);
      return next(new AlreadyTappedException(address));
    } else {
      const balance = await this.wallet.getBalance(address);
      if (Math.floor(balance / 1e18) < 1) {
        return next(new NotEnoughBalanceException(address));
      }
      console.log('tap for address:', address);
      const amount = '5' + '0'.repeat(16);
      const result = await this.wallet.transferMTR(address, amount); // transfer 0.05 MTR to target address
      if (!result) {
        return next(new ServiceNotReadyException());
      }
      console.log('tapped for address:', address, 'result:', result);

      const newTap = await this.tapRepo.create({
        fromAddr: result.signer,
        toAddr: address,
        value: amount,
        token: 'MTR',
        txID: result.txid,
        timestamp: Math.floor(Date.now() / 1000),
        ipAddr,
      });

      response.send({
        tap: newTap.toJSON(),
        message: `Address ${address} has been isssued 0.05 MTR`,
      });
    }
  };
}

export default TapController;
