import { cleanEnv, port, str } from 'envalid';
import { config } from 'dotenv';

const { NODE_ENV } = process.env;
function validateEnv() {
  console.log('node env:', NODE_ENV);
  if (NODE_ENV === 'production') {
    config({ path: '.env.prod' });
  } else if (NODE_ENV === 'development') {
    config({ path: '.env.dev' });
  } else {
    config();
  }

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
