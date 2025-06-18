import React from "react";
import { render, screen } from "@testing-library/react";
import BMICalculator from "./App"; // Adjust the path to your component

test("renders BMI Calculator title", () => {
  render(<BMICalculator />);
  const titleElement = screen.getByText(/BMI Calculator/i);
});