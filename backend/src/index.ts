import 'dotenv/config';
import fastify from 'fastify';
import fastifyCookie from 'fastify-cookie';
import authRoutes from './modules/auth/auth.route';

const PORT = process.env.PORT || 3000;

const instance = fastify();

// Register the necessary plugins
instance.register(fastifyCookie, {
  secret: 'your-secret', // for cookies signature
});

// Register routes
instance.register(authRoutes, { prefix: '/auth' });

// Log available routes when the instance is ready
// TODO: Ensure this is removed before production deployment.
instance.ready(() => {
  console.log(instance.printRoutes());
});

// Set up the server to listen
instance.listen({ port: PORT as number }, (err: any) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log('Server listening on http://localhost:3000');
});
