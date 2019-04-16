import {app} from "../app/server";
import request from "supertest";

describe("GET / - a simple api endpoint", () => {
  it("Hello API Request", async () => {
    const result = await request(app.app).get("/gateways");
    expect(result.text).toEqual("hello");
    expect(result.status).toEqual(200);
  });
});


// describe("Simple expression tests", () => {
//     test("Check literal value", () => {
//         expect(5).toBeCloseTo(5);
//     });
//     test("Check addition", () => {
//         expect(3).toBeCloseTo(15);
//     });
//     test("Check subtraction", () => {
//         expect(1).toBeCloseTo(-5);
//     });
//     test("Check multiplication", () => {
//         expect(2).toBeCloseTo(50);
//     });
//     test("Check division", () => {
//         expect(3).toBeCloseTo(2);
//     });
// });
