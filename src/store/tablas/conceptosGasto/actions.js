import {
  GET_SPENT_CONCEPTS,
  GET_SPENT_CONCEPTS_SUCCESSFUL,
  CREATE_SPENT_CONCEPT,
  CREATE_SPENT_CONCEPT_SUCCESSFUL,
  CREATE_SPENT_CONCEPT_FAILED,
  EDIT_SPENT_CONCEPT,
  EDIT_SPENT_CONCEPT_SUCCESSFUL,
  EDIT_SPENT_CONCEPT_FAILED,
  DELETE_SPENT_CONCEPT,
  DELETE_SPENT_CONCEPT_SUCCESSFUL,
  DELETE_SPENT_CONCEPT_FAILED,
} from "./actionTypes"

export const getSpentConcepts = (withButtons, cb) => ({
  type: GET_SPENT_CONCEPTS,
  payload: {withButtons, cb}
})

export const getSpentConceptsSuccessful = spentConcepts => ({
  type: GET_SPENT_CONCEPTS_SUCCESSFUL,
  payload: spentConcepts,
})

export const createSpentConcept = (spentConcept, cb) => {
  return {
    type: CREATE_SPENT_CONCEPT,
    payload: { spentConcept, cb }
  }
}

export const createSpentConceptSuccessful = spentConcept => {
  return {
    type: CREATE_SPENT_CONCEPT_SUCCESSFUL,
    payload: spentConcept,
  }
}

export const createSpentConceptFailed = spentConcept => {
  return {
    type: CREATE_SPENT_CONCEPT_FAILED,
    payload: spentConcept,
  }
}

export const editSpentConcept = (spentConcept, cb) => {
  return {
    type: EDIT_SPENT_CONCEPT,
    payload: { spentConcept, cb }
  }
}

export const editSpentConceptSuccessful = spentConcept => {
  return {
    type: EDIT_SPENT_CONCEPT_SUCCESSFUL,
    payload: spentConcept,
  }
}

export const editSpentConceptFailed = spentConcept => {
  return {
    type: EDIT_SPENT_CONCEPT_FAILED,
    payload: spentConcept,
  }
}

export const deleteSpentConcept = (spentConcept, cb) => {
  return {
    type: DELETE_SPENT_CONCEPT,
    payload: { spentConcept, cb }
  }
}

export const deleteSpentConceptSuccessful = spentConcept => {
  return {
    type: DELETE_SPENT_CONCEPT_SUCCESSFUL,
    payload: spentConcept,
  }
}

export const deleteSpentConceptFailed = spentConcept => {
  return {
    type: DELETE_SPENT_CONCEPT_FAILED,
    payload: spentConcept,
  }
}
