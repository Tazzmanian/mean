import { HttpException } from './HttpException';

export class DeviceNotFoundException extends HttpException {
  constructor(uid: number) {
    super(404, `Post with id ${uid} not found`);
  }
}
