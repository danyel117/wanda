import { gql } from '@apollo/client';

const CREATE_EVALUATION = gql`
  mutation CreateEvaluationSessionNoUser($data: EvaluationSessionNoUserInput) {
    createEvaluationSessionNoUser(data: $data) {
      id
    }
  }
`;

const UPDATE_EVALUATION_SESSION = gql`
  mutation UpdateEvaluationSession(
    $where: EvaluationSessionWhereUniqueInput!
    $data: EvaluationSessionUpdateInput
  ) {
    updateEvaluationSession(where: $where, data: $data) {
      id
    }
  }
`;

const UPDATE_EVALUATION_SESSION_TASK = gql`
  mutation UpdateEvaluationTask(
    $where: EvaluationTaskWhereUniqueInput!
    $data: EvaluationTaskUpdateInput
  ) {
    updateEvaluationTask(where: $where, data: $data) {
      id
    }
  }
`;

const UPDATE_EVALUATION_SESSION_DATA = gql`
  mutation UpdateEvaluationSessionData(
    $where: EvaluationSessionDataWhereUniqueInput!
    $data: EvaluationSessionDataUpdateInput
  ) {
    updateEvaluationSessionData(where: $where, data: $data) {
      id
    }
  }
`;

export {
  CREATE_EVALUATION,
  UPDATE_EVALUATION_SESSION,
  UPDATE_EVALUATION_SESSION_TASK,
  UPDATE_EVALUATION_SESSION_DATA,
};
