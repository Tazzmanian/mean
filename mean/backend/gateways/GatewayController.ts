import { Router, Request, Response } from 'express';
import { Gateway, gatewayModel } from './gateway.model';
import { Device, deviceModel } from '../devices/devices.model';


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
        gatewayModel.find({}, (err, data) => {
            if (err) {
                res.send(err);
            }
            res.json(data);
        });
    }

    async createGateway(req: Request, res: Response) {
        const gateway: Gateway = req.body;
        const devices: Device[] = [...gateway.devices];
        const ids = [];
        gateway.devices = ids;

        for (const d of devices) {
            console.log(d);
            const saveD = new deviceModel(d);
            const data = await saveD.save();
            ids.push(data._id);
        }
        gateway.devices = ids;
        console.log('t', gateway.devices, ids);
        const saveGateway = new gatewayModel(gateway);

        await saveGateway.save((err, data) => {
            if (err) {
                res.send(err);
            }
            res.json(data);
        });
    }

    deleteGateway(req: Request, res: Response) {
        res.send(false);
    }

    createDevice(req: Request, res: Response) {

    }

    deleteDevice(req: Request, res: Response) {
        res.send(false);
    }
}

