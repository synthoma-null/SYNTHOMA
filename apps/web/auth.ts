import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import prisma from './src/lib/prisma';
import { consumeRateLimit, requestAddress } from './src/server/security/rateLimit';

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        identifier: { label: 'Přezdívka nebo e-mail', type: 'text' },
        password: { label: 'Heslo', type: 'password' },
      },
      async authorize(credentials, request) {
        const identifier = (credentials?.identifier as string | undefined) ?? '';
        const password = (credentials?.password as string | undefined) ?? '';
        if (!identifier || !password || identifier.length > 254 || new TextEncoder().encode(password).length > 72) {
          console.error('[auth] authorize: missing identifier or password');
          return null;
        }

        const lower = identifier.toLowerCase().trim();
        const [accountLimit, addressLimit] = await Promise.all([
          consumeRateLimit('login-account', lower, 10, 15 * 60_000),
          consumeRateLimit('login-address', requestAddress(request.headers), 50, 15 * 60_000),
        ]);
        if (!accountLimit.allowed || !addressLimit.allowed) return null;
        let user = await prisma.user.findFirst({
          where: {
            OR: [{ emailLower: lower }, { nicknameLower: lower }],
          },
        });

        // Fallback for legacy accounts without emailLower/nicknameLower populated
        if (!user) {
          user = await prisma.user.findFirst({
            where: {
              OR: [
                { email: { equals: lower, mode: 'insensitive' } },
                { nickname: { equals: lower, mode: 'insensitive' } },
              ],
            },
          });
          // Backfill the lower fields so future logins use the fast path
          if (user) {
            await prisma.user.update({
              where: { id: user.id },
              data: {
                emailLower: user.email.toLowerCase().trim(),
                nicknameLower: user.nickname.toLowerCase().trim(),
              },
            });
          }
        }

        if (!user) {
          // Do not disclose submitted identifiers in application logs.
          return null;
        }

        const valid = await compare(password, user.passwordHash);
        if (!valid) {
          console.error('[auth] authorize: invalid password for user:', user.id);
          return null;
        }

        try {
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
          });
        } catch (e) {
          console.error('[auth] authorize: lastLoginAt update failed (column may be missing):', e);
        }

        return {
          id: user.id,
          email: user.email,
          name: user.nickname,
          role: user.role,
          sessionVersion: user.sessionVersion,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? 'user';
        token.nickname = user.name ?? '';
        token.sessionVersion = (user as { sessionVersion?: number }).sessionVersion ?? 0;
      }
      if (!token.id) return null;
      const current = await prisma.user.findUnique({
        where: { id: token.id as string }, select: { role: true, sessionVersion: true },
      });
      if (!current || current.sessionVersion !== (token.sessionVersion ?? 0)) return null;
      token.role = current.role;
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
        (session.user as { nickname?: string }).nickname = token.nickname as string;
      }
      return session;
    },
  },
});
