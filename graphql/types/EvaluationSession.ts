import { gql } from 'apollo-server-micro';

const EvaluationSessionTypes = gql`
  type EvaluationSession {
    taskList: [EvaluationTask]
  }

  input EvaluationSessionNoUserInput {
    study: Connect
    participantEmail: String
  }

  type Query {
    getUserEvaluations: [EvaluationSession]
  }

  type Mutation {
    createEvaluationSessionNoUser(
      data: EvaluationSessionNoUserInput
    ): EvaluationSession
  }
`;

export { EvaluationSessionTypes };
