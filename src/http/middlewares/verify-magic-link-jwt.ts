import type { FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';
import { env } from '../../env';
import { db } from '../../db/client';
import { eq, and, gt } from 'drizzle-orm';
import { magicLink } from '../../db/schemas/magic-link';

export async function verifyMagicLinkJwt(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply
      .status(401)
      .send({ message: 'Token ausente ou malformado!' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decode = jwt.verify(
      token,
      env.JWT_SECRET
    ) as unknown;

    if (
      typeof decode !== 'object' ||
      decode === null ||
      !('email' in decode) ||
      typeof (decode as any).email !== 'string'
    ) {
      return reply
        .status(401)
        .send({ message: 'Token inválido (payload)' });
    }

    const email = (decode as { email: string }).email;
    const now = new Date();

    const tokenInDb = await db.query.magicLink.findFirst({
      where: and(
        eq(magicLink.email, email),
        eq(magicLink.token, token),
        gt(magicLink.expiresAt, now)
      ),
    });

    if (!tokenInDb) {
      return reply
        .status(401)
        .send({ message: 'Token inválido ou expirado' });
    }

    request.user = { email };
  } catch (error: any) {
    console.log(error.message);
    return reply
      .status(401)
      .send({ message: 'Token inválido' });
  }
}
