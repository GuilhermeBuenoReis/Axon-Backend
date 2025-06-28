import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import { db } from '../../db/client';
import { v4 as uuidv4 } from 'uuid';
import { magicLink } from '../../db/schemas/magic-link';
import { transporter } from '../../lib/mailer';

interface SendMagicLinkRequest {
  email: string;
}

export async function sendMagicLinkController({
  email,
}: SendMagicLinkRequest) {
  const token = jwt.sign(
    { email },
    process.env.JWT_SECRET!,
    {
      expiresIn: '15m',
    }
  );

  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await db
    .delete(magicLink)
    .where(eq(magicLink.email, email));

  await db.insert(magicLink).values({
    id: uuidv4(),
    email,
    token,
    expiresAt,
  });

  const magicLinkUrl = `${process.env.FRONTEND_URL}/auth/magic-link?token=${token}`;

  await transporter.sendMail({
    to: email,
    subject: 'Seu link mágico de login',
    html: `
      <h1>🔒 Login seguro</h1>
      <p>Use o link abaixo para acessar sua conta. Ele expira em 15 minutos:</p>
      <a href="${magicLinkUrl}">Entrar agora</a>
    `,
  });

  return { success: true };
}
