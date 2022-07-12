import { gql } from '@apollo/client';

const GET_EVALUATION_STUDY_RESULT = gql`
  query GetEvaluationResults($getEvaluationResultsId: String) {
    getEvaluationResults(id: $getEvaluationResultsId) {
      taskResults {
        order
        description
        duration
        successRate
      }
      participantStatus {
        completed
        missing
        notStarted
        participantTarget
        total
      }
    }
  }
`;

export { GET_EVALUATION_STUDY_RESULT };
