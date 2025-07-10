import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';
import { sendMagicLinkController } from '../controller/send-magic-link-controller';

export const sendMagicLinkRoute: FastifyPluginAsyncZod =
  async app => {
    app.post(
      '/api/auth/magic-link',
      {
        schema: {
          operationId: 'sendMagicLink',
          tags: ['auth'],
          description:
            'Envia um link mágico por email para login',
          body: z.object({
            email: z.email(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { email } = request.body;

        try {
          await sendMagicLinkController({ email });
          return reply.status(204).send();
        } catch (error) {
          console.error(error);
          return reply.status(500).send();
        }
      }
    );
  };
