import { gql } from '@apollo/client';

const GET_SESSION = gql`
  query EvaluationSession($evaluationSessionId: String!) {
    evaluationSession(id: $evaluationSessionId) {
      script {
        script
        recording
      }
      tasks {
        description
      }
      study {
        site
      }
    }
  }
`;

export { GET_SESSION };
