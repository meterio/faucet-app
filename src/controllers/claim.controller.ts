import { Router } from 'express';
import * as csrf from 'csurf';
import Controller from '../interfaces/controller.interface';
import { SYSTEM_COIN, SYSTEM_TOKEN } from '../const/config';

const { FAUCET_NETWORK } = process.env;
var csrfProtection = csrf({ cookie: true });

class ClaimController implements Controller {
  public path = '/';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, csrfProtection, (req, res, next) => {
      const homeUrl = "https://testnet-explorer.stp.network/";
      const brand = "STP Network";

      const isMainnet = FAUCET_NETWORK!.toLowerCase() === 'mainnet';
      console.log('isMainnet:', isMainnet);
      const rules = req.app.get('tap-rules');
      req.app.set('is-mainnet', isMainnet);
      // console.log('rules', rules);
      res.render('pages/claim', { isMainnet, csrfToken: req.csrfToken(), SYSTEM_COIN, SYSTEM_TOKEN, homeUrl, brand });
    });
  }
}

export default ClaimController;
