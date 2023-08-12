import { setup, startTunnel } from '../src/cloudflared-tunnel';

describe('Cloudflared Tunnel', () => {
	it('should setup without errors', async () => {
		await expect(setup()).resolves.not.toThrow();
	}, 10000);

  // it('should start tunnel without errors', async () => {
  //   await expect(startTunnel({ d: 'domain', p: 80 })).resolves.not.toThrow();
  // });

  // Additional tests for other functions and scenarios
});
