import { gql } from '@apollo/client';

const GET_USER_STUDY_SESSIONS = gql`
  query GetUserStudySessions {
    getUserStudySessions {
      id
      study {
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
      study {
        id
        name
        site
        script {
          id
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
        userRecordingTranscription
        task {
          id
          description
          url
          order
        }
      }
    }
  }
`;

export { GET_USER_STUDY_SESSIONS, GET_STUDY_SESSION };
