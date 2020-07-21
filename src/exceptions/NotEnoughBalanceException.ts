import HttpException from './HttpException';

class NotEnoughBalanceException extends HttpException {
  constructor(addr: string) {
    super(
      403,
      `Address ${addr} has balance less than 1 MTRG, not valid for receiving MTR`
    );
  }
}

export default NotEnoughBalanceException;
