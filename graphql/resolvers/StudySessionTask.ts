import { transcribe } from '@config/aws';
import prisma from 'config/prisma';
import { nanoid } from 'nanoid';
import { Resolver } from 'types';

const StudySessionTaskResolvers: Resolver = {
  Query: {},
  Mutation: {
    updateStudySessionTaskWithTranscription: async (parent, args) => {
      let userRecordingTranscription = '';
      let userRecordingTranscriptionJobId = '';
      if (args.data.userRecording) {
        const fullKey = args.data.userRecording.set;
        const bucket = process.env.NEXT_PUBLIC_MEDIA_BUCKET_NAME;
        const key = fullKey.replace(`https://${bucket}.s3.amazonaws.com/`, '');
        const outputKey = key.replace('session-task.wav', 'transcript.json');
        const id = nanoid();
        await transcribe
          .startTranscriptionJob({
            TranscriptionJobName: id,
            LanguageCode: 'en-US',
            Media: {
              MediaFileUri: `s3://${bucket}/${key}`,
            },
            OutputBucketName: bucket,
            OutputKey: outputKey,
          })
          .promise();
        userRecordingTranscription = `https://${bucket}.s3.amazonaws.com/${outputKey}`;
        userRecordingTranscriptionJobId = id;
      }
      return await prisma.studySessionTask.update({
        where: {
          id: args.where.id,
        },
        data: {
          ...args.data,
          userRecordingTranscription,
          userRecordingTranscriptionJobId,
        },
      });
    },
  },
};

export { StudySessionTaskResolvers };
