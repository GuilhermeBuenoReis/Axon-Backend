import { findUserByEmail } from './find-user-by-email-controller';
import { db } from '../../db/client';
import { users } from '../../db/schemas/user';
import { eq } from 'drizzle-orm';

jest.mock('../../db/client', () => ({
  db: {
    select: jest.fn(() => ({
      from: jest.fn(() => ({
        where: jest.fn(),
      })),
    })),
  },
}));

const mockSelect = db.select as jest.Mock;

describe('findUserByEmail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a user if one exists with the given email', async () => {
    const fakeUser = {
      id: '1',
      name: 'Jhon',
      email: 'jhondoe@gmail.com',
      password: 'hashedpass',
    };

    const mockWhere = jest
      .fn()
      .mockResolvedValue([fakeUser]);
    const mockFrom = jest.fn(() => ({ where: mockWhere }));
    mockSelect.mockReturnValue({ from: mockFrom });

    const result = await findUserByEmail({
      email: 'jhondoe@gmail.com',
    });

    expect(mockSelect).toHaveBeenCalled();
    expect(mockFrom).toHaveBeenCalledWith(users);
    expect(mockWhere).toHaveBeenCalledWith(
      eq(users.email, 'jhondoe@gmail.com')
    );
    expect(result).toEqual(fakeUser);
  });

  it('should return null if no user is found', async () => {
    const mockWhere = jest.fn().mockResolvedValue([]);
    const mockFrom = jest.fn(() => ({ where: mockWhere }));
    mockSelect.mockReturnValue({ from: mockFrom });

    const result = await findUserByEmail({
      email: 'notfound@email.com',
    });

    expect(result).toBeNull();
  });
});
