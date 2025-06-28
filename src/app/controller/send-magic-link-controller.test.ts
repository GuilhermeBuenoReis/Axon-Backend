import { sendMagicLinkController } from './send-magic-link-controller';
import { db } from '../../db/client';
import { transporter } from '../../lib/mailer';
import { magicLink } from '../../db/schemas/magic-link';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../../env';

jest.mock('../../db/client');
jest.mock('../../lib/mailer');
jest.mock('jsonwebtoken');
jest.mock('uuid');

describe('sendMagicLinkController', () => {
  const email = 'test@example.com';

  beforeEach(() => {
    jest.clearAllMocks();
    env.JWT_SECRET = 'secret-test';
    env.FRONTEND_URL = 'http://localhost:3000';

    (uuidv4 as jest.Mock).mockReturnValue('mocked-uuid');
    (jwt.sign as jest.Mock).mockReturnValue(
      'mocked-jwt-token'
    );

    (db.delete as jest.Mock).mockReturnValue({
      where: jest.fn(),
    });
    (db.insert as jest.Mock).mockReturnValue({
      values: jest.fn(),
    });
    (transporter.sendMail as jest.Mock).mockResolvedValue(
      true
    );
  });

  it('should generate a token, store it and send a magic link email', async () => {
    const result = await sendMagicLinkController({ email });

    expect(jwt.sign).toHaveBeenCalledWith(
      { email },
      'secret-test',
      { expiresIn: '15m' }
    );

    expect(db.delete).toHaveBeenCalledWith(magicLink);
    expect(db.insert).toHaveBeenCalledWith(magicLink);
    expect(transporter.sendMail).toHaveBeenCalledWith({
      to: email,
      subject: 'Seu link mágico de login',
      html: expect.stringContaining('Entrar agora'),
    });

    expect(result).toEqual({ success: true });
  });
});
