import { cleanEnv, port, str, num } from 'envalid';
import { config } from 'dotenv';

const { NODE_ENV } = process.env;
function validateEnv() {
  console.log('node env:', NODE_ENV);
  config();
  console.log('FAUCET_URL:', process.env.FAUCET_URL);

  cleanEnv(process.env, {
    // JWT_SECRET: str(),
    MONGO_USER: str(),
    MONGO_PWD: str(),
    MONGO_PATH: str(),

    FAUCET_ADDR: str(),
    FAUCET_KEY: str(),
    FAUCET_URL: str(),
    PORT: port(),

    MTRG_BALANCE_THRESHOLD: num(),
    TAP_AMOUNT_MTR: num(),
    TAP_AMOUNT_MTRG: num(),
  });
}

export default validateEnv;
