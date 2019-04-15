import * as bodyParser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';
import { HttpException } from './exceptions/HttpException';
import cors from 'cors';
import { Controller } from './Controller.interface';


class App {
  public app: express.Application;
  public port: number;

  constructor(controllers: Controller[], port: number, private test?: boolean) {
    this.app = express();
    this.port = port;

    this.initializeCors();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.connectToTheDatabase();
    this.initializeErrorHandling();
  }

  initializeCors() {
    this.app.use(cors());
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }

  private connectToTheDatabase() {
    if (this.test) {
      return;
    }
    mongoose.connect(`mongodb://localhost:27017/network`);
  }

  private initializeErrorHandling() {
    this.app.use(this.errorMiddleware);
  }

  private errorMiddleware(err: HttpException, req: express.Request, res: express.Response, next: express.NextFunction) {
    console.log('errorMiddleware', err.message);
    
    const status = err.status || 500;
    const message = err.message || 'Something went wrong';
    res
      .status(status)
      .send({
        status,
        message,
      });
  }
}

export default App;
