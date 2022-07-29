import { gql } from '@apollo/client';

const GET_STUDIES = gql`
  query GetUserStudies {
    getUserStudies {
      id
      name
      status
      researchQuestion
      site
      taskCount
      participantTarget
      evaluationSummary {
        pending
        completed
        total
      }
    }
  }
`;

export { GET_STUDIES };
