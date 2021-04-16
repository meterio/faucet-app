import HttpException from './HttpException';

class InvalidCaptchaException extends HttpException {
  constructor() {
    super(403, `Invalid captcha`);
  }
}

export default InvalidCaptchaException;
