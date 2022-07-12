import { gql } from 'apollo-server-micro';
import { DocumentNode } from 'graphql';
import { StudySessionTypes } from 'graphql/types/StudySession';
import { ScriptTypes } from 'graphql/types/Script';
import { StudyTypes } from 'graphql/types/EvaluationStudy';
import { QuestionnaireTypes } from 'graphql/types/Questionnaire';
import { StudySessionTaskTypes } from 'graphql/types/StudySessionTask';
import { EvaluationStudyResultTypes } from 'graphql/types/EvaluationStudyResult';

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
  StudySessionTaskTypes,
  EvaluationStudyResultTypes,
];

export { customTypes };
