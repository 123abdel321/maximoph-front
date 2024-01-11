import {
  GET_SPENTS,
  GET_SPENT_PDF,
  GET_SPENTS_SUCCESSFUL,
  CREATE_SPENT,
  CREATE_SPENT_SUCCESSFUL,
  CREATE_SPENT_FAILED,
  EDIT_SPENT,
  EDIT_SPENT_SUCCESSFUL,
  EDIT_SPENT_FAILED,
  DELETE_SPENT,
  DELETE_SPENT_SUCCESSFUL,
  DELETE_SPENT_FAILED,
} from "./actionTypes"

export const getSpents = (withButtons, cb) => ({
  type: GET_SPENTS,
  payload: {withButtons, cb}
})

export const getSpentsSuccessful = (spents, spentNextNumber, controlFechaDigitacion) => ({
  type: GET_SPENTS_SUCCESSFUL,
  payload: { spents, spentNextNumber, controlFechaDigitacion },
})

export const getSpentPDF = (withButtons, cb, idSpent) => ({
  type: GET_SPENT_PDF,
  payload: {withButtons, cb, idSpent}
})

export const createSpent = (spent, cb) => {
  return {
    type: CREATE_SPENT,
    payload: { spent, cb }
  }
}

export const createSpentSuccessful = spent => {
  return {
    type: CREATE_SPENT_SUCCESSFUL,
    payload: spent,
  }
}

export const createSpentFailed = spent => {
  return {
    type: CREATE_SPENT_FAILED,
    payload: spent,
  }
}

export const editSpent = (spent, cb) => {
  return {
    type: EDIT_SPENT,
    payload: { spent, cb }
  }
}

export const editSpentSuccessful = spent => {
  return {
    type: EDIT_SPENT_SUCCESSFUL,
    payload: spent,
  }
}

export const editSpentFailed = spent => {
  return {
    type: EDIT_SPENT_FAILED,
    payload: spent,
  }
}

export const deleteSpent = (spent, cb) => {
  return {
    type: DELETE_SPENT,
    payload: { spent, cb }
  }
}

export const deleteSpentSuccessful = spent => {
  return {
    type: DELETE_SPENT_SUCCESSFUL,
    payload: spent,
  }
}

export const deleteSpentFailed = spent => {
  return {
    type: DELETE_SPENT_FAILED,
    payload: spent,
  }
}
