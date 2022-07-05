import { gql } from '@apollo/client';

const GET_STUDY_QUESTIONNAIRE = gql`
  query GetStudyQuestionnaire($studyId: String!) {
    getStudyQuestionnaire(studyId: $studyId) {
      id
      questions {
        id
        question
        position
        sus
      }
    }
  }
`;

export { GET_STUDY_QUESTIONNAIRE };
