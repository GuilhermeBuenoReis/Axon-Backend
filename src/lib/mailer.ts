import nodemailer from 'nodemailer';
import { env } from '../env';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.MAIL_FROM,
    pass: env.MAIL_PASSWORD,
  },
});
