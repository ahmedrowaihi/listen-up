import express from "express";
import morgan from "morgan-body";
import { handleRequest } from "./api.js";

export function runServer({ p }, callback: () => void) {
  console.log("Starting server...");
  const app = express();
  morgan(app, {
    logReqUserAgent: false,
    logRequestBody: true,
    logResponseBody: false,
    maxBodyLength: 10000,
  });
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.all("*", handleRequest);
  app.listen(p, callback);
}
