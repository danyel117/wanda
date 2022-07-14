import { gql } from 'apollo-server-micro';

const EvaluationStudyResultTypes = gql`
  type TaskResult {
    order: Int
    description: String
    duration: Float
    successRate: Float
  }

  type ParticipantStatus {
    completed: Int
    notStarted: Int
    total: Int
    participantTarget: Int
    missing: Int
  }

  type EvaluationStudyResult {
    id: String
    taskResults: [TaskResult]
    participantStatus: ParticipantStatus
    sus: Float
  }

  type Query {
    getEvaluationResults(id: String): EvaluationStudyResult
  }
`;

export { EvaluationStudyResultTypes };
