import { gql } from '@apollo/client';

const UPDATE_TASK = gql`
  mutation UpdateTask($where: TaskWhereUniqueInput!, $data: TaskUpdateInput) {
    updateTask(where: $where, data: $data) {
      id
    }
  }
`;

export { UPDATE_TASK };
