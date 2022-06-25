import { useMutation } from '@apollo/client';
import {
  Enum_EvaluationSessionStatus,
  Enum_TaskEvaluationStatus,
} from '@prisma/client';
import {
  UPDATE_EVALUATION_SESSION,
  UPDATE_EVALUATION_SESSION_DATA,
  UPDATE_EVALUATION_SESSION_TASK,
} from 'graphql/mutations/evaluation';

interface EvaluationUpdateFunctionProps {
  id: string;
  data: {
    status?: {
      set: Enum_EvaluationSessionStatus;
    };
  };
}
interface TaskUpdateFunctionProps {
  id: string;
  data: {
    status?: {
      set: Enum_TaskEvaluationStatus;
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

const useUpdateEvaluationData = () => {
  const [updateEvaluationSession] = useMutation(UPDATE_EVALUATION_SESSION);
  const [updateEvaluationSessionData] = useMutation(
    UPDATE_EVALUATION_SESSION_DATA
  );
  const [updateEvaluationSessionTask] = useMutation(
    UPDATE_EVALUATION_SESSION_TASK
  );

  const updateEvaluationData = async ({
    id,
    data,
  }: DataUpdateFunctionProps) => {
    await updateEvaluationSessionData({
      variables: {
        where: {
          id,
        },
        data,
      },
    });
  };

  const updateEvaluation = async ({
    id,
    data,
  }: EvaluationUpdateFunctionProps) => {
    await updateEvaluationSession({
      variables: {
        where: {
          id,
        },
        data,
      },
    });
  };

  const updateEvaluationTask = async ({
    id,
    data,
  }: TaskUpdateFunctionProps) => {
    await updateEvaluationSessionTask({
      variables: {
        where: {
          id,
        },
        data,
      },
    });
  };

  return {
    updateEvaluation,
    updateEvaluationData,
    updateEvaluationTask,
  };
};

export { useUpdateEvaluationData };
