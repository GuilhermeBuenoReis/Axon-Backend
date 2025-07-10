import jwt from 'jsonwebtoken';
import { db } from '../../db/client';
import { magicLink } from '../../db/schemas/magic-link';
import { eq } from 'drizzle-orm';

interface verifyLoginByTokenRequest {
  token: string;
}
export async function verifyLoginByToken({
  token,
}: verifyLoginByTokenRequest) {
  const verifyToken = await db.select().from(magicLink);
}
