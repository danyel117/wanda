import { gql } from '@apollo/client';

const GET_SCRIPTS = gql`
  query GetScripts {
    getScripts {
      id
      name
      script
      recording
      userId
      createdAt
      updatedAt
    }
  }
`;

const GET_SCRIPT = gql`
  query Script($scriptId: String!) {
    script(id: $scriptId) {
      id
      script
      recording
    }
  }
`;

export { GET_SCRIPTS, GET_SCRIPT };
