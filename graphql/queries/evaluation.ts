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
      study {
        name
      }
      expert {
        email
      }
      participant {
        email
      }
      status
      study {
        site
        script {
          script
          recording
        }
        tasks {
          description
        }
      }
    }
  }
`;

export { GET_USER_EVALUATIONS, GET_EVALUATION };
