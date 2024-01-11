import {
  GET_PROPERTIES_SUCCESSFUL,
  CREATE_PROPERTY,
  CREATE_PROPERTY_SUCCESSFUL,
  CREATE_PROPERTY_FAILED,
  EDIT_PROPERTY,
  EDIT_PROPERTY_SUCCESSFUL,
  EDIT_PROPERTY_FAILED,
  DELETE_PROPERTY,
  DELETE_PROPERTY_SUCCESSFUL,
} from "./actionTypes"

const initialState = {
  editPropertyError: null,
  deletePropertyError: null,
  createPropertyError: null,
  properties: [],
  message: null,
  loading: true,
  loadingGrid: true
}

const property = (state = initialState, action) => {
  switch (action.type) {
    case GET_PROPERTIES_SUCCESSFUL:
      state = {
        ...state,
        loadingGrid: false,
        createPropertyError: null,
        properties: action.payload,
      }
      break
    case CREATE_PROPERTY:
      state = {
        ...state,
        loading: true,
        createPropertyError: null,
      }
      break
    case CREATE_PROPERTY_SUCCESSFUL:
      state = {
        ...state,
        loading: false,
        createPropertyError: null,
      }
      break
    case CREATE_PROPERTY_FAILED:
      state = {
        ...state,
        loading: false,
        createPropertyError: action.payload,
      }
      break
    case EDIT_PROPERTY:
        state = {
          ...state,
          loading: true,
          editPropertyError: null,
        }
        break
    case EDIT_PROPERTY_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          editPropertyError: null,
        }
        break
    case DELETE_PROPERTY:
        state = {
          ...state,
          loading: true,
          deletePropertyError: null,
        }
        break
    case DELETE_PROPERTY_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          deletePropertyError: null,
        }
        break
    default:
      state = { ...state }
      break
  }
  return state
}

export default property
