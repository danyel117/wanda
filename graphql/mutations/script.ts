import { gql } from '@apollo/client';

const CREATE_SCRIPT = gql`
  mutation Mutation($data: ScriptCreateInput) {
    createScript(data: $data) {
      id
    }
  }
`;

export { CREATE_SCRIPT };
