import {
  GET_TYPES_HOMEWORK_SUCCESSFUL,
  CREATE_TYPE_HOMEWORK,
  CREATE_TYPE_HOMEWORK_SUCCESSFUL,
  CREATE_TYPE_HOMEWORK_FAILED,
  EDIT_TYPE_HOMEWORK,
  EDIT_TYPE_HOMEWORK_SUCCESSFUL,
  EDIT_TYPE_HOMEWORK_FAILED,
  DELETE_TYPE_HOMEWORK,
  DELETE_TYPE_HOMEWORK_SUCCESSFUL,
} from "./actionTypes"

const initialState = {
  editTypeHomeworkError: null,
  deleteTypeHomeworkError: null,
  createTypeHomeworkError: null,
  typesHomework: [],
  message: null,
  loading: true,
  loadingGrid: true
}

const typeHomework = (state = initialState, action) => {
  switch (action.type) {
    case GET_TYPES_HOMEWORK_SUCCESSFUL:
      state = {
        ...state,
        loadingGrid: false,
        createTypeHomeworkError: null,
        typesHomework: action.payload,
      }
      break
    case CREATE_TYPE_HOMEWORK:
      state = {
        ...state,
        loading: true,
        createTypeHomeworkError: null,
      }
      break
    case CREATE_TYPE_HOMEWORK_SUCCESSFUL:
      state = {
        ...state,
        loading: false,
        createTypeHomeworkError: null,
      }
      break
    case CREATE_TYPE_HOMEWORK_FAILED:
      state = {
        ...state,
        loading: false,
        createTypeHomeworkError: action.payload,
      }
      break
    case EDIT_TYPE_HOMEWORK:
        state = {
          ...state,
          loading: true,
          editTypeHomeworkError: null,
        }
        break
    case EDIT_TYPE_HOMEWORK_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          editTypeHomeworkError: null,
        }
        break
    case DELETE_TYPE_HOMEWORK:
        state = {
          ...state,
          loading: true,
          deleteTypeHomeworkError: null,
        }
        break
    case DELETE_TYPE_HOMEWORK_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          deleteTypeHomeworkError: null,
        }
        break
    default:
      state = { ...state }
      break
  }
  return state
}

export default typeHomework
