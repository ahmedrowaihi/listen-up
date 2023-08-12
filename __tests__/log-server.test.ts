import request from 'supertest';
import { runServer } from '../src/log-server';

describe('Log Server', () => {
	let server: ReturnType<typeof runServer>;

  // Start the server before each test
  beforeEach((done) => {
    server = runServer({ p: 3000 }, done);
  });

  // Close the server after each test
  afterEach((done) => {
    server.close(done);
  });

  it('should start the server without errors', (done) => {
    request(server)
      .get('/') // Assuming the server responds to GET requests at the root path
      .expect(200) // Expecting a 200 OK response
			.end((err: unknown) => {
        if (err) return done(err);
        done();
      });
  });

  // Additional tests for request handling and other scenarios can be added here
});
