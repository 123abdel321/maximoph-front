import {
  GET_RECEIVE_MESSAGES_SUCCESSFUL,
  GET_MASSIVE_MESSAGES_SUCCESSFUL,
  UPDATE_MASSIVE_MESSAGE,
  CREATE_MASSIVE_MESSAGE,
  CREATE_MASSIVE_MESSAGE_SUCCESSFUL,
  CREATE_MASSIVE_MESSAGE_FAILED
} from "./actionTypes"

const initialState = {
  createMassiveMessageError: null,
  massiveMessages: [],
  loading: true,
  loadingGrid: true
}

const massiveMessage = (state = initialState, action) => {
  switch (action.type) {
    case GET_RECEIVE_MESSAGES_SUCCESSFUL:
      state = {
        ...state,
        loadingGrid: false,
        createMassiveMessageError: null,
        massiveMessages: action.payload.receiveMessages
      }
      break
    case GET_MASSIVE_MESSAGES_SUCCESSFUL:
      state = {
        ...state,
        loadingGrid: false,
        createMassiveMessageError: null,
        massiveMessages: action.payload.massiveMessages
      }
      break
    case CREATE_MASSIVE_MESSAGE:
      state = {
        ...state,
        loading: true,
        createMassiveMessageError: null,
      }
      break
    case CREATE_MASSIVE_MESSAGE_SUCCESSFUL:
      state = {
        ...state,
        loading: false,
        createMassiveMessageError: null,
      }
      break
    case CREATE_MASSIVE_MESSAGE_FAILED:
      state = {
        ...state,
        loading: false,
        createMassiveMessageError: action.payload,
      }
      break
    case UPDATE_MASSIVE_MESSAGE:
        state = {
          ...state,
          loading: true,
          updateMassiveMessageError: null,
        }
        break
    default:
      state = { ...state }
      break
  }
  return state
}

export default massiveMessage
