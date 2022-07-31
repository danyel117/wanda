import { gql } from '@apollo/client';

const CREATE_EVALUATION_STUDY = gql`
  mutation CreateStudyWithTasks($data: EvaluationStudyCreateInputWithTasks) {
    createEvaluationStudyWithTasks(data: $data) {
      id
    }
  }
`;

const UPDATE_EVALUATION_STUDY = gql`
  mutation UpdateEvaluationStudy(
    $where: EvaluationStudyWhereUniqueInput!
    $data: EvaluationStudyUpdateInput
  ) {
    updateEvaluationStudy(where: $where, data: $data) {
      id
    }
  }
`;

const DELETE_EVALUATION_STUDY = gql`
  mutation FullDeleteEvaluationStudy($id: String) {
    fullDeleteEvaluationStudy(id: $id) {
      result
    }
  }
`;

export {
  CREATE_EVALUATION_STUDY,
  UPDATE_EVALUATION_STUDY,
  DELETE_EVALUATION_STUDY,
};
