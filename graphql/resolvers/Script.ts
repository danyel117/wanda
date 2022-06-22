import { Script } from '@prisma/client';
import prisma from '@config/prisma';
import { getObjectInBucket } from 'pages/api/get-presigned-url';
import { Resolver } from 'types';

const ScriptResolvers: Resolver = {
  Script: {
    recording: async (parent: Script) => {
      const bucket = 'wanda-media';
      const path = parent?.recording?.replace(
        `https://${bucket}.s3.amazonaws.com/`,
        ''
      );
      if (path) {
        const audio = await getObjectInBucket(bucket, path, 'audio/mpeg');
        return audio;
      }

      return null;
    },
  },
  Query: {
    getScripts: async (parent, args, context) =>
      await prisma.script.findMany({
        where: {
          userId: {
            equals: context.session?.user.id ?? '',
          },
        },
      }),
  },
  Mutation: {},
};

export { ScriptResolvers };
