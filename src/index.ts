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
}) as { port: number; domain: string; d: string };

options.port = !isNaN(options.port) ? options.port : 80;

import chalk from "chalk";
import { runServer } from "./log-server.js";
runServer(options, () => {
  console.log(chalk.blue(`Server listening on port ${options.port}`));
  if (options.d) startTunnel(options);
});

import {
  checkListenUpTunnelExist,
  cloudflaredLogin,
  setup,
  _startTunnel,
} from "./cloudflared-tunnel.js";

export async function startTunnel(options) {
  await setup();
  await cloudflaredLogin();
  const _tunnel = await checkListenUpTunnelExist(options.d);
  console.log(chalk.blue("Starting tunnel..."));
  _startTunnel(_tunnel, options);
}
