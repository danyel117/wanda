import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from 'config/prisma';

export default NextAuth({
  callbacks: {
    async session({ session, user }) {
      const newSession = await prisma.session.findFirst({
        where: {
          userId: user.id,
        },
        include: {
          user: {
            include: {
              role: true,
            },
          },
        },
      });

      return {
        ...session,
        user: {
          ...session.user,
          role: newSession?.user.role,
        },
      };
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    }),
  ],
});
