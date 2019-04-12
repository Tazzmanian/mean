import { Device } from '../devices/devices.model';
import { Schema, model, Mongoose } from 'mongoose';
import { isIPv4 } from 'net';

export interface Gateway {
    sn: string;
    name: string;
    IPv4: string;
    devices: Device[];
}

const gatewaySchema = new Schema({
    sn: {
        type: String,
        unique: true,
        required: 'Need SN'
    },
    name: {
        type: String,
        required: 'Need name'
    },
    IPv4: {
        type: String,
        required: 'Need IPv4',
        validate: [
            (val) => {
                return isIPv4(val);
            },
            'Invalid IPv4'
        ]
    },
    devices: {
        ref: 'Device',
        type: [Schema.Types.ObjectId],
        validate: [
            (val: []) => {
                console.log(val.length, val);
                return val.length <= 10;
            },
            'Exceeds the max number of connections (10)'
        ]
    }
});

export const gatewayModel = model('Gateway', gatewaySchema);
