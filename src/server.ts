import 'dotenv/config';
import App from './app';
import TapController from './controllers/tap.controller';
import ClaimController from './controllers/claim.controller';
import MetricController from './controllers/metric.controller';
import validateEnv from './utils/validateEnv';

validateEnv();

const app = new App([
  new TapController(),
  new ClaimController(),
  new MetricController(),
]);

app.listen();
