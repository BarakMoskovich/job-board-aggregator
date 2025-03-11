import fastify from 'fastify';
import fastifyCookie from 'fastify-cookie';
import authRoutes from './modules/auth/auth.route';
import userRoutes from './modules/user/user.route';
import { env } from './config/env';

const instance = fastify();

// Register the necessary plugins
instance.register(fastifyCookie, {
  secret: env.COOKIE_SECRET,
});

// Register routes
instance.register(authRoutes, { prefix: '/auth' });
instance.register(userRoutes, { prefix: '/user' });

// Log available routes when the instance is ready
// TODO: Ensure this is removed before production deployment.
instance.ready(() => {
  console.log(instance.printRoutes());
});

// Set up the server to listen
instance.listen({ port: env.PORT as number }, (err: any) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log(`Server listening on http://localhost:${env.PORT}`);
});
