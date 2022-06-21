import { gql } from '@apollo/client';

const CREATE_STUDY = gql`
  mutation CreateStudyWithTasks($data: StudyCreateInputWithTasks) {
    createStudyWithTasks(data: $data) {
      id
    }
  }
`;

export { CREATE_STUDY };
