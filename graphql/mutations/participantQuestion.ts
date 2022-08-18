import { gql } from '@apollo/client';

const CREATE_PARTICIPANT_QUESTION = gql`
  mutation CreateParticipantQuestion($data: ParticipantQuestionCreateInput) {
    createParticipantQuestion(data: $data) {
      id
    }
  }
`;

export { CREATE_PARTICIPANT_QUESTION };
