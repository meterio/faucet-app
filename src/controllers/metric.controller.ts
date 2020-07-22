import { Router } from 'express';
import Controller from '../interfaces/controller.interface';

const { FAUCET_URL } = process.env;

class MetricController implements Controller {
  public path = '/metrics';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, (req, res, next) =>
      res.send({ url: FAUCET_URL })
    );
  }
}

export default MetricController;
