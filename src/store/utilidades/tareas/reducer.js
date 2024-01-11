import {
  GET_OWN_HOMEWORKS_SUCCESSFUL,
  GET_HOMEWORKS_SUCCESSFUL,
  CREATE_HOMEWORK_MASSIVE,
  CREATE_HOMEWORK,
  CREATE_HOMEWORK_SUCCESSFUL,
  CREATE_HOMEWORK_FAILED,
  EDIT_HOMEWORK,
  EDIT_HOMEWORK_SUCCESSFUL,
  COMPLETE_HOMEWORK,
  COMPLETE_HOMEWORK_SUCCESSFUL,
  EDIT_HOMEWORK_FAILED,
  DELETE_HOMEWORK_MASSIVE,
  DELETE_HOMEWORK,
  DELETE_HOMEWORK_SUCCESSFUL,
} from "./actionTypes"

const initialState = {
  completeHomeworkError: null,
  editHomeworkError: null,
  deleteHomeworkError: null,
  createHomeworkError: null,
  homeworks: [],
  ownHomeworks: [],
  message: null,
  loading: true,
  loadingGrid: true
}

const homeworks = (state = initialState, action) => {
  switch (action.type) {
    case GET_OWN_HOMEWORKS_SUCCESSFUL:
      state = {
        ...state,
        loadingGrid: false,
        createHomeworkError: null,
        ownsHomeworks: action.payload,
      }
      break
    case GET_HOMEWORKS_SUCCESSFUL:
      state = {
        ...state,
        loadingGrid: false,
        createHomeworkError: null,
        homeworks: action.payload,
      }
      break
    case CREATE_HOMEWORK:
      state = {
        ...state,
        loading: true,
        createHomeworkError: null,
      }
      break
    case CREATE_HOMEWORK_MASSIVE:
      state = {
        ...state,
        loading: true,
        createHomeworkError: null,
      }
      break
    case CREATE_HOMEWORK_SUCCESSFUL:
      state = {
        ...state,
        loading: false,
        createHomeworkError: null,
      }
      break
    case CREATE_HOMEWORK_FAILED:
      state = {
        ...state,
        loading: false,
        createHomeworkError: action.payload,
      }
      break
    case EDIT_HOMEWORK:
        state = {
          ...state,
          loading: true,
          editHomeworkError: null,
        }
        break
    case EDIT_HOMEWORK_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          editHomeworkError: null,
        }
        break
    case COMPLETE_HOMEWORK:
        state = {
          ...state,
          loading: true,
          completeHomeworkError: null,
        }
        break
    case COMPLETE_HOMEWORK_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          completeHomeworkError: null,
        }
        break
    case DELETE_HOMEWORK:
        state = {
          ...state,
          loading: true,
          deleteHomeworkError: null,
        }
        break
    case DELETE_HOMEWORK_MASSIVE:
        state = {
          ...state,
          loading: true,
          deleteHomeworkError: null,
        }
        break
    case DELETE_HOMEWORK_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          deleteHomeworkError: null,
        }
        break
    default:
      state = { ...state }
      break
  }
  return state
}

export default homeworks
