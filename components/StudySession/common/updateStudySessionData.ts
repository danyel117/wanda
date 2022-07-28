import { useMutation } from '@apollo/client';
import {
  Enum_StudySessionStatus,
  Enum_StudySessionTaskStatus,
} from '@prisma/client';
import { useStudySession } from 'context/studySession';
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
  const { stopPoll, resumePoll } = useStudySession();
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
    stopPoll();
    await updateStudySessionSessionData({
      variables: {
        where: {
          id,
        },
        data,
      },
    });
    resumePoll();
  };

  const updateStudySession = async ({
    id,
    data,
  }: StudySessionUpdateFunctionProps) => {
    stopPoll();
    await updateStudySessionSession({
      variables: {
        where: {
          id,
        },
        data,
      },
    });
    resumePoll();
  };

  const updateStudySessionTask = async ({
    id,
    data,
  }: TaskUpdateFunctionProps) => {
    stopPoll();
    await updateStudySessionSessionTask({
      variables: {
        where: {
          id,
        },
        data,
      },
    });
    resumePoll();
  };

  return {
    updateStudySession,
    updateStudySessionData,
    updateStudySessionTask,
  };
};

export { useUpdateStudySessionData };
