import {
  GET_CONTROL_VISITS_SUCCESSFUL,
  CREATE_CONTROL_VISIT,
  CREATE_CONTROL_VISIT_SUCCESSFUL,
  CREATE_CONTROL_VISIT_FAILED,
  EDIT_CONTROL_VISIT,
  EDIT_CONTROL_VISIT_SUCCESSFUL,
  DELETE_CONTROL_VISIT,
  DELETE_CONTROL_VISIT_SUCCESSFUL,
} from "./actionTypes"

const initialState = {
  editControlVisitError: null,
  deleteControlVisitError: null,
  createControlVisitError: null,
  controlVisits: [],
  message: null,
  loading: true,
  loadingGrid: true
}

const controlVisit = (state = initialState, action) => {
  switch (action.type) {
    case GET_CONTROL_VISITS_SUCCESSFUL:
      state = {
        ...state,
        loadingGrid: false,
        createControlVisitError: null,
        controlVisits: action.payload
      }
      break
    case CREATE_CONTROL_VISIT:
      state = {
        ...state,
        loading: true,
        createControlVisitError: null,
      }
      break
    case CREATE_CONTROL_VISIT_SUCCESSFUL:
      state = {
        ...state,
        loading: false,
        createControlVisitError: null,
      }
      break
    case CREATE_CONTROL_VISIT_FAILED:
      state = {
        ...state,
        loading: false,
        createControlVisitError: action.payload,
      }
      break
    case EDIT_CONTROL_VISIT:
        state = {
          ...state,
          loading: true,
          editControlVisitError: null,
        }
        break
    case EDIT_CONTROL_VISIT_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          editControlVisitError: null,
        }
        break
    case DELETE_CONTROL_VISIT:
        state = {
          ...state,
          loading: true,
          deleteControlVisitError: null,
        }
        break
    case DELETE_CONTROL_VISIT_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          deleteControlVisitError: null,
        }
        break
    default:
      state = { ...state }
      break
  }
  return state
}

export default controlVisit
