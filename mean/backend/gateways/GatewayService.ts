import { gatewayModel, Gateway } from './gateway.model';
import { NextFunction, Response, Request } from 'express';
import { Device, deviceModel } from '../devices/devices.model';
import { Document } from 'mongoose';
import { GatewayNotFoundException } from '../exceptions/GatewayNotFoundException';
import { DeviceNotFoundException } from '../exceptions/DeviceNotFoundException';

export class GatewayService {

    getAllGateways(req: Request, res: Response) {
        gatewayModel.find({}, (err, data) => {
            if (err) {
                res.send(err);
            }
            res.json(data);
        });
    }

    async createGateway(req: Request, res: Response, next: NextFunction) {
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

    async deleteGateway(req: Request, res: Response, next: NextFunction) {
        const gw = await gatewayModel.findOne({ sn: req.params.sn });
        if (gw) {
            const ids = (gw as Gateway & Document).devices.map((x: Device & Document) => x._id);
            await deviceModel.deleteMany({ _id: { $in: ids } });
            await gatewayModel.deleteOne({ _id: gw._id });
            res.json(gw);
        } else {
            next(new GatewayNotFoundException(req.params.sn));
        }
    }

    async createDevice(req: Request, res: Response, next: NextFunction) {
        const gw = await gatewayModel.findOne({ sn: req.params.sn });
        if ((gw as Gateway & Document).devices.length < 10) {
            const device = new deviceModel(req.body);
            const d = await device.save();
            await gatewayModel.updateOne({ sn: req.params.sn }, { $push: { devices: (d as Device & Document)._id } });
            res.json(d);
        }
        next(new GatewayNotFoundException(req.params.sn));
    }

    async deleteDevice(req: Request, res: Response, next: NextFunction) {
        const gw = await gatewayModel.findOne({ sn: req.params.sn });
        if (gw) {
            const ids = (gw as Gateway & Document).devices.map((x: Device & Document) => x._id);
            const dev = await deviceModel.findOne({ _id: { $in: ids }, UID: req.params.uid });
            if (dev === null) {
                await next(new DeviceNotFoundException(req.params.uid));
            } else {
                await gatewayModel.updateOne({ sn: req.params.sn }, { $pull: { devices: (dev as Device & Document)._id } });
                const del = await deviceModel.deleteOne({ _id: (dev as Device & Document)._id });
                res.json(del);
            }
        } else {
            next(new GatewayNotFoundException(req.params.sn));
        }
    }
}