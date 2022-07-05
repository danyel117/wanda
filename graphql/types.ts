import { gql } from 'apollo-server-micro';
import { DocumentNode } from 'graphql';
import { StudySessionTypes } from 'graphql/types/StudySession';
import { ScriptTypes } from 'graphql/types/Script';
import { StudyTypes } from 'graphql/types/EvaluationStudy';
import { QuestionnaireTypes } from 'graphql/types/Questionnaire';

const GlobalTypes = gql`
  scalar Date

  input IdString {
    id: String
  }

  input NameString {
    name: String
  }

  input Connect {
    connect: IdString
  }

  input ConnectName {
    connect: NameString
  }
`;

const customTypes: DocumentNode[] = [
  GlobalTypes,
  StudySessionTypes,
  ScriptTypes,
  StudyTypes,
  QuestionnaireTypes,
];

export { customTypes };
