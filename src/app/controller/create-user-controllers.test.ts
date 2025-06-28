const mockValues = jest.fn();
const mockInsert = jest.fn(() => ({
  values: mockValues,
}));

jest.mock('../../db/client', () => ({
  db: {
    insert: mockInsert,
  },
}));

import { createUserController } from './create-user-controller';
import bcrypt from 'bcrypt';
import { users } from '../../db/schemas/user';
import * as findUserModule from './find-user-by-email';

jest.mock('bcrypt');
const mockHash = bcrypt.hash as jest.Mock;
const mockFindUser = jest.spyOn(
  findUserModule,
  'findUserByEmail'
);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Create User Controller', () => {
  it('should be able to create a new user if the email is not registered', async () => {
    mockFindUser.mockResolvedValue(null);
    mockHash.mockResolvedValue('hashedPassword');
    mockValues.mockResolvedValue({ id: 1 });

    const result = await createUserController({
      name: 'Jhon doe',
      email: 'jhondoe@gmail.com',
      password: '123456',
    });

    expect(mockHash).toHaveBeenCalledWith('123456', 6);
    expect(mockInsert).toHaveBeenCalledWith(users);
    expect(mockValues).toHaveBeenCalledWith({
      name: 'Jhon doe',
      email: 'jhondoe@gmail.com',
      password: 'hashedPassword',
    });

    expect(result).toEqual({ user: { id: 1 } });
  });

  it('should return an error if the email is already registered', async () => {
    mockFindUser.mockResolvedValue({
      id: '1',
      name: 'Jhon doe',
      email: 'jhondoe@gmail.com',
      password: 'hashedPassword',
    });

    const result = await createUserController({
      name: 'Jhon doe',
      email: 'jhondoe@gmail.com',
      password: '123456',
    });

    expect(result).toBe('Email já cadastrado!');
    expect(mockHash).not.toHaveBeenCalled();
    expect(mockInsert).not.toHaveBeenCalled();
  });
});
