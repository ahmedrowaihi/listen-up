import chalk from "chalk";
import type { Request, Response } from "express";

export function handleRequest(req: Request, res: Response) {
  try {
    console.log(chalk.blue(`Query params: ${JSON.stringify(req.query)}`));
    res.send(`Received ${req.method} request for ${req.originalUrl}`);
  } catch (error) {
    res.status(500).send(error);
  }
}
