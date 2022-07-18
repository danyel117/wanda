import prisma from 'config/prisma';
import { createHash, randomBytes } from 'crypto';

function hashToken(token: string, options: any) {
  const { secret } = options;
  return (
    createHash('sha256')
      // Prefer provider specific secret, but use default secret if none specified
      .update(`${token}${secret}`)
      .digest('hex')
  );
}

const createVerificationRequest = async ({ email }: { email: string }) => {
  const token = randomBytes(32).toString('hex');
  const hashed = hashToken(token, { secret: process.env.NEXTAUTH_SECRET });

  await prisma.verificationToken.create({
    data: {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day
      token: hashed,
      identifier: email,
    },
  });

  return { token };
};

export { createVerificationRequest };
