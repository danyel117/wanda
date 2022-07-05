import { gql } from 'apollo-server-micro';

const QuestionnaireTypes = gql`
  type Query {
    getStudyQuestionnaire(studyId: String!): Questionnaire
  }
`;

export { QuestionnaireTypes };
