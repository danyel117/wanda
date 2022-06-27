import { gql } from '@apollo/client';

const CREATE_EVALUATION_STUDY = gql`
  mutation CreateStudyWithTasks($data: EvaluationStudyCreateInputWithTasks) {
    createEvaluationStudyWithTasks(data: $data) {
      id
    }
  }
`;

export { CREATE_EVALUATION_STUDY };
