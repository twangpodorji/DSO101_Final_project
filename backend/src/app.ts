import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import knex from "knex";
import cors from "cors";
import { errorHandler } from "./utils";
import { NotFoundError } from "./errors";
import { PRODUCTION, JWT_SECRET, REFRESH_JWT_SECRET } from "./constants";
import routes from "./routes";
import { databaseConfig } from "./config";
import HTTP_CODE from "./errors/httpCodes";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import bmiRouter from "./routes/bmi"; // 
dotenv.config();

// this is required to ensure that the environment variables are loaded before any other imports
console.log(`Running in ${PRODUCTION ? "PRODUCTION" : "DEVELOPMENT"} mode\n`);

// to initialize the database connection when the app starts
const knexConnection = knex(databaseConfig);
knexConnection
  .raw(
    `
SELECT table_name
FROM information_schema.tables
WHERE table_schema='public';
`
  )
  .then((data) => {
    console.log(data.rows);
    console.log("\nDatabase connection successful\n");
  })
  .catch((error) => {
    console.error("\nDatabase connection error");
    console.error(error);
  });

// Start express app and then set up middlewares and routes
const app = express();

app.set("JWT_SECRET", JWT_SECRET);
app.set("REFRESH_JWT_SECRET", REFRESH_JWT_SECRET);

app.disable("x-powered-by");
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());

export const API_PREFIX = "/api";

app.use(`${API_PREFIX}/public`, express.static("public"));
app.use(`${API_PREFIX}/uploads`, express.static("uploads"));
app.use(API_PREFIX, routes);
app.use("/api/bmi", bmiRouter); 

// 404 Not Found Handler
app.use(
  errorHandler((req: Request, res: Response, next: NextFunction) => {
    throw new NotFoundError("Endpoint not Found");
  })
);

// Catch all for undefined routes (optional)
app.use("*", (req, res) => {
  console.log("Endpoint not Found");
  res.status(404).send("Endpoint Not Found");
});

interface ExpressError extends Error {
  status?: number;
  errors?: any;
  additionalInfo?: any;
}

//  the error handler middleware
app.use(
  (err: ExpressError, req: Request, res: Response, next: NextFunction) => {
    const isUnexpectedError = err.status === undefined;
    console.log(err.message);
    console.log(err.stack);
    res.status(err.status || HTTP_CODE.INTERNAL_ERROR);
    res.json({
      // For unexpected errors in production, hide the message since it could contain relevant info
      message: isUnexpectedError && PRODUCTION ? "Internal error" : err.message,
      errors: err.errors,
      ...(err.additionalInfo || {}),
    });
  }
);

export default app;
