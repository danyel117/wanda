import { gql } from '@apollo/client';

const GET_STUDIES = gql`
  query GetUserStudies {
    getUserStudies {
      id
      name
      researchQuestion
      site
      taskCount
      evaluationSummary {
        pending
        completed
        total
      }
    }
  }
`;

export { GET_STUDIES };
