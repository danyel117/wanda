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

export { GET_SCRIPTS };
