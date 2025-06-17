import request from "supertest";
import app from "../src/app.ts"; // adjust if needed

describe("BMI Calculator API", () => {
  it("should return a BMI value", async () => {
    const response = await request(app)
      .post("/api/bmi")
      .send({ height: 170, weight: 65, age: 25 });

    expect(response.statusCode).toBe(200);
    expect(response.body.bmi).toBeDefined();
  });
});
