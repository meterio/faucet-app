import HttpException from './HttpException';
import { SYSTEM_COIN, SYSTEM_TOKEN } from '../const/config';

class NotEnoughBalanceException extends HttpException {
  constructor(addr: string) {
    super(
      403,
      `Address ${addr} has balance less than 1 ${SYSTEM_TOKEN}, not valid for receiving ${SYSTEM_COIN}`
    );
  }
}

export default NotEnoughBalanceException;
