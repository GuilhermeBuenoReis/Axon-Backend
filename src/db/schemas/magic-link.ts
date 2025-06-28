import {
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { v4 as uuidV4 } from 'uuid';

export const magicLink = pgTable('magic_link', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuidV4()),
  email: text('email').notNull().unique(),
  token: text('token').notNull(),
  expiresAt: timestamp('expires_at', {
    mode: 'date',
  }).notNull(),
});
