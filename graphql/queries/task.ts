import { gql } from '@apollo/client';

const GET_TASK = gql`
  query Task($taskId: String!) {
    task(id: $taskId) {
      recording
    }
  }
`;

export { GET_TASK };
