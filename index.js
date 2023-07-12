#!/usr/bin/env node
import express from "express";
import morgan from "morgan-body";
import yargsParser from "yargs-parser";
import bodyParser from "body-parser";
import chalk from "chalk";
import { spawn } from "child_process";

const app = express();

const options = yargsParser(process.argv.slice(2), {
  alias: { p: "port", t: "tunnel", tp: "tunnel-port" },
  describe: {
    p: "Port to listen on",
    t: "Spawn an SSH tunnel using serveo.net",
    tp: "Remote port to use for SSH tunnel",
  },
  demandOption: "p",
});
// Set default values for options
options.port = !isNaN(options.port) ? options.port : 80;
options.tp = !isNaN(options.tp) ? options.tp : 80;
options.tunnel = options.tunnel ? true : false;

morgan(app, {
  stream: {
    write: (message) => console.log(message.trim()),
  },
  logReqUserAgent: false,
  logRequestBody: true,
  logResponseBody: false,
  maxBodyLength: 10000,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.all("*", (req, res) => {
  console.log(chalk.blue(`Query params: ${JSON.stringify(req.query)}`));
  res.send(`Received ${req.method} request for ${req.originalUrl}`);
});

console.log(options);

app.listen(options.port, () => {
  console.log(`Server listening on port ${options.port}`);

  if (options.tunnel) {
    console.log(`Spawning SSH tunnel...`);
    const tunnel = spawn("ssh", [
      "-R",
      options.tp + ":localhost:" + options.port,
      "serveo.net",
    ]);
    console.log(options.tp + ":localhost:" + options.port, "serveo.net");
    tunnel.stdout.on("data", (data) => {
      console.log(`SSH tunnel stdout: ${data}`);
    });
    tunnel.stderr.on("data", (data) => {
      console.error(`SSH tunnel stderr: ${data}`);
    });
    tunnel.on("close", (code) => {
      console.log(`SSH tunnel process exited with code ${code}`);
    });
  }
});
