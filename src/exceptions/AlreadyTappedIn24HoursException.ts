import HttpException from './HttpException';

class AlreadyTappedIn24HoursException extends HttpException {
  constructor(ipAddr: string) {
    super(403, `${ipAddr} has been issued by 0.5 MTR in last 24 hours`);
  }
}

export default AlreadyTappedIn24HoursException;
