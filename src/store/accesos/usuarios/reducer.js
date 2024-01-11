import {
  GET_CLIENT_USERS_SUCCESSFUL,
  CREATE_CLIENT_USER,
  CREATE_CLIENT_USER_SUCCESSFUL,
  CREATE_CLIENT_USER_FAILED,
  EDIT_CLIENT_USER,
  EDIT_CLIENT_USER_SUCCESSFUL,
  EDIT_CLIENT_USER_FAILED,
  DELETE_CLIENT_USER,
  DELETE_CLIENT_USER_SUCCESSFUL,
} from "./actionTypes"

const initialState = {
  editClientUserError: null,
  deleteClientUserError: null,
  createClientUserError: null,
  clientUsers: [],
  message: null,
  loading: true,
  loadingGrid: true
}

const clientUser = (state = initialState, action) => {
  switch (action.type) {
    case GET_CLIENT_USERS_SUCCESSFUL:
      state = {
        ...state,
        loadingGrid: false,
        createClientUserError: null,
        clientUsers: action.payload,
      }
      break
    case CREATE_CLIENT_USER:
      state = {
        ...state,
        loading: true,
        createClientUserError: null,
      }
      break
    case CREATE_CLIENT_USER_SUCCESSFUL:
      state = {
        ...state,
        loading: false,
        createClientUserError: null,
      }
      break
    case CREATE_CLIENT_USER_FAILED:
      state = {
        ...state,
        loading: false,
        createClientUserError: action.payload,
      }
      break
    case EDIT_CLIENT_USER:
        state = {
          ...state,
          loading: true,
          editClientUserError: null,
        }
        break
    case EDIT_CLIENT_USER_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          editClientUserError: null,
        }
        break
    case DELETE_CLIENT_USER:
        state = {
          ...state,
          loading: true,
          deleteClientUserError: null,
        }
        break
    case DELETE_CLIENT_USER_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          deleteClientUserError: null,
        }
        break
    default:
      state = { ...state }
      break
  }
  return state
}

export default clientUser
