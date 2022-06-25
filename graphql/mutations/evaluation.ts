import { gql } from '@apollo/client';

const CREATE_EVALUATION = gql`
  mutation CreateEvaluationSessionNoUser($data: EvaluationSessionNoUserInput) {
    createEvaluationSessionNoUser(data: $data) {
      id
    }
  }
`;

export { CREATE_EVALUATION };
