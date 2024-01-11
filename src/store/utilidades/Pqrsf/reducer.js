import {
  GET_SENT_PQRSF_SUCCESSFUL,
  GET_PQRSF_SUCCESSFUL,
  CREATE_PQRSF,
  CREATE_PQRSF_SUCCESSFUL,
  CREATE_PQRSF_FAILED
} from "./actionTypes"

const initialState = {
  createPqrsfError: null,
  pqrsf: [],
  loading: true,
  loadingGrid: true
}

const pqrsf = (state = initialState, action) => {
  switch (action.type) {
    case GET_SENT_PQRSF_SUCCESSFUL:
      state = {
        ...state,
        loadingGrid: false,
        createPqrsfError: null,
        pqrsf: action.payload.pqrsf
      }
      break
    case GET_PQRSF_SUCCESSFUL:
      state = {
        ...state,
        loadingGrid: false,
        createPqrsfError: null,
        pqrsf: action.payload.pqrsf
      }
      break
    case CREATE_PQRSF:
      state = {
        ...state,
        loading: true,
        createPqrsfError: null,
      }
      break
    case CREATE_PQRSF_SUCCESSFUL:
      state = {
        ...state,
        loading: false,
        createPqrsfError: null,
      }
      break
    case CREATE_PQRSF_FAILED:
      state = {
        ...state,
        loading: false,
        createPqrsfError: action.payload,
      }
      break
    default:
      state = { ...state }
      break
  }
  return state
}

export default pqrsf
