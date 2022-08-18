import { gql } from 'apollo-server-micro';

const ParticipantQuestionTypes = gql`
  type Query {
    getParticipantSessionQuestions(sessionId: String): [ParticipantQuestion]
  }
`;

export { ParticipantQuestionTypes };
