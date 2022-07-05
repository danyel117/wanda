import { gql } from '@apollo/client';

const CREATE_QUESTION_RESPONSE = gql`
  mutation CreateQuestionResponse($data: QuestionResponseCreateInput) {
    createQuestionResponse(data: $data) {
      id
    }
  }
`;
export { CREATE_QUESTION_RESPONSE };
