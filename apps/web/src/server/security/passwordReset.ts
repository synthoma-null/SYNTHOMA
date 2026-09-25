import { createHash, randomBytes } from 'node:crypto';
import { hash } from 'bcryptjs';
import nodemailer from 'nodemailer-smtp';
import prisma from '../../lib/prisma';
import { siteOrigin } from '../siteOrigin';

export function mailConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD && process.env.SMTP_FROM);
}

export const hashResetToken = (token: string) => createHash('sha256').update(token).digest('hex');

export async function requestPasswordReset(email: string, locale: 'cs' | 'en') {
  const user = await prisma.user.findUnique({ where: { emailLower: email.trim().toLowerCase() }, select: { id: true, email: true } });
  if (!user) return;
  const token = randomBytes(32).toString('hex');
  const tokenHash = hashResetToken(token);
  await prisma.passwordResetToken.deleteMany({ where: { expiresAt: { lt: new Date() } } });
  await prisma.passwordResetToken.create({ data: { tokenHash, userId: user.id, expiresAt: new Date(Date.now() + 30 * 60_000) } });
  const url = `${siteOrigin()}/reset-password?locale=${locale}#token=${token}`;
  const port = Number(process.env.SMTP_PORT || 587);
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST, port, secure: port === 465, requireTLS: port !== 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
    connectionTimeout: 10_000, greetingTimeout: 10_000, socketTimeout: 15_000,
    tls: { minVersion: 'TLSv1.2' },
  });
  try {
    await transport.sendMail({
      from: process.env.SMTP_FROM, to: user.email,
      subject: locale === 'en' ? 'SYNTHOMA — Reset your password' : 'SYNTHOMA — Obnovení hesla',
      text: locale === 'en'
        ? `Set a new password using this link (valid for 30 minutes):\n\n${url}\n\nIf you did not request this, ignore this message. Your password has not changed.`
        : `Nové heslo nastavíš přes tento odkaz (platí 30 minut):\n\n${url}\n\nPokud jsi o změnu nežádal/a, zprávu ignoruj. Tvé heslo se nezměnilo.`,
    });
  } catch {
    await prisma.passwordResetToken.deleteMany({ where: { tokenHash } });
    // Do not leak account existence through the endpoint or mail/token details in logs.
    console.error('[password-reset] delivery failed');
  } finally { transport.close(); }
}

export async function resetPassword(token: string, password: string): Promise<boolean> {
  const tokenHash = hashResetToken(token);
  const reset = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });
  if (!reset || reset.expiresAt <= new Date()) return false;
  const passwordHash = await hash(password, 12);
  return prisma.$transaction(async (tx) => {
    const consumed = await tx.passwordResetToken.deleteMany({ where: { tokenHash, expiresAt: { gt: new Date() } } });
    if (consumed.count !== 1) return false;
    await tx.user.update({ where: { id: reset.userId }, data: { passwordHash, sessionVersion: { increment: 1 } } });
    await tx.passwordResetToken.deleteMany({ where: { userId: reset.userId } });
    return true;
  });
}
