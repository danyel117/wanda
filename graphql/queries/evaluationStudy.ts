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

const GET_STUDY = gql`
  query EvaluationStudy($evaluationStudyId: String!) {
    evaluationStudy(id: $evaluationStudyId) {
      id
      name
      researchQuestion
      participantTarget
      site
      script {
        id
      }
      tasks {
        id
        description
        url
        recording
        order
      }
      questionnaire {
        questions {
          id
          sus
          position
          question
        }
      }
    }
  }
`;

export { GET_STUDIES, GET_STUDY };
