import { getObjectInBucket } from '@pages/api/get-presigned-url';
import { Task } from '@prisma/client';
import { Resolver } from 'types';

const TaskResolvers: Resolver = {
  Task: {
    recording: async (parent: Task) => {
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
  Query: {},
  Mutation: {},
};

export { TaskResolvers };
