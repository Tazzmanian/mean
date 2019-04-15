import { gatewayModel, Gateway } from './gateway.model';
import { NextFunction, Response, Request } from 'express';
import { Device, deviceModel } from '../devices/devices.model';
import { Document } from 'mongoose';
import { GatewayNotFoundException } from '../exceptions/GatewayNotFoundException';
import { DeviceNotFoundException } from '../exceptions/DeviceNotFoundException';
import { GatewaySaveException } from '../exceptions/GatewaySaveException';


export class GatewayService {

    async getAllGateways(req: Request, res: Response) {
        const gws = await gatewayModel.find({});

        const newGws: Gateway[] = [];
        for (const gw of gws) {
            const temp: Gateway = {} as Gateway;
            temp.IPv4 = (gw as Gateway & Document).IPv4;
            temp.name = (gw as Gateway & Document).name;
            temp.sn = (gw as Gateway & Document).sn;
            const devices = await deviceModel.find({ _id: { $in: (gw as Gateway & Document).devices } });
            temp.devices = (devices as unknown) as Device[];

            newGws.push(temp);
        }

        res.json(newGws);
        // , async (err, data) => {
        //     if (err) {
        //         res.send(err);
        //     }
        //     const newData: Gateway[] = [];
        //     for (const gw of data) {
        //         const devices = await deviceModel.find({ _id: { $in: (gw as Gateway & Document).devices } });
        //         const gwt = (gw as Gateway & Document);
        //         const temp: Gateway = {...(gw as unknown as Gateway)};
        //         console.log(temp);
        //         temp.devices.slice(0, 9);
        //         console.log(temp);
        //     }

        //     res.json(newData);
        // });
    }

    async createGateway(req: Request, res: Response, next: NextFunction) {
        const gateway: Gateway = req.body;
        let ids: any[] | never[] | Device[] = [];
        if (gateway.devices && gateway.devices.length > 0) {
            const devices: Device[] = [...gateway.devices];
            gateway.devices = ids;

            const ds = await deviceModel.insertMany(devices);

            ids = ds.map(x => x._id);
            gateway.devices = ids;
        }
        const saveGateway = new gatewayModel(gateway);

        await saveGateway.save(async (err, data) => {
            if (err) {
                await deviceModel.deleteMany({ _id: { $in: ids } });
                console.log(err);
                
                next(new GatewaySaveException(err));
            }
            res.json(data);
        });
    }

    async deleteGateway(req: Request, res: Response, next: NextFunction) {
        const gw = await gatewayModel.findOne({ sn: req.params.sn });
        if (gw) {
            const ids = (gw as unknown as Gateway).devices.map((x) => (x as unknown as Document)._id);
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
        } else {
            next(new GatewayNotFoundException(req.params.sn));
        }
    }

    async deleteDevice(req: Request, res: Response, next: NextFunction) {
        const gw = await gatewayModel.findOne({ sn: req.params.sn });
        if (gw) {
            const ids = (gw as unknown as Gateway).devices.map((x) => (x as unknown as Document)._id);
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
