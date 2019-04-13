import { Router, Request, Response } from 'express';
import { Gateway, gatewayModel } from './gateway.model';
import { Device, deviceModel } from '../devices/devices.model';
import { Document } from 'mongoose';


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
        let ids = [];
        gateway.devices = ids;

        const ds = await deviceModel.insertMany(devices);

        ids = ds.map(x => x._id);
        gateway.devices = ids;
        const saveGateway = new gatewayModel(gateway);

        await saveGateway.save(async (err, data) => {
            if (err) {
                await deviceModel.deleteMany({ _id: { $in: ids } });
                res.send(err);
            }
            res.json(data);
        });
    }

    async deleteGateway(req: Request, res: Response) {
        const gw = await gatewayModel.findOne({ sn: req.params.sn });
        if (gw) {
            const ids = (gw as Gateway & Document).devices.map((x: Device & Document) => x._id);
            await deviceModel.deleteMany({ _id: { $in: ids } });
            await gatewayModel.deleteOne({ _id: gw._id });
            res.json(gw);
        } else {
            res.send({ msg: 'error' });
        }
    }

    async createDevice(req: Request, res: Response) {
        const gw = await gatewayModel.findOne({ sn: req.params.sn });
        if ((gw as Gateway & Document).devices.length < 10) {
            const device = new deviceModel(req.body);
            const d = await device.save();
            await gatewayModel.updateOne({ sn: req.params.sn }, { $push: { devices: (d as Device & Document)._id } });
            res.json(d);
        }
        res.send({ msg: 'error' });
    }

    async deleteDevice(req: Request, res: Response) {
        const gw = await gatewayModel.findOne({ sn: req.params.sn });
        if (gw) {
            const ids = (gw as Gateway & Document).devices.map((x: Device & Document) => x._id);
            const dev = await deviceModel.findOne({ _id: { $in: ids }, UID: req.params.uid });
            await gatewayModel.updateOne({ sn: req.params.sn }, { $pull: { devices: (dev as Device & Document)._id } });
            const del = await deviceModel.deleteOne({ _id: (dev as Device & Document)._id });
            res.json(del);
        } else {
            res.send({ msg: 'error' });
        }
    }
}

