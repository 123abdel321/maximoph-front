import {
  GET_TYPES_HOMEWORK,
  GET_TYPES_HOMEWORK_SUCCESSFUL,
  CREATE_TYPE_HOMEWORK,
  CREATE_TYPE_HOMEWORK_SUCCESSFUL,
  CREATE_TYPE_HOMEWORK_FAILED,
  EDIT_TYPE_HOMEWORK,
  EDIT_TYPE_HOMEWORK_SUCCESSFUL,
  EDIT_TYPE_HOMEWORK_FAILED,
  DELETE_TYPE_HOMEWORK,
  DELETE_TYPE_HOMEWORK_SUCCESSFUL,
  DELETE_TYPE_HOMEWORK_FAILED,
} from "./actionTypes"

export const getTypesHomework = (withButtons, cb) => ({
  type: GET_TYPES_HOMEWORK,
  payload: {withButtons, cb}
})

export const getTypesHomeworkSuccessful = concept => ({
  type: GET_TYPES_HOMEWORK_SUCCESSFUL,
  payload: concept,
})

export const createTypeHomework = (concept, cb) => {
  return {
    type: CREATE_TYPE_HOMEWORK,
    payload: { concept, cb }
  }
}

export const createTypeHomeworkSuccessful = concept => {
  return {
    type: CREATE_TYPE_HOMEWORK_SUCCESSFUL,
    payload: concept,
  }
}

export const createTypeHomeworkFailed = concept => {
  return {
    type: CREATE_TYPE_HOMEWORK_FAILED,
    payload: concept,
  }
}

export const editTypeHomework = (concept, cb) => {
  return {
    type: EDIT_TYPE_HOMEWORK,
    payload: { concept, cb }
  }
}

export const editTypeHomeworkSuccessful = concept => {
  return {
    type: EDIT_TYPE_HOMEWORK_SUCCESSFUL,
    payload: concept,
  }
}

export const editTypeHomeworkFailed = concept => {
  return {
    type: EDIT_TYPE_HOMEWORK_FAILED,
    payload: concept,
  }
}

export const deleteTypeHomework = (concept, cb) => {
  return {
    type: DELETE_TYPE_HOMEWORK,
    payload: { concept, cb }
  }
}

export const deleteTypeHomeworkSuccessful = concept => {
  return {
    type: DELETE_TYPE_HOMEWORK_SUCCESSFUL,
    payload: concept,
  }
}

export const deleteTypeHomeworkFailed = concept => {
  return {
    type: DELETE_TYPE_HOMEWORK_FAILED,
    payload: concept,
  }
}
