import chalk from 'chalk';
import { bin, install, tunnel } from 'cloudflared';
import { createSpinner } from 'nanospinner';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import { resolve } from 'node:path';
import readlineSync from 'readline-sync';
import { TUNNELNAME } from './constants';
import type { Domain, Tunnel } from './types';

export async function setup() {
	if (fs.existsSync(bin)) return console.log(chalk.blue('Cloudflared binary already installed.'));
	const spinner = createSpinner('Installing cloudflared binary...').start();
	await install(bin)
		.then(() =>
			spinner.success({
				text: 'Installed cloudflared binary.',
			})
		)
		.catch((err) => {
			spinner.error({
				text: 'Failed to install cloudflared binary.',
			});
			console.log(chalk.red(err));
			process.exit(1);
		});
}

export async function cloudflaredLogin() {
	return spawnSync(bin, ['login'], { stdio: 'inherit' });
}

export function createTunnel() {
	const spinner = createSpinner('Creating tunnel...').start();
	const result = spawnSync(bin, ['tunnel', 'create', TUNNELNAME], {
		stdio: 'inherit',
	});
	if (result.status === 0)
		spinner.success({
			text: 'Created tunnel.',
		});
	else throw new Error('Failed to create tunnel.');
}

export function routeDnsToTunnel(domain: Domain) {
	let DOMAIN = domain || readlineSync.question('Enter your authorized domain (e.g. example.com): \n');
	DOMAIN = DOMAIN.replace(/^(https?:\/\/)?(www\.)?/i, '').replace(/\/$/, ''); // remove http(s)://, www. and trailing slash
	const spinner = createSpinner('Routing DNS to tunnel...').start();
	const result = spawnSync(bin, ['tunnel', 'route', 'dns', '-f', TUNNELNAME, `${TUNNELNAME}.${DOMAIN}`], {
		stdio: 'inherit',
	});
	if (result.status === 0)
		spinner.success({
			text: 'Routed DNS to tunnel.',
		});
	else {
		spinner.error({
			text: 'Failed to route DNS to tunnel.',
		});
		console.log(chalk.red(result.stderr));
		process.exit(1);
	}
}

export async function checkListenUpTunnelExist(domain: Domain) {
	console.log(chalk.blue('Checking for existing tunnels...'));
	const result = spawnSync(bin, ['tunnel', 'list']);
	if (result.status === 0) {
		const lines = result.stdout.toString().trim().split('\n');
		const tunnelDetails = {} as Tunnel;
		const tunnelExist = lines.slice(2).some((line) => {
			const [id, name] = line.trim().split(/\s+/);
			if (name === TUNNELNAME) {
				tunnelDetails.id = id;
				tunnelDetails.name = name;
				return true;
			}
		});
		if (!tunnelExist) createTunnel();
		console.log(chalk.green('Found existing tunnel.'));
		routeDnsToTunnel(domain);
		return tunnelDetails;
	} else throw new Error('Failed to list tunnels');
}

export async function privateStartTunnel(_tunnel: Tunnel, port: number) {
	const { url, connections, child, stop } = tunnel({
		'--credentials-file': resolve(os.homedir(), '.cloudflared', `${_tunnel.id}.json`),
		'--url': `http://localhost:${port}`,
		tunnel: TUNNELNAME,
	});

	console.log(`Secure tunnel URL: ${await url}`);
	console.log('Connections Ready!', await Promise.all(connections));
	process.stdin.setRawMode(true);
	process.stdin.resume();
	process.stdin.on('data', async (data) => (data.toString().toLocaleLowerCase() === 'q' ? stop() : console.log('Press Q to quit')));
	child.on('exit', (code) => {
		console.log('tunnel process exited with code', code);
		process.exit();
	});
}

export async function startTunnel({ d: domain, p: port }) {
	await setup();
	await cloudflaredLogin();
	const privateTunnel = await checkListenUpTunnelExist(domain);
	console.log(chalk.blue('Starting tunnel...'));
	privateStartTunnel(privateTunnel, port);
}
