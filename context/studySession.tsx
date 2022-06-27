import { useQuery } from '@apollo/client';
import { GET_STUDY_SESSION } from 'graphql/queries/studySession';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ExtendedStudySession, ExtendedStudySessionTask } from 'types';

interface StudySessionContextInterface {
  session: ExtendedStudySession;
  loading: boolean;
  currentTask: ExtendedStudySessionTask | undefined;
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
}

const StudySessionContextProvider = ({
  children,
  id,
}: StudySessionContextProviderProps) => {
  const [currentTask, setCurrentTask] = useState<ExtendedStudySessionTask>();
  const { data, loading, startPolling, stopPolling } = useQuery(
    GET_STUDY_SESSION,
    {
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'network-only',
      variables: {
        studySessionId: id,
      },
      pollInterval: 500,
    }
  );

  useEffect(() => {
    startPolling(500);

    return () => {
      stopPolling();
    };
  }, [startPolling, stopPolling]);

  useEffect(() => {
    if (data?.studySession) {
      setCurrentTask(
        data?.studySession.taskList[
          (data?.studySession.data.currentTask ?? 1) - 1
        ]
      );
    }
  }, [data]);

  const sessionContext = useMemo(
    () => ({
      session: data?.studySession,
      loading,
      currentTask,
    }),
    [data, loading, currentTask]
  );

  return (
    <StudySessionContext.Provider value={sessionContext}>
      {children}
    </StudySessionContext.Provider>
  );
};

export { StudySessionContextProvider };
