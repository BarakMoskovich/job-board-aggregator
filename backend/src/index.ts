import fastify from 'fastify';
import routes from './routes';

const server = fastify({ logger: true });

// Register routes
server.register(routes);

// Start the server
const start = async () => {
  try {
    await server.listen({ port: 3000 });
    server.log.info(`Server listening on http://localhost:3000`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
