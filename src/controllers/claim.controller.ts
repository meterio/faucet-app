import { Router } from 'express';
import Controller from '../interfaces/controller.interface';

const { FAUCET_URL } = process.env;

class ClaimController implements Controller {
  public path = '/claims';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/`, (req, res, next) => {
      const isMainnet = FAUCET_URL?.includes('mainnet');
      console.log('isMainnet:', isMainnet);
      res.render('pages/claim', { isMainnet });
    });
  }
}

export default ClaimController;
