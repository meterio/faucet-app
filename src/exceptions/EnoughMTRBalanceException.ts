import HttpException from './HttpException';

class EnoughMTRBalanceException extends HttpException {
  constructor(addr: string) {
    super(
      403,
      `Address ${addr} has balance of more than 0 MTR, not valid for receiving MTR`
    );
  }
}

export default EnoughMTRBalanceException;
