import request from "supertest";
import app from "../src/app"; //

async function testBMICalculatorAPI() {
  console.log("Testing BMI Calculator API...");

  const response = await request(app)
    .post("/api/bmi")
    .send({ height: 170, weight: 65, age: 25 });

  if (response.statusCode !== 200) {
    console.error(`Expected status code 200, but got ${response.statusCode}`);
    return;
  }

  if (!response.body.hasOwnProperty("bmi")) {
    console.error("Response body does not contain 'bmi' property");
    return;
  }

  if (typeof response.body.bmi !== "number") {
    console.error(
      `Expected 'bmi' to be a number, but got ${typeof response.body.bmi}`
    );
    return;
  }

  console.log("Test passed: BMI Calculator API works as expected.");
}

testBMICalculatorAPI();
