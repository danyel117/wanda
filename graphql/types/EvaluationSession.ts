import { gql } from 'apollo-server-micro';

const EvaluationSessionTypes = gql`
  type EvaluationSession {
    latestState: EvaluationTaskStatus
  }

  input EvaluationSessionNoUserInput {
    study: Connect
    participantEmail: String
  }

  type Mutation{
    createEvaluationSessionNoUser():EvaluationSession
  }
`;

export { EvaluationSessionTypes };
