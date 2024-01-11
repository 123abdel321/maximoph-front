import {
  GET_CONCEPTS_VISIT,
  GET_CONCEPTS_VISIT_SUCCESSFUL,
  CREATE_CONCEPT_VISIT,
  CREATE_CONCEPT_VISIT_SUCCESSFUL,
  CREATE_CONCEPT_VISIT_FAILED,
  EDIT_CONCEPT_VISIT,
  EDIT_CONCEPT_VISIT_SUCCESSFUL,
  EDIT_CONCEPT_VISIT_FAILED,
  DELETE_CONCEPT_VISIT,
  DELETE_CONCEPT_VISIT_SUCCESSFUL,
  DELETE_CONCEPT_VISIT_FAILED,
} from "./actionTypes"

export const getConceptsVisit = (withButtons, cb) => ({
  type: GET_CONCEPTS_VISIT,
  payload: {withButtons, cb}
})

export const getConceptsVisitSuccessful = conceptsVisit => ({
  type: GET_CONCEPTS_VISIT_SUCCESSFUL,
  payload: conceptsVisit,
})

export const createConceptVisit = (conceptVisit, cb) => {
  return {
    type: CREATE_CONCEPT_VISIT,
    payload: { conceptVisit, cb }
  }
}

export const createConceptVisitSuccessful = conceptVisit => {
  return {
    type: CREATE_CONCEPT_VISIT_SUCCESSFUL,
    payload: conceptVisit,
  }
}

export const createConceptVisitFailed = conceptVisit => {
  return {
    type: CREATE_CONCEPT_VISIT_FAILED,
    payload: conceptVisit,
  }
}

export const editConceptVisit = (concept, cb) => {
  return {
    type: EDIT_CONCEPT_VISIT,
    payload: { concept, cb }
  }
}

export const editConceptVisitSuccessful = conceptVisit => {
  return {
    type: EDIT_CONCEPT_VISIT_SUCCESSFUL,
    payload: conceptVisit,
  }
}

export const editConceptVisitFailed = conceptVisit => {
  return {
    type: EDIT_CONCEPT_VISIT_FAILED,
    payload: conceptVisit,
  }
}

export const deleteConceptVisit = (conceptVisit, cb) => {
  return {
    type: DELETE_CONCEPT_VISIT,
    payload: { conceptVisit, cb }
  }
}

export const deleteConceptVisitSuccessful = conceptVisit => {
  return {
    type: DELETE_CONCEPT_VISIT_SUCCESSFUL,
    payload: conceptVisit,
  }
}

export const deleteConceptVisitFailed = conceptVisit => {
  return {
    type: DELETE_CONCEPT_VISIT_FAILED,
    payload: conceptVisit,
  }
}
