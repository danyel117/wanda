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
  query StudySession($studySessionId: String!, $result: Boolean!) {
    studySession(id: $studySessionId) {
      id
      updatedAt
      sus
      sessionType
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
        task {
          id
          description
          url
          order
        }
      }
      taskList @include(if: $result) {
        expertComments
        userRecordingTranscription
        userRecording
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
