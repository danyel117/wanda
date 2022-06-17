import { DefaultSession } from 'next-auth';
import { Role } from '@prisma/client';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string | null | undefined;
      role: Role | null | undefined;
    } & DefaultSession['user'];
  }
}
