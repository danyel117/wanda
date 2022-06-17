import { gql } from 'apollo-server-micro';

const EvaluationSessionTypes = gql`
  type EvaluationSession {
    latestState: EvaluationTaskStatus
  }
`;

export { EvaluationSessionTypes };
