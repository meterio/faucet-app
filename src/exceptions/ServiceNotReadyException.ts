import HttpException from './HttpException';

class ServiceNotReadyException extends HttpException {
  constructor() {
    super(500, 'Service is not ready, please try again later');
  }
}

export default ServiceNotReadyException;
