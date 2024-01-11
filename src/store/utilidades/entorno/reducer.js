import {
  GET_DATA_SUMMARY_ERP_SUCCESSFUL,
  EDIT_API_KEY_ERP,
  EDIT_API_KEY_ERP_SUCCESSFUL,
  EDIT_ENVIROMENT_MAXIMO,
  EDIT_ENVIROMENT_MAXIMO_SUCCESSFUL,
  REMOVE_NOTIFICATION
} from "./actionTypes"

const initialState = {
  editApiKeyError: null,
  summaryErp: [],
  message: null,
  loading: true,
  loadingGrid: true
}

const summaryErp = (state = initialState, action) => {
  switch (action.type) {
    case GET_DATA_SUMMARY_ERP_SUCCESSFUL:
      state = {
        ...state,
        loadingGrid: false,
        summaryErp: action.payload,
      }
    break
    case REMOVE_NOTIFICATION:
        state = {
          ...state,
          loading: true
        }
    break
    case EDIT_API_KEY_ERP:
        state = {
          ...state,
          loading: true,
          editApiKeyError: null,
        }
    break
    case EDIT_API_KEY_ERP_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          editApiKeyError: null,
        }
    break
    case EDIT_ENVIROMENT_MAXIMO:
        state = {
          ...state,
          loading: true,
          editEnviromentMaximoError: null,
        }
    break
    case EDIT_ENVIROMENT_MAXIMO_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          editEnviromentMaximoError: null,
        }
    break
    default:
      state = { ...state }
    break
  }
  return state
}

export default summaryErp;
