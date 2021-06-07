import HttpException from './HttpException';

class NotInWhiteListException extends HttpException {
  constructor(addr: string) {
    super(
      403,
      'Last transaction not from one of approved addresses'
    );
  }
}

export default NotInWhiteListException;
