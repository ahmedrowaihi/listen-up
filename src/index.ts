#!/usr/bin/env node
import chalk from 'chalk';
import { startTunnel } from 'cloudflared-tunnel';
import type { Request, Response } from 'express';

const args = process.argv.slice(2);

function getArgValue(char: string, name: string) {
	const charIdx = args.findIndex((arg) => arg === char);
	const nameIdx = args.findIndex((arg) => arg === name);
	if (charIdx !== -1 && args[charIdx + 1]) return args[charIdx + 1];
	else if (nameIdx !== -1 && args[nameIdx + 1]) return args[nameIdx + 1];
	return '';
}

function hasArg(char: string, name: string) {
	return args.includes(char) || args.includes(name);
}

const port = parseInt(getArgValue('-p', '--port'), 10) || 80;
const startTunnelFlag = hasArg('-c', '--cloudflare');

function handleRequest(req: Request, res: Response) {
	try {
		console.log(chalk.blue(`Query params: ${JSON.stringify(req.query)}`));
		res.send(`Received ${req.method} request for ${req.originalUrl}`);
	} catch (error) {
		res.status(500).send(error);
	}
}

import express from 'express';
import morgan from 'morgan-body';

function runServer(callback: () => void) {
	console.log('Starting server...');
	const app = express();
	morgan(app, {
		logReqUserAgent: false,
		logRequestBody: true,
		logResponseBody: false,
		maxBodyLength: 10000,
	});
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.all('*', handleRequest);
	return app.listen(port, callback); // Return the server instance
}

runServer(() => {
	console.log(chalk.blue(`Server listening on port localhost:${port}`));
	if (startTunnelFlag) {
		startTunnel({
			host: 'http://localhost',
			port: port,
		});
	}
});
