import jwt from 'jsonwebtoken';
import { env } from '../env';

export function generateMagicLinkToken(email: string) {
  const payload = { email };

  const token = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: '15m', // 15 minutos pro link expirar
  });

  return token;
}
