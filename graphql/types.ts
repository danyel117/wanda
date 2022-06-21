import { gql } from 'apollo-server-micro';
import { DocumentNode } from 'graphql';
import { EvaluationSessionTypes } from 'graphql/types/EvaluationSession';
import { ScriptTypes } from 'graphql/types/Script';
import { StudyTypes } from 'graphql/types/Study';

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
  EvaluationSessionTypes,
  ScriptTypes,
  StudyTypes,
];

export { customTypes };
