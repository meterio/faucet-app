import HttpException from './HttpException';
import { SYSTEM_COIN } from '../const/config';

class EnoughMTRBalanceException extends HttpException {
  constructor(addr: string) {
    super(
      403,
      `Address ${addr} has balance of more than 0 ${SYSTEM_COIN}, not valid for receiving ${SYSTEM_COIN}`
    );
  }
}

export default EnoughMTRBalanceException;
