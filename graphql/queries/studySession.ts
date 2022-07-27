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
      createdAt
    }
  }
`;

const GET_STUDY_SESSION = gql`
  query StudySession($studySessionId: String!) {
    studySession(id: $studySessionId) {
      id
      updatedAt
      sus
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
        userRecording
        task {
          id
          description
          url
          order
        }
      }
      questionResponses {
        question {
          position
          question
          sus
        }
        responseNumber
        responseText
      }
    }
  }
`;

export { GET_USER_STUDY_SESSIONS, GET_STUDY_SESSION };
