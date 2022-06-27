import { gql } from '@apollo/client';

const GET_USER_STUDY_SESSIONS = gql`
  query GetUserEvaluations {
    getUserEvaluations {
      id
      evaluationStudy {
        name
      }
      participant {
        email
      }
      status
    }
  }
`;

const GET_STUDY_SESSION = gql`
  query StudySession($studySessionId: String!) {
    studySession(id: $studySessionId) {
      id
      evaluationStudy {
        id
        name
        site
        script {
          script
          recording
        }
      }
      expert {
        email
      }
      participant {
        email
      }
      status
      data {
        id
        currentTask
        expertConsentBegin
        participantConsentBegin
      }
      taskList {
        id
        status
        expertComments
        task {
          description
          url
          recording
        }
      }
    }
  }
`;

export { GET_USER_STUDY_SESSIONS, GET_STUDY_SESSION };