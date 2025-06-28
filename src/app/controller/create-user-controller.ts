import { users } from '../../db/schemas/user';
import { db } from '../../db/client';
import bcrypt from 'bcrypt';
import { findUserByEmail } from './find-user-by-email';

interface userRequest {
  name: string;
  email: string;
  password: string;
}

export async function createUserController({
  name,
  email,
  password,
}: userRequest) {
  const userAlredyExist = await findUserByEmail({ email });

  if (userAlredyExist) {
    return 'Email já cadastrado!';
  }

  console.log('>> Vai hashear a senha agora');
  const passwordHash = await bcrypt.hash(password, 6);

  const user = await db.insert(users).values({
    name,
    email,
    password: passwordHash,
  });

  return {
    user,
  };
}
