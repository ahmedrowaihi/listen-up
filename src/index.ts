#!/usr/bin/env node
import yargsParser from "yargs-parser";
import chalk from "chalk";
import { startTunnel } from "./cloudflared-tunnel";
import { runServer } from "./log-server";

const yargsParserOptions = {
  alias: { p: "port", d: "domain" },
  describe: {
    p: "Port to listen on",
    d: "Domain to route to the SSH tunnel (e.g. example.com)",
  },
  default: {
    p: 80,
    d: "",
  },
};

const options = yargsParser(process.argv.slice(2), yargsParserOptions) as unknown as { p: number; d: string };

options.p = !isNaN(options.p) ? options.p : 80;

runServer(options, () => {
  console.log(chalk.blue(`Server listening on port localhost:${options.p}`));
  if (options.d) startTunnel(options);
});
