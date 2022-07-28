import { Request, Response } from "express";
import { e2eService } from "../services/e2eService.js";

async function reset(req: Request, res: Response) {
  await e2eService.truncate();
  console.log("Database truncated");
  res.sendStatus(200);
}

async function seed(req: Request, res: Response) {
  await e2eService.seed();

  res.sendStatus(200);
}

export default {
  reset,
  seed,
};