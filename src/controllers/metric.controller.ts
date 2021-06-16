import { Router } from 'express';
import Controller from '../interfaces/controller.interface';
import * as pkg from '../../package.json';

const { FAUCET_NETWORK } = process.env;

class MetricController implements Controller {
  public path = '/metrics';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, (req, res, next) =>
      res.send({ network: FAUCET_NETWORK, version: pkg.version })
    );
  }
}

export default MetricController;
