import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Gateway } from './gateway.model';
import { Device } from './devices.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GatewayService {

  MONGO_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getAllGateways(): Observable<Gateway[]> {
    return this.http.get<Gateway[]>(`${this.MONGO_URL}/gateways`);
  }

  addGateway(gateway: Gateway) {
    return this.http.post(`${this.MONGO_URL}/gateways`, gateway);
  }

  deleteGateway(sn: string) {
    return this.http.delete(`${this.MONGO_URL}/gateways/${sn}`);
  }

  addDevice(device: Device, sn: string) {
    return this.http.post(`${this.MONGO_URL}/gateways/${sn}`, device);
  }

  deleteDevice(uid: number, sn: string) {
    return this.http.delete(`${this.MONGO_URL}/gateways/${sn}/devices/${uid}`);
  }
}
