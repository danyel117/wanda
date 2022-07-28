import { useQuery } from '@apollo/client';
import { Script } from '@prisma/client';
import { GET_SCRIPT } from 'graphql/queries/script';
import { GET_STUDY_SESSION } from 'graphql/queries/studySession';
import { GET_TASK } from 'graphql/queries/task';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ExtendedStudySession, ExtendedStudySessionTask } from 'types';

interface StudySessionContextInterface {
  session: ExtendedStudySession;
  loading: boolean;
  currentTask: ExtendedStudySessionTask | undefined;
  taskAudio: string;
  script: Script | undefined;
  stopPoll: () => void;
  resumePoll: () => void;
  result: boolean;
  setResult: Dispatch<SetStateAction<boolean>>;
}

export const StudySessionContext = createContext<StudySessionContextInterface>(
  {} as StudySessionContextInterface
);

export function useStudySession() {
  return useContext<StudySessionContextInterface>(StudySessionContext);
}

interface StudySessionContextProviderProps {
  children: JSX.Element | JSX.Element[];
  id: string;
  pollRate?: number;
}

const StudySessionContextProvider = ({
  children,
  id,
  pollRate = 750,
}: StudySessionContextProviderProps) => {
  const [result, setResult] = useState<boolean>(false);
  const [currentTask, setCurrentTask] = useState<ExtendedStudySessionTask>();
  const { data, loading, startPolling, stopPolling } = useQuery(
    GET_STUDY_SESSION,
    {
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'network-only',
      variables: {
        studySessionId: id,
        result,
      },
      pollInterval: pollRate,
    }
  );

  const { data: task } = useQuery(GET_TASK, {
    variables: {
      taskId: currentTask?.task.id ?? '',
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'network-only',
  });

  const { data: script } = useQuery(GET_SCRIPT, {
    variables: {
      scriptId: data?.studySession.study.script.id ?? '',
    },
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (pollRate) {
      startPolling(pollRate);
    }

    return () => {
      stopPolling();
    };
  }, [pollRate, startPolling, stopPolling]);

  useEffect(() => {
    if (data?.studySession) {
      setCurrentTask(
        data?.studySession.taskList[
          (data?.studySession.data.currentTask ?? 1) - 1
        ]
      );

      if (data.studySession.status === 'COMPLETED') {
        stopPolling();
      }
    }
  }, [data, stopPolling]);

  const sessionContext = useMemo(() => {
    const resumePoll = () => {
      startPolling(pollRate);
    };

    return {
      session: data?.studySession,
      loading,
      currentTask,
      taskAudio: task?.task?.recording ?? '',
      script: script?.script,
      stopPoll: stopPolling,
      resumePoll,
      result,
      setResult,
    };
  }, [
    data,
    loading,
    currentTask,
    task,
    script,
    stopPolling,
    startPolling,
    pollRate,
    result,
    setResult,
  ]);

  return (
    <StudySessionContext.Provider value={sessionContext}>
      {children}
    </StudySessionContext.Provider>
  );
};

export { StudySessionContextProvider };
