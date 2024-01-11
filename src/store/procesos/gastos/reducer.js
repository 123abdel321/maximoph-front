import {
  GET_SPENTS_SUCCESSFUL,
  CREATE_SPENT,
  CREATE_SPENT_SUCCESSFUL,
  CREATE_SPENT_FAILED,
  EDIT_SPENT,
  EDIT_SPENT_SUCCESSFUL,
  EDIT_SPENT_FAILED,
  DELETE_SPENT,
  DELETE_SPENT_SUCCESSFUL,
} from "./actionTypes"

const initialState = {
  editSpentError: null,
  deleteSpentError: null,
  createSpentError: null,
  spents: [],
  spentNextNumber: '',
  controlFechaDigitacion: '',
  message: null,
  loading: true,
  loadingGrid: true
}

const spent = (state = initialState, action) => {
  switch (action.type) {
    case GET_SPENTS_SUCCESSFUL:
      state = {
        ...state,
        loadingGrid: false,
        createSpentError: null,
        spents: action.payload.spents,
        spentNextNumber: action.payload.spentNextNumber,
        controlFechaDigitacion: action.payload.controlFechaDigitacion
      }
      break
    case CREATE_SPENT:
      state = {
        ...state,
        loading: true,
        createSpentError: null,
      }
      break
    case CREATE_SPENT_SUCCESSFUL:
      state = {
        ...state,
        loading: false,
        createSpentError: null,
      }
      break
    case CREATE_SPENT_FAILED:
      state = {
        ...state,
        loading: false,
        createSpentError: action.payload,
      }
      break
    case EDIT_SPENT:
        state = {
          ...state,
          loading: true,
          editSpentError: null,
        }
        break
    case EDIT_SPENT_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          editSpentError: null,
        }
        break
    case DELETE_SPENT:
        state = {
          ...state,
          loading: true,
          deleteSpentError: null,
        }
        break
    case DELETE_SPENT_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          deleteSpentError: null,
        }
        break
    default:
      state = { ...state }
      break
  }
  return state
}

export default spent
