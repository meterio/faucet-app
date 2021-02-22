import { Router } from 'express';
import Controller from '../interfaces/controller.interface';

const { FAUCET_NETWORK } = process.env;

class ClaimController implements Controller {
  public path = '/';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, (req, res, next) => {
      const isMainnet = FAUCET_NETWORK!.toLowerCase() === 'mainnet';
      console.log('isMainnet:', isMainnet);
      const rules = req.app.get('tap-rules');
      // console.log('rules', rules);
      res.render('pages/claim', { isMainnet });
    });
  }
}

export default ClaimController;
