import {
  GET_PROVIDER_TYPES_SUCCESSFUL,
  CREATE_PROVIDER_TYPE,
  CREATE_PROVIDER_TYPE_SUCCESSFUL,
  CREATE_PROVIDER_TYPE_FAILED,
  EDIT_PROVIDER_TYPE,
  EDIT_PROVIDER_TYPE_SUCCESSFUL,
  EDIT_PROVIDER_TYPE_FAILED,
  DELETE_PROVIDER_TYPE,
  DELETE_PROVIDER_TYPE_SUCCESSFUL,
} from "./actionTypes"

const initialState = {
  editProviderTypeError: null,
  deleteProviderTypeError: null,
  createProviderTypeError: null,
  providerTypes: [],
  message: null,
  loading: true,
  loadingGrid: true
}

const providerTypes = (state = initialState, action) => {
  switch (action.type) {
    case GET_PROVIDER_TYPES_SUCCESSFUL:
      state = {
        ...state,
        loadingGrid: false,
        createProviderTypeError: null,
        providerTypes: action.payload,
      }
      break
    case CREATE_PROVIDER_TYPE:
      state = {
        ...state,
        loading: true,
        createProviderTypeError: null,
      }
      break
    case CREATE_PROVIDER_TYPE_SUCCESSFUL:
      state = {
        ...state,
        loading: false,
        createProviderTypeError: null,
      }
      break
    case CREATE_PROVIDER_TYPE_FAILED:
      state = {
        ...state,
        loading: false,
        createProviderTypeError: action.payload,
      }
      break
    case EDIT_PROVIDER_TYPE:
        state = {
          ...state,
          loading: true,
          editProviderTypeError: null,
        }
        break
    case EDIT_PROVIDER_TYPE_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          editProviderTypeError: null,
        }
        break
    case DELETE_PROVIDER_TYPE:
        state = {
          ...state,
          loading: true,
          deleteProviderTypeError: null,
        }
        break
    case DELETE_PROVIDER_TYPE_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          deleteProviderTypeError: null,
        }
        break
    default:
      state = { ...state }
      break
  }
  return state
}

export default providerTypes
