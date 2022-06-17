import { gql } from 'apollo-server-micro';

const ScriptTypes = gql`
  type Query {
    getScripts: [Script]
  }
`;

export { ScriptTypes };
