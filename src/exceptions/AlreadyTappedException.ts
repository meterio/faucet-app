import HttpException from './HttpException';

class AlreadyTappedException extends HttpException {
  constructor(addr: string) {
    super(403, `Address ${addr} has already been issued, can't issue again`);
  }
}

export default AlreadyTappedException;
