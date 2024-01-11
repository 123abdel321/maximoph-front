import {
  GET_BILLING_CONCEPTS_SUCCESSFUL,
  CREATE_BILLING_CONCEPT,
  CREATE_BILLING_CONCEPT_SUCCESSFUL,
  CREATE_BILLING_CONCEPT_FAILED,
  EDIT_BILLING_CONCEPT,
  EDIT_BILLING_CONCEPT_SUCCESSFUL,
  EDIT_BILLING_CONCEPT_FAILED,
  DELETE_BILLING_CONCEPT,
  DELETE_BILLING_CONCEPT_SUCCESSFUL,
} from "./actionTypes"

const initialState = {
  editBillingConceptError: null,
  deleteBillingConceptError: null,
  createBillingConceptError: null,
  billingConcepts: [],
  message: null,
  loading: true,
  loadingGrid: true
}

const billingConcept = (state = initialState, action) => {
  switch (action.type) {
    case GET_BILLING_CONCEPTS_SUCCESSFUL:
      state = {
        ...state,
        loadingGrid: false,
        createBillingConceptError: null,
        billingConcepts: action.payload,
      }
      break
    case CREATE_BILLING_CONCEPT:
      state = {
        ...state,
        loading: true,
        createBillingConceptError: null,
      }
      break
    case CREATE_BILLING_CONCEPT_SUCCESSFUL:
      state = {
        ...state,
        loading: false,
        createBillingConceptError: null,
      }
      break
    case CREATE_BILLING_CONCEPT_FAILED:
      state = {
        ...state,
        loading: false,
        createBillingConceptError: action.payload,
      }
      break
    case EDIT_BILLING_CONCEPT:
        state = {
          ...state,
          loading: true,
          editBillingConceptError: null,
        }
        break
    case EDIT_BILLING_CONCEPT_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          editBillingConceptError: null,
        }
        break
    case DELETE_BILLING_CONCEPT:
        state = {
          ...state,
          loading: true,
          deleteBillingConceptError: null,
        }
        break
    case DELETE_BILLING_CONCEPT_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          deleteBillingConceptError: null,
        }
        break
    default:
      state = { ...state }
      break
  }
  return state
}

export default billingConcept
