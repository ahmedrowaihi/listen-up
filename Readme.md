# Listen-up | Quick Logging Server for busy Developers

## Express Console Logging Server with SSH Serveo Tunnel Support

This is a simple command-line interface to start an Express server that can optionally spawn an SSH tunnel using serveo.net. The server logs incoming requests to the console and can be used for testing or debugging APIs.

### Installation

```bash
npm install -g @ahmedrowaihi/listen-up
```

### Usage

To start the server, run the following command:

```bash
listen-up [options]
```

Options:
All options are **optional**.

- -p, --port: The **local-port** on which the server should listen (Default: 3000)
- -t, --tunnel: Whether to spawn an SSH tunnel using serveo.net (Default: false)
- -tp, --tunnel-port: The **remote-port** to use for the SSH tunnel (Default: 80)

### Examples

Start a server on port 3000:

```bash
listen-up -p 3000
```

Start a server on port 3000 and spawn an SSH tunnel on port 8080:

```bash
listen-up -p 3000 -t -tp 8080
```

### License

[MIT](https://opensource.org/license/mit/)

### Credits

[
<img src="https://avatars.githubusercontent.com/u/67356781?v=4" width="100px;"/><br /><sub><b>Ahmed Rowaihi</b></sub>
](https://github.com/ahmedrowaihi)
