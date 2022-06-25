import { gql } from '@apollo/client';

const GET_USER_EVALUATIONS = gql`
  query GetUserEvaluations {
    getUserEvaluations {
      id
      study {
        name
      }
      participant {
        email
      }
      status
    }
  }
`;

const GET_EVALUATION = gql`
  query EvaluationSession($evaluationSessionId: String!) {
    evaluationSession(id: $evaluationSessionId) {
      id
      study {
        id
        name
      }
      expert {
        email
      }
      participant {
        email
      }
      status
      data {
        id
        currentTask
        expertConsentBegin
        participantConsentBegin
      }
      taskList {
        id
        status
        task {
          description
          url
          recording
        }
      }
      study {
        site
        script {
          script
          recording
        }
      }
    }
  }
`;

export { GET_USER_EVALUATIONS, GET_EVALUATION };
