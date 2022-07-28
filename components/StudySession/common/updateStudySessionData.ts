import { useMutation } from '@apollo/client';
import {
  Enum_StudySessionStatus,
  Enum_StudySessionTaskStatus,
} from '@prisma/client';
import {
  UPDATE_STUDY_SESSION,
  UPDATE_STUDY_SESSION_DATA,
  UPDATE_STUDY_SESSION_TASK,
} from 'graphql/mutations/studySession';

interface StudySessionUpdateFunctionProps {
  id: string;
  data: {
    status?: {
      set: Enum_StudySessionStatus;
    };
  };
}
interface TaskUpdateFunctionProps {
  id: string;
  data: {
    status?: {
      set: Enum_StudySessionTaskStatus;
    };
    userRecording?: {
      set: string;
    };
    expertRecording?: {
      set: string;
    };
    expertComments?: {
      set: string;
    };
    startTime?: {
      set: Date;
    };
    endTime?: {
      set: Date;
    };
  };
}

interface DataUpdateFunctionProps {
  id: string;
  data: {
    expertConsentBegin?: {
      set: boolean;
    };
    participantConsentBegin?: {
      set: boolean;
    };
    currentTask?: {
      set: number;
    };
  };
}

const useUpdateStudySessionData = () => {
  const [updateStudySessionSession] = useMutation(UPDATE_STUDY_SESSION);
  const [updateStudySessionSessionData] = useMutation(
    UPDATE_STUDY_SESSION_DATA
  );
  const [updateStudySessionSessionTask] = useMutation(
    UPDATE_STUDY_SESSION_TASK
  );

  const updateStudySessionData = async ({
    id,
    data,
  }: DataUpdateFunctionProps) => {
    await updateStudySessionSessionData({
      variables: {
        where: {
          id,
        },
        data,
      },
    });
  };

  const updateStudySession = async ({
    id,
    data,
  }: StudySessionUpdateFunctionProps) => {
    await updateStudySessionSession({
      variables: {
        where: {
          id,
        },
        data,
      },
    });
  };

  const updateStudySessionTask = async ({
    id,
    data,
  }: TaskUpdateFunctionProps) => {
    await updateStudySessionSessionTask({
      variables: {
        where: {
          id,
        },
        data,
      },
    });
  };

  return {
    updateStudySession,
    updateStudySessionData,
    updateStudySessionTask,
  };
};

export { useUpdateStudySessionData };
