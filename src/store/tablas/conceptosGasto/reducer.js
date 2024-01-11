import {
  GET_SPENT_CONCEPTS_SUCCESSFUL,
  CREATE_SPENT_CONCEPT,
  CREATE_SPENT_CONCEPT_SUCCESSFUL,
  CREATE_SPENT_CONCEPT_FAILED,
  EDIT_SPENT_CONCEPT,
  EDIT_SPENT_CONCEPT_SUCCESSFUL,
  EDIT_SPENT_CONCEPT_FAILED,
  DELETE_SPENT_CONCEPT,
  DELETE_SPENT_CONCEPT_SUCCESSFUL,
} from "./actionTypes"

const initialState = {
  editSpentConceptError: null,
  deleteSpentConceptError: null,
  createSpentConceptError: null,
  spentConcepts: [],
  message: null,
  loading: true,
  loadingGrid: true
}

const spentConcept = (state = initialState, action) => {
  switch (action.type) {
    case GET_SPENT_CONCEPTS_SUCCESSFUL:
      state = {
        ...state,
        loadingGrid: false,
        createSpentConceptError: null,
        spentConcepts: action.payload,
      }
      break
    case CREATE_SPENT_CONCEPT:
      state = {
        ...state,
        loading: true,
        createSpentConceptError: null,
      }
      break
    case CREATE_SPENT_CONCEPT_SUCCESSFUL:
      state = {
        ...state,
        loading: false,
        createSpentConceptError: null,
      }
      break
    case CREATE_SPENT_CONCEPT_FAILED:
      state = {
        ...state,
        loading: false,
        createSpentConceptError: action.payload,
      }
      break
    case EDIT_SPENT_CONCEPT:
        state = {
          ...state,
          loading: true,
          editSpentConceptError: null,
        }
        break
    case EDIT_SPENT_CONCEPT_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          editSpentConceptError: null,
        }
        break
    case DELETE_SPENT_CONCEPT:
        state = {
          ...state,
          loading: true,
          deleteSpentConceptError: null,
        }
        break
    case DELETE_SPENT_CONCEPT_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          deleteSpentConceptError: null,
        }
        break
    default:
      state = { ...state }
      break
  }
  return state
}

export default spentConcept
