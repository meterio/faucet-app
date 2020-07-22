import HttpException from './HttpException';

class AlreadyTappedIn24HoursException extends HttpException {
  constructor(ipAddr: string) {
    super(403, `${ipAddr} has been issued in last 24 hours`);
  }
}

export default AlreadyTappedIn24HoursException;
