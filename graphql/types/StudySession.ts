import { gql } from 'apollo-server-micro';

const StudySessionTypes = gql`
  type StudySession {
    taskList: [StudySessionTask]
  }

  input StudySessionNoUserInput {
    study: Connect
    participantEmail: String
  }

  type Query {
    getUserStudySessions: [StudySession]
  }

  type Mutation {
    createStudySessionNoUser(data: StudySessionNoUserInput): StudySession
  }
`;

export { StudySessionTypes };
