import {
  GET_PERSONS_SUCCESSFUL,
  CREATE_PERSON,
  CREATE_PERSON_SUCCESSFUL,
  CREATE_PERSON_FAILED,
  EDIT_PERSON,
  EDIT_PERSON_SUCCESSFUL,
  EDIT_PERSON_FAILED,
  UPLOAD_PHOTO_PERSON,
  UPLOAD_PHOTO_PERSON_SUCCESSFUL,
  UPLOAD_PHOTO_PERSON_FAILED,
  DELETE_PERSON,
  DELETE_PERSON_SUCCESSFUL,
  SYNC_PERSON_ERP,
  SYNC_PERSON_ERP_SUCCESSFUL,
} from "./actionTypes"

const initialState = {
  editPersonError: null,
  deletePersonError: null,
  createPersonError: null,
  uploadPhotoPersonError: null,
  persons: [],
  message: null,
  loading: true,
  loadingGrid: true,
  user: null,
}

const person = (state = initialState, action) => {
  switch (action.type) {
    case GET_PERSONS_SUCCESSFUL:
      state = {
        ...state,
        loadingGrid: false,
        createPersonError: null,
        persons: action.payload,
      }
      break
    case CREATE_PERSON:
      state = {
        ...state,
        loading: true,
        createPersonError: null,
      }
      break
    case CREATE_PERSON_SUCCESSFUL:
      state = {
        ...state,
        loading: false,
        createPersonError: null,
      }
      break
    case CREATE_PERSON_FAILED:
      state = {
        ...state,
        loading: false,
        createPersonError: action.payload,
      }
      break
      case UPLOAD_PHOTO_PERSON:
        state = {
          ...state,
          loading: true,
          uploadPhotoPersonError: null,
        }
        break
      case UPLOAD_PHOTO_PERSON_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          uploadPhotoPersonError: null,
        }
        break
      case UPLOAD_PHOTO_PERSON_FAILED:
        state = {
          ...state,
          loading: false,
          uploadPhotoPersonError: action.payload,
        }
        break
    case EDIT_PERSON:
        state = {
          ...state,
          loading: true,
          editPersonError: null,
        }
        break
    case EDIT_PERSON_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          editPersonError: null,
        }
        break
    case DELETE_PERSON:
        state = {
          ...state,
          loading: true,
          deletePersonError: null,
        }
        break
    case DELETE_PERSON_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          deletePersonError: null,
        }
        break
    case SYNC_PERSON_ERP:
        state = {
          ...state,
          loading: true,
          syncPersonError: null,
        }
        break
    case SYNC_PERSON_ERP_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          syncPersonError: null,
        }
        break
    default:
      state = { ...state }
      break
  }
  return state
}

export default person
