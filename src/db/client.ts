import { drizzle } from 'drizzle-orm/postgres-js';
import { users } from './schemas/user';
import { env } from '../env';
import postgres from 'postgres';

export const queryClient = postgres(env.DATABASE_URL);

export const db = drizzle(queryClient, {
  schema: {
    users,
  },
});
