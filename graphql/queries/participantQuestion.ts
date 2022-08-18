import { gql } from '@apollo/client';

const GET_SESSION_QUESTIONS = gql`
  query GetParticipantSessionQuestions($sessionId: String) {
    getParticipantSessionQuestions(sessionId: $sessionId) {
      id
      question
      questionCategory
      questionType
    }
  }
`;

export { GET_SESSION_QUESTIONS };
