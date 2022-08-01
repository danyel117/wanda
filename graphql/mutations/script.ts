import { gql } from '@apollo/client';

const CREATE_SCRIPT = gql`
  mutation Mutation($data: ScriptCreateInput) {
    createScript(data: $data) {
      id
    }
  }
`;

const UPDATE_SCRIPT = gql`
  mutation UpdateScript(
    $where: ScriptWhereUniqueInput!
    $data: ScriptUpdateInput
  ) {
    updateScript(where: $where, data: $data) {
      id
    }
  }
`;

const DELETE_SCRIPT = gql`
  mutation DeleteScript($where: ScriptWhereUniqueInput!) {
    deleteScript(where: $where) {
      id
    }
  }
`;

export { CREATE_SCRIPT, UPDATE_SCRIPT, DELETE_SCRIPT };
