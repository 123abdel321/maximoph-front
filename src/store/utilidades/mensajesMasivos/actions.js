import {
  GET_RECEIVE_MESSAGES,
  GET_RECEIVE_MESSAGES_SUCCESSFUL,
  GET_MASSIVE_MESSAGES,
  GET_MASSIVE_MESSAGES_SUCCESSFUL,
  CREATE_MASSIVE_MESSAGE,
  UPDATE_MASSIVE_MESSAGE,
  CREATE_MASSIVE_MESSAGE_SUCCESSFUL,
  CREATE_MASSIVE_MESSAGE_FAILED
} from "./actionTypes"

export const getReceiveMessages = (withButtons, cb) => ({
  type: GET_RECEIVE_MESSAGES,
  payload: {withButtons, cb}
})

export const getReceiveMessagesSuccessful = (receiveMessages) => ({
  type: GET_RECEIVE_MESSAGES_SUCCESSFUL,
  payload: { receiveMessages },
})

export const getMassiveMessages = (withButtons, cb) => ({
  type: GET_MASSIVE_MESSAGES,
  payload: {withButtons, cb}
})

export const getMassiveMessagesSuccessful = (massiveMessages) => ({
  type: GET_MASSIVE_MESSAGES_SUCCESSFUL,
  payload: { massiveMessages },
})

export const createMassiveMessage = (massiveMessage, cb) => {
  return {
    type: CREATE_MASSIVE_MESSAGE,
    payload: { massiveMessage, cb }
  }
}

export const createMassiveMessageSuccessful = massiveMessage => {
  return {
    type: CREATE_MASSIVE_MESSAGE_SUCCESSFUL,
    payload: massiveMessage,
  }
}

export const createMassiveMessageFailed = massiveMessage => {
  return {
    type: CREATE_MASSIVE_MESSAGE_FAILED,
    payload: massiveMessage,
  }
}

export const putMassiveMessage = (massiveMessage, cb) => {
  return {
    type: UPDATE_MASSIVE_MESSAGE,
    payload: { massiveMessage, cb }
  }
}
