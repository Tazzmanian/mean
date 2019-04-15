import { Device } from './devices.model';

export interface Gateway {
    sn: string;
    name: string;
    IPv4: string;
    devices: Device[];
    _id?: string;
}
