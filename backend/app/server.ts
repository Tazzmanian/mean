import App from './app';
import { GatewayController } from './gateways/GatewayController';

const app = new App(
  [
    new GatewayController()
  ],
  3000,
);

app.listen();
