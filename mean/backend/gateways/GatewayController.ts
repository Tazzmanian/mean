import { Router, Request, Response } from 'express';


export class GatewayController {
    public router = Router();

    constructor() {
        this.initRoutes();
    }

    initRoutes() {
        this.router.post('/gateways', this.createGateway);
        this.router.get('/gateways', this.getAllGateways);
        this.router.delete('/gateways/:sn', this.deleteGateway);
        this.router.post('/gateways/:sn/devices', this.createDevice);
        this.router.delete('/gateways/:sn/devices/:uid', this.deleteDevice);
    }

    getAllGateways(req: Request, res: Response) {
        res.send({mesa: 123});
    }

    createGateway(req: Request, res: Response) {
        res.send({sn: '123'});
    }

    deleteGateway(req: Request, res: Response) {
        res.send(false);
    }

    createDevice(req: Request, res: Response) {
        res.send({uid: 123});
    }

    deleteDevice(req: Request, res: Response) {
        res.send(false);
    }
}

