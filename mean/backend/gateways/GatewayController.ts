import { Router, Request, Response } from 'express';
import { Gateway, gatewayModel } from './gateway.model';
import { Device, deviceModel } from '../devices/devices.model';
import { Document } from 'mongoose';
import { NextFunction } from 'connect';
import { GatewayNotFoundException } from '../exceptions/GatewayNotFoundException';
import { DeviceNotFoundException } from '../exceptions/DeviceNotFoundException';
import { GatewayService } from './GatewayService';


export class GatewayController {
    public router = Router();
    private service: GatewayService = new GatewayService();

    constructor() {
        this.service = new GatewayService();
        this.initRoutes();
    }

    initRoutes() {
        this.router.post('/gateways', this.service.createGateway);
        this.router.get('/gateways', this.service.getAllGateways);
        this.router.delete('/gateways/:sn', this.service.deleteGateway);
        this.router.post('/gateways/:sn/devices', this.service.createDevice);
        this.router.delete('/gateways/:sn/devices/:uid', this.service.deleteDevice);
    }
}

