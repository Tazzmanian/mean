import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as mongoose from 'mongoose';
import { HttpException } from './exceptions/HttpException';

class App {
  public app: express.Application;
  public port: number;

  constructor(controllers, port) {
    this.app = express();
    this.port = port;

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.connectToTheDatabase();
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
  }

  private initializeControllers(controllers) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }

  private connectToTheDatabase() {
    mongoose.connect(`mongodb://localhost:27017/network`);
  }

  private initializeErrorHandling() {
    this.app.use(this.errorMiddleware);
  }

  private errorMiddleware(err: HttpException, req: express.Request, res: express.Response, next: express.NextFunction) {
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
