import prisma from '@config/prisma';
import { Resolver } from 'types';

const UserResolvers: Resolver = {
  Query: {},
  Mutation: {
    updateUserNameRole: async (parent, args, context) =>
      await prisma.user.update({
        where: {
          id: context?.session?.user?.id ?? '',
        },
        data: {
          name: args.name,
          roles: {
            connect: {
              name: args.role,
            },
          },
        },
      }),
  },
};

export { UserResolvers };
