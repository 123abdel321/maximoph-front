import {
  GET_PROVIDERS_SUCCESSFUL,
  CREATE_PROVIDER,
  CREATE_PROVIDER_SUCCESSFUL,
  CREATE_PROVIDER_FAILED,
  EDIT_PROVIDER,
  EDIT_PROVIDER_SUCCESSFUL,
  EDIT_PROVIDER_FAILED,
  DELETE_PROVIDER,
  DELETE_PROVIDER_SUCCESSFUL,
} from "./actionTypes"

const initialState = {
  editProviderError: null,
  deleteProviderError: null,
  createProviderError: null,
  providers: [],
  message: null,
  loading: true,
  loadingGrid: true
}

const providers = (state = initialState, action) => {
  switch (action.type) {
    case GET_PROVIDERS_SUCCESSFUL:
      state = {
        ...state,
        loadingGrid: false,
        createProviderError: null,
        providers: action.payload,
      }
      break
    case CREATE_PROVIDER:
      state = {
        ...state,
        loading: true,
        createProviderError: null,
      }
      break
    case CREATE_PROVIDER_SUCCESSFUL:
      state = {
        ...state,
        loading: false,
        createProviderError: null,
      }
      break
    case CREATE_PROVIDER_FAILED:
      state = {
        ...state,
        loading: false,
        createProviderError: action.payload,
      }
      break
    case EDIT_PROVIDER:
        state = {
          ...state,
          loading: true,
          editProviderError: null,
        }
        break
    case EDIT_PROVIDER_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          editProviderError: null,
        }
        break
    case DELETE_PROVIDER:
        state = {
          ...state,
          loading: true,
          deleteProviderError: null,
        }
        break
    case DELETE_PROVIDER_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          deleteProviderError: null,
        }
        break
    default:
      state = { ...state }
      break
  }
  return state
}

export default providers
