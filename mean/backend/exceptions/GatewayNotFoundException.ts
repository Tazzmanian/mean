import { HttpException } from './HttpException';

export class GatewayNotFoundException extends HttpException {
  constructor(sn: string) {
    super(404, `Post with id ${sn} not found`);
  }
}
