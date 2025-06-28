import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';
import { createUserController } from '../controller/create-user-controller';

export const createUserRoute: FastifyPluginAsyncZod =
  async app => {
    app.post(
      '/api/user/create',
      {
        schema: {
          operationId: 'createUser',
          tags: ['user'],
          description: 'Create new user',
          body: z.object({
            name: z.string(),
            email: z.email(),
            password: z.string(),
          }),
          response: {
            201: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { name, email, password } = request.body;

        try {
          await createUserController({
            name,
            email,
            password,
          });

          return reply.status(201).send();
        } catch (error) {
          console.log(error);
          return reply.status(400).send();
        }
      }
    );
  };
