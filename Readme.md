# Listen-up - Express Console Logging Server with Cloudflared Tunnel Support

[![npm version](https://badge.fury.io/js/%40ahmedrowaihi%2Flisten-up.svg)](https://badge.fury.io/js/%40ahmedrowaihi%2Flisten-up) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This is a simple command-line interface to start an Express server that can optionally spawn an SSH tunnel using Cloudflared. The server logs incoming requests to the console and can be used for testing or debugging APIs.

## Installation

```bash
npm install -g @ahmedrowaihi/listen-up
```

## Usage

To start the server, run the following command:

```bash
listen-up [options]
```

Options: All options are **optional**.

- -p, --port: The **local-port** on which the server should listen (Default: 80)
- -c, --cloudflared: Whether to spawn a **Cloudflared tunnel** or not (Default: false)

## Examples

Start a server on port 80:

```bash
listen-up -p 80
```

Start a server on port 80 and tunnel it through Cloudflared:

- Requires a **Cloudflare account** and a **Domain managed by Cloudflare**!

```bash
listen-up -p 80 -c
```

## Features

- [x] Start an Express server on a specified port
- [x] Log incoming requests to the console
- [x] Optionally spawn an SSH tunnel using Cloudflared
- [x] Automatically generate a random domain name for the SSH tunnel

## License

[MIT](https://opensource.org/license/mit/)

## Credits

[ <img src="https://avatars.githubusercontent.com/u/67356781?v=4" width="100px;"/><br /><sub><b>Ahmed Rowaihi</b></sub> ](https://github.com/ahmedrowaihi)
