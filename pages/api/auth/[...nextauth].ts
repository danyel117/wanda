import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@config/prisma';
import EmailProvider from 'next-auth/providers/email';
import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';

const getUser = async (email: string) =>
  await prisma.user.findFirst({
    where: {
      email,
    },
  });

const getNextAuthOptions = (req: NextApiRequest) =>
  ({
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
            id: newSession?.user.id,
            role: newSession?.user.role,
          },
        };
      },
      async signIn({ user, account, email }) {
        // if the user has an active session, let it through
        if (await getSession({ req })) {
          return true;
        }

        // if the email was not provided, return false
        if (!user.email) {
          return false;
        }

        // if a verification request email comes, let it through
        if (account.provider === 'email' && email.verificationRequest) {
          return true;
        }

        // fetch the account of the user
        const existingAccount = await prisma.account.findFirst({
          where: {
            providerAccountId: account.providerAccountId,
          },
        });

        // if the account exists, let it through
        if (existingAccount) {
          return true;
        }

        // get the user
        const existingUser = await getUser(user.email);
        // if the user exists but it does not have accounts, create the account and let it through
        if (existingUser) {
          await prisma.account.create({
            data: {
              provider: account.provider,
              type: account.type,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token,
              expires_at: account.expires_at,
              scope: account.scope,
              token_type: account.token_type,
              id_token: account.id_token,
              user: {
                connect: {
                  email: user.email ?? '',
                },
              },
            },
          });
          return true;
        }

        // if the user doesn't exist, create the user, create the account and let it through
        try {
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name,
              image: user.image,
              accounts: {
                create: {
                  provider: account.provider,
                  type: account.type,
                  providerAccountId: account.providerAccountId,
                  access_token: account.access_token,
                  expires_at: account.expires_at,
                  scope: account.scope,
                  token_type: account.token_type,
                  id_token: account.id_token,
                },
              },
            },
          });
          return true;
        } catch {
          return false;
        }
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
      EmailProvider({
        server: {
          host: process.env.EMAIL_SERVER_HOST,
          port: process.env.EMAIL_SERVER_PORT,
          auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
          },
        },
        from: process.env.EMAIL_FROM,
      }),
    ],
  } as NextAuthOptions);

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, getNextAuthOptions(req));
}
