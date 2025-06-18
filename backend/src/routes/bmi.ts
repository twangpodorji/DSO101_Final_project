import { Router, Request, Response, NextFunction } from "express";
import { errorHandler } from "../utils";
import knex from "knex";
import { databaseConfig } from "../config";

const router = Router();
const db = knex(databaseConfig);

/**
 * Function to calculate BMI
 * @param height - Height in centimeters
 * @param weight - Weight in kilograms
 * @returns BMI value or an error message
 */
export const calculateBMI = (
  height: number,
  weight: number
): number | string => {
  if (!height || !weight) {
    return "Missing height or weight";
  }

  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);

  return bmi;
};

// GET /api/user/bmi - fetch all BMI records
router.get(
  "/user/bmi",
  errorHandler(async (req: Request, res: Response) => {
    const records = await db("bmi_records")
      .select("*")
      .orderBy("created_at", "desc");
    res.json(records);
  })
);

// POST /create/bmi - create a new BMI record
router.post(
  "/create/bmi",
  errorHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id, height, weight, age, bmi } = req.body;

    if (!id || !height || !weight || !age || !bmi) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const [record] = await db("bmi_records")
      .insert({ id, height, weight, age, bmi })
      .returning("*");

    res.status(201).json(record);
  })
);

// POST /calculate - calculate BMI

export default router;
