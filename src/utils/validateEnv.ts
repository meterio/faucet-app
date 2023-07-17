import { cleanEnv, port, str } from 'envalid';
import { config } from 'dotenv';

const { NODE_ENV } = process.env;
function validateEnv() {
  console.log('node env:', NODE_ENV);
  config();

  cleanEnv(process.env, {
    // JWT_SECRET: str(),
    MONGO_USER: str(),
    MONGO_PWD: str(),
    MONGO_PATH: str(),
    MONGO_SSL_CA: str(),

    FAUCET_ADDR: str(),
    FAUCET_KEY: str(),
    FAUCET_NETWORK: str(),

    PORT: port(),
  });
}

export default validateEnv;
