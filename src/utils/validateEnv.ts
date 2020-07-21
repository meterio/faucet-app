import { cleanEnv, port, str } from 'envalid';
import { config } from 'dotenv';

function validateEnv() {
  config();
  cleanEnv(process.env, {
    // JWT_SECRET: str(),
    MONGO_USER: str(),
    MONGO_PWD: str(),
    MONGO_PATH: str(),

    FAUCET_ADDR: str(),
    FAUCET_KEY: str(),
    FAUCET_URL: str(),
    PORT: port(),
  });
}

export default validateEnv;
