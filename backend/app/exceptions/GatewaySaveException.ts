import { HttpException } from './HttpException';

export class GatewaySaveException extends HttpException {
  constructor(err: Error) {
    super(520, err.message);
  }
}
