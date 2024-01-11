import {
  GET_BILLING_CONCEPTS,
  GET_BILLING_CONCEPTS_SUCCESSFUL,
  CREATE_BILLING_CONCEPT,
  CREATE_BILLING_CONCEPT_SUCCESSFUL,
  CREATE_BILLING_CONCEPT_FAILED,
  EDIT_BILLING_CONCEPT,
  EDIT_BILLING_CONCEPT_SUCCESSFUL,
  EDIT_BILLING_CONCEPT_FAILED,
  DELETE_BILLING_CONCEPT,
  DELETE_BILLING_CONCEPT_SUCCESSFUL,
  DELETE_BILLING_CONCEPT_FAILED,
} from "./actionTypes"

export const getBillingConcepts = (withButtons, cb, strict) => ({
  type: GET_BILLING_CONCEPTS,
  payload: {withButtons, cb, strict}
})

export const getBillingConceptsSuccessful = billingConcepts => ({
  type: GET_BILLING_CONCEPTS_SUCCESSFUL,
  payload: billingConcepts,
})

export const createBillingConcept = (billingConcept, cb) => {
  return {
    type: CREATE_BILLING_CONCEPT,
    payload: { billingConcept, cb }
  }
}

export const createBillingConceptSuccessful = billingConcept => {
  return {
    type: CREATE_BILLING_CONCEPT_SUCCESSFUL,
    payload: billingConcept,
  }
}

export const createBillingConceptFailed = billingConcept => {
  return {
    type: CREATE_BILLING_CONCEPT_FAILED,
    payload: billingConcept,
  }
}

export const editBillingConcept = (billingConcept, cb) => {
  return {
    type: EDIT_BILLING_CONCEPT,
    payload: { billingConcept, cb }
  }
}

export const editBillingConceptSuccessful = billingConcept => {
  return {
    type: EDIT_BILLING_CONCEPT_SUCCESSFUL,
    payload: billingConcept,
  }
}

export const editBillingConceptFailed = billingConcept => {
  return {
    type: EDIT_BILLING_CONCEPT_FAILED,
    payload: billingConcept,
  }
}

export const deleteBillingConcept = (billingConcept, cb) => {
  return {
    type: DELETE_BILLING_CONCEPT,
    payload: { billingConcept, cb }
  }
}

export const deleteBillingConceptSuccessful = billingConcept => {
  return {
    type: DELETE_BILLING_CONCEPT_SUCCESSFUL,
    payload: billingConcept,
  }
}

export const deleteBillingConceptFailed = billingConcept => {
  return {
    type: DELETE_BILLING_CONCEPT_FAILED,
    payload: billingConcept,
  }
}
