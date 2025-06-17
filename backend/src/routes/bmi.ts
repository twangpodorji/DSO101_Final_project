import { Router, Request, Response } from 'express'
import { errorHandler } from '../utils'
import knex from 'knex'
import { databaseConfig } from '../config'

const router = Router()
const db = knex(databaseConfig)

// GET /api/user/bmi - fetch all BMI records
router.get('/user/bmi', errorHandler(async (req: Request, res: Response) => {
  const records = await db('bmi_records').select('*').orderBy(' created_at ', 'desc')
  res.json(records)
}))

router.post('/create/bmi', errorHandler(async (req: Request, res: Response) => {
  const { id, height, weight,age, bmi } = req.body;

  if (!id || !height || !weight || !age || !bmi) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const [record] = await db('bmi_records')
    .insert({ id, height, weight, bmi })
    .returning('*');

  res.status(201).json(record);
}));

router.post("/", (req: Request, res: Response) => {
  const { height, weight } = req.body;

  if (!height || !weight) {
    return res.status(400).json({ error: "Missing height or weight" });
  }

  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);

  res.status(200).json({ bmi });
});

export default router


