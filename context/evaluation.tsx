import { useQuery } from '@apollo/client';
import { GET_EVALUATION } from 'graphql/queries/evaluation';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ExtendedEvaluationSession, ExtendedEvaluationTask } from 'types';

interface EvaluationContextInterface {
  evaluation: ExtendedEvaluationSession;
  loading: boolean;
  currentTask: ExtendedEvaluationTask | undefined;
}

export const EvaluationContext = createContext<EvaluationContextInterface>(
  {} as EvaluationContextInterface
);

export function useEvaluation() {
  return useContext<EvaluationContextInterface>(EvaluationContext);
}

interface EvaluationContextProviderProps {
  children: JSX.Element | JSX.Element[];
  id: string;
}

const EvaluationContextProvider = ({
  children,
  id,
}: EvaluationContextProviderProps) => {
  const [currentTask, setCurrentTask] = useState<ExtendedEvaluationTask>();
  const { data, loading, startPolling, stopPolling } = useQuery(
    GET_EVALUATION,
    {
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'network-only',
      variables: {
        evaluationSessionId: id,
      },
      pollInterval: 500,
    }
  );

  // useEffect(() => {
  //   startPolling(500);

  //   return () => {
  //     stopPolling();
  //   };
  // }, [startPolling, stopPolling]);

  useEffect(() => {
    if (data?.evaluationSession) {
      setCurrentTask(
        data?.evaluationSession.taskList[
          (data?.evaluationSession.data.currentTask ?? 1) - 1
        ]
      );
    }
  }, [data]);

  const evaluationContext = useMemo(
    () => ({
      evaluation: data?.evaluationSession,
      loading,
      currentTask,
    }),
    [data, loading, currentTask]
  );

  useEffect(() => {
    if (data) {
      console.log(data.evaluationSession);
    }
  }, [data]);

  return (
    <EvaluationContext.Provider value={evaluationContext}>
      {children}
    </EvaluationContext.Provider>
  );
};

export { EvaluationContextProvider };
