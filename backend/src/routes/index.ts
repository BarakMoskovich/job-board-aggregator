import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export default async function routes(fastify: FastifyInstance) {
  fastify.get(
    '/hello',
    async (request: FastifyRequest, reply: FastifyReply) => {
      return { message: 'Hello from the routes folder!' };
    },
  );
}
