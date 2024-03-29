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
      sus
    }
  }
`;

const GET_EXPORT_DATA = gql`
  query EvaluationStudy($evaluationStudyId: String!) {
    evaluationStudy(id: $evaluationStudyId) {
      id
      sessions {
        createdAt
        participant {
          id
          email
        }
        taskList {
          startTime
          endTime
          task {
            description
          }
          userRecordingTranscription
          status
        }
        questionResponses {
          question {
            question
            sus
          }
          responseText
          responseNumber
        }
      }
    }
  }
`;

export { GET_EVALUATION_STUDY_RESULT, GET_EXPORT_DATA };
