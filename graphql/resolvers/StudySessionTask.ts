import { s3, transcribe } from '@config/aws';
import { getObjectInBucket } from '@pages/api/get-presigned-url';
import { StudySessionTask } from '@prisma/client';
import prisma from 'config/prisma';
import { nanoid } from 'nanoid';
import { Resolver } from 'types';

const StudySessionTaskResolvers: Resolver = {
  StudySessionTask: {
    userRecordingTranscription: async (parent: StudySessionTask, args) => {
      if (parent.status === 'COMPLETED' && parent.userRecordingTranscription) {
        const sessionStatus = await prisma.studySession.findFirst({
          where: {
            id: parent.studySessionId,
          },
        });
        if (sessionStatus?.status === 'COMPLETED') {
          const key = parent.userRecordingTranscription?.replace(
            'https://wanda-media.s3.amazonaws.com/',
            ''
          );
          const data = await s3
            .getObject({
              Bucket: process.env.NEXT_PUBLIC_MEDIA_BUCKET_NAME ?? '',
              Key: key ?? '',
            })
            .promise();

          const transcription = JSON.parse(data?.Body?.toString('utf-8') ?? '');
          return transcription.results.transcripts[0].transcript;
        }

        return null;
      }

      return null;
    },
    userRecording: async (parent: StudySessionTask, args) => {
      if (parent.status === 'COMPLETED') {
        const bucket = process.env.NEXT_PUBLIC_MEDIA_BUCKET_NAME ?? '';
        const path = parent?.userRecording?.replace(
          `https://${bucket}.s3.amazonaws.com/`,
          ''
        );
        if (path) {
          const audio = await getObjectInBucket(bucket, path, 'audio/mpeg');
          return audio;
        }
      }

      return null;
    },
  },
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
