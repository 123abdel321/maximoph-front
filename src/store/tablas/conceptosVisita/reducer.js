import {
  GET_CONCEPTS_VISIT_SUCCESSFUL,
  CREATE_CONCEPT_VISIT,
  CREATE_CONCEPT_VISIT_SUCCESSFUL,
  CREATE_CONCEPT_VISIT_FAILED,
  EDIT_CONCEPT_VISIT,
  EDIT_CONCEPT_VISIT_SUCCESSFUL,
  EDIT_CONCEPT_VISIT_FAILED,
  DELETE_CONCEPT_VISIT,
  DELETE_CONCEPT_VISIT_SUCCESSFUL,
} from "./actionTypes"

const initialState = {
  editConceptVisitError: null,
  deleteConceptVisitError: null,
  createConceptVisitError: null,
  conceptsVisit: [],
  message: null,
  loading: true,
  loadingGrid: true
}

const conceptVisit = (state = initialState, action) => {
  switch (action.type) {
    case GET_CONCEPTS_VISIT_SUCCESSFUL:
      state = {
        ...state,
        loadingGrid: false,
        createConceptVisitError: null,
        conceptsVisit: action.payload,
      }
      break
    case CREATE_CONCEPT_VISIT:
      state = {
        ...state,
        loading: true,
        createConceptVisitError: null,
      }
      break
    case CREATE_CONCEPT_VISIT_SUCCESSFUL:
      state = {
        ...state,
        loading: false,
        createConceptVisitError: null,
      }
      break
    case CREATE_CONCEPT_VISIT_FAILED:
      state = {
        ...state,
        loading: false,
        createConceptVisitError: action.payload,
      }
      break
    case EDIT_CONCEPT_VISIT:
        state = {
          ...state,
          loading: true,
          editConceptVisitError: null,
        }
        break
    case EDIT_CONCEPT_VISIT_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          editConceptVisitError: null,
        }
        break
    case DELETE_CONCEPT_VISIT:
        state = {
          ...state,
          loading: true,
          deleteConceptVisitError: null,
        }
        break
    case DELETE_CONCEPT_VISIT_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          deleteConceptVisitError: null,
        }
        break
    default:
      state = { ...state }
      break
  }
  return state
}

export default conceptVisit
