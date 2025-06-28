import { eq, type InferInsertModel } from 'drizzle-orm';
import { db } from '../../db/client';
import { users } from '../../db/schemas/user';

type User = InferInsertModel<typeof users>;

interface findUserRequest {
  email: string;
}
export async function findUserByEmail({
  email,
}: findUserRequest): Promise<User | null> {
  const response = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  return response[0] ?? null;
}
