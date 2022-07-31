import { gql } from '@apollo/client';

const UPDATE_QUESTION = gql`
  mutation UpdateQuestion(
    $where: QuestionWhereUniqueInput!
    $data: QuestionUpdateInput
  ) {
    updateQuestion(where: $where, data: $data) {
      id
    }
  }
`;

export { UPDATE_QUESTION };
