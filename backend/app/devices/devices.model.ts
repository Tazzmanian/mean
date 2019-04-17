import { Schema, model } from 'mongoose';

export interface Device {
    UID: number;
    vendor: string;
    date?: Date;
    status: boolean;
}

export const deviceSchema = new Schema({
    UID: {
        type: Number,
        required: 'Need UID',
    },
    vendor: {
        type: String,
        required: 'Need vendor'
    },
    status: {
        type: Boolean,
        required: 'Need status'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

export const deviceModel = model('Device', deviceSchema);
