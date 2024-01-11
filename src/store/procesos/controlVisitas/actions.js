import {
  GET_CONTROL_VISITS,
  GET_CONTROL_VISITS_SUCCESSFUL,
  GET_CONTROL_VISITS_VISITORS,
  CREATE_CONTROL_VISIT,
  CREATE_CONTROL_VISIT_SUCCESSFUL,
  CREATE_CONTROL_VISIT_FAILED,
  EDIT_CONTROL_VISIT,
  EDIT_CONTROL_VISIT_SUCCESSFUL,
  EDIT_CONTROL_VISIT_FAILED,
  DELETE_CONTROL_VISIT,
  DELETE_CONTROL_VISIT_SUCCESSFUL,
  DELETE_CONTROL_VISIT_FAILED,
} from "./actionTypes"

export const getControlVisits = (withButtons, cb) => ({
  type: GET_CONTROL_VISITS,
  payload: {withButtons, cb}
})

export const getControlVisitsSuccessful = controlVisits => ({
  type: GET_CONTROL_VISITS_SUCCESSFUL,
  payload: controlVisits,
})

export const getControlVisitsVisitors = (cb, search) => ({
  type: GET_CONTROL_VISITS_VISITORS,
  payload: {cb, search}
})

export const createControlVisit = (controlVisit, cb) => {
  return {
    type: CREATE_CONTROL_VISIT,
    payload: { controlVisit, cb }
  }
}

export const createControlVisitSuccessful = controlVisit => {
  return {
    type: CREATE_CONTROL_VISIT_SUCCESSFUL,
    payload: controlVisit,
  }
}

export const createControlVisitFailed = controlVisit => {
  return {
    type: CREATE_CONTROL_VISIT_FAILED,
    payload: controlVisit,
  }
}

export const editControlVisit = (controlVisit, cb) => {
  return {
    type: EDIT_CONTROL_VISIT,
    payload: { controlVisit, cb }
  }
}

export const editControlVisitSuccessful = controlVisit => {
  return {
    type: EDIT_CONTROL_VISIT_SUCCESSFUL,
    payload: controlVisit,
  }
}

export const editControlVisitFailed = controlVisit => {
  return {
    type: EDIT_CONTROL_VISIT_FAILED,
    payload: controlVisit,
  }
}

export const deleteControlVisit = (controlVisit, cb) => {
  return {
    type: DELETE_CONTROL_VISIT,
    payload: { controlVisit, cb }
  }
}

export const deleteControlVisitSuccessful = controlVisit => {
  return {
    type: DELETE_CONTROL_VISIT_SUCCESSFUL,
    payload: controlVisit,
  }
}

export const deleteControlVisitFailed = controlVisit => {
  return {
    type: DELETE_CONTROL_VISIT_FAILED,
    payload: controlVisit,
  }
}
