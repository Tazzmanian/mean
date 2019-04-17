import { app } from "../app/server";
import request from "supertest";
import { Gateway } from "../app/gateways/gateway.model";
import mongoose from 'mongoose';
import { Device } from "../app/devices/devices.model";
import { HttpException } from "../app/exceptions/HttpException";


describe("simple api tests", () => {

  const gw: Gateway = {
    IPv4: '192.168.1.1',
    name: 'TT',
    sn: 'asd123',
    devices: [
      {
        status: true,
        UID: 123,
        vendor: 'vendor'
      }
    ]
  };

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  it("add gateway", async () => {
    const result = await request(app.app)
      .post("/gateways").send(gw);
    // console.log(result);

    expect(result.status).toEqual(200);
    const body: Gateway = result.body;
    expect(body.IPv4).toEqual(gw.IPv4);
    expect(body.sn).toEqual(gw.sn);
    expect(body.name).toEqual(gw.name);
    expect(body.devices.length).toEqual(gw.devices.length);
  });

  it("find gateways", async () => {
    const url = `/gateways`;
    const result = await request(app.app)
      .get(url);
    expect(result.status).toEqual(200);
    const body: Gateway[] = result.body;
    expect(body.length).toEqual(1);
    expect(body[0].IPv4).toEqual(gw.IPv4);
    expect(body[0].name).toEqual(gw.name);
    expect(body[0].sn).toEqual(gw.sn);
    expect(body[0].devices[0].UID).toEqual(gw.devices[0].UID);
    expect(body[0].devices[0].status).toEqual(gw.devices[0].status);
    expect(body[0].devices[0].vendor).toEqual(gw.devices[0].vendor);
  });

  it("add device", async () => {
    const d: Device = {
      status: true,
      UID: 1234,
      vendor: 'vendor'
    }
    const result = await request(app.app)
      .post("/gateways/asd123/devices").send(d);
    expect(result.status).toEqual(200);

    const body: Device = result.body;
    expect(body.UID).toEqual(d.UID);
    expect(body.status).toEqual(d.status);
    expect(body.vendor).toEqual(d.vendor);
  });

  it("find gateways after new device", async () => {
    const url = `/gateways`;
    const result = await request(app.app)
      .get(url);
    expect(result.status).toEqual(200);
    const body: Gateway[] = result.body;
    expect(body.length).toEqual(1);
    expect(body[0].devices.length).toEqual(2);
  });

  it("delete device", async () => {
    const result = await request(app.app)
      .delete('/gateways/asd123/devices/1234');
    expect(result.status).toEqual(200);
  });

  it("find gateways after delete device", async () => {
    const url = `/gateways`;
    const result = await request(app.app)
      .get(url);
    expect(result.status).toEqual(200);
    const body: Gateway[] = result.body;
    expect(body.length).toEqual(1);
    expect(body[0].devices.length).toEqual(1);
  });

  it("delete missing device", async () => {
    const result = await request(app.app)
      .delete('/gateways/asd123/devices/1234');
    expect(result.status).toEqual(404);
    expect((result.body as unknown as HttpException).message).toEqual('Post with id 1234 not found');
  });

  it("delete gateway", async () => {
    const url = `/gateways/${gw.sn}`;
    const result = await request(app.app)
      .delete(url);
    expect(result.status).toEqual(200);
  });

  it("find gateways after gateway", async () => {
    const url = `/gateways`;
    const result = await request(app.app)
      .get(url);
    expect(result.status).toEqual(200);
    const body: Gateway[] = result.body;
    expect(body.length).toEqual(0);
  });

});
