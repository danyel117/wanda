import { gql } from 'apollo-server-micro';

const StudySessionTypes = gql`
  type StudySession {
    taskList: [StudySessionTask]
    sus: Float
  }

  input StudySessionNoUserInput {
    evaluationStudy: Connect
    participantEmail: String
    sessionType: Enum_StudySessionType
    isStandAlone: Boolean
  }

  type Query {
    getUserStudySessions: [StudySession]
  }

  type Mutation {
    createStudySessionNoUser(data: StudySessionNoUserInput): StudySession
  }
`;

export { StudySessionTypes };
