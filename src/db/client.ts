import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '../env';
import { magicLink } from './schemas/magic-link';
import { users } from './schemas/user';

export const queryClient = postgres(env.DATABASE_URL);

export const db = drizzle(queryClient, {
  schema: {
    users,
    magicLink,
  },
});
