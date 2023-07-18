#!/usr/bin/env node
import yargsParser from "yargs-parser";

const options = yargsParser(process.argv.slice(2), {
  alias: { p: "port", d: "domain" },
  describe: {
    p: "Port to listen on",
    d: "Domain to route to the SSH tunnel (e.g. example.com)",
  },
  default: {
    p: 80,
    d: "",
  },
}) as { p: number; d: string };

options.p = !isNaN(options.p) ? options.p : 80;

import chalk from "chalk";
import { startTunnel } from "./cloudflared-tunnel.js";
import { runServer } from "./log-server.js";
runServer(options, () => {
  console.log(chalk.blue(`Server listening on port localhost:${options.p}`));
  if (options.d) startTunnel(options);
});
