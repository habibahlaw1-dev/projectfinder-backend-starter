import request from "supertest";
import app from "../src/app";

describe("Health endpoint", () => {
  it("returns OK", async () => {
    const response = await request(app).get("/api/v1/health");
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
  });
});