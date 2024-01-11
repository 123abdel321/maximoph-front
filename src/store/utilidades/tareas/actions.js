import {
  GET_HOMEWORKS,
  GET_HOMEWORKS_SUCCESSFUL,
  GET_OWN_HOMEWORKS,
  GET_OWN_HOMEWORKS_SUCCESSFUL,
  CREATE_HOMEWORK_MASSIVE,
  CREATE_HOMEWORK,
  CREATE_HOMEWORK_SUCCESSFUL,
  CREATE_HOMEWORK_FAILED,
  EDIT_HOMEWORK,
  EDIT_HOMEWORK_SUCCESSFUL,
  EDIT_HOMEWORK_FAILED,
  COMPLETE_HOMEWORK,
  COMPLETE_HOMEWORK_SUCCESSFUL,
  COMPLETE_HOMEWORK_FAILED,
  DELETE_HOMEWORK_MASSIVE,
  DELETE_HOMEWORK,
  DELETE_HOMEWORK_SUCCESSFUL,
  DELETE_HOMEWORK_FAILED,
} from "./actionTypes"

export const getOwnHomeworks = (withButtons, cb) => ({
  type: GET_OWN_HOMEWORKS,
  payload: {withButtons, cb}
})

export const getOwnHomeworksSuccessful = homework => ({
  type: GET_OWN_HOMEWORKS_SUCCESSFUL,
  payload: homework,
})

export const getHomeworks = (withButtons, cb) => ({
  type: GET_HOMEWORKS,
  payload: {withButtons, cb}
})

export const getHomeworksSuccessful = homework => ({
  type: GET_HOMEWORKS_SUCCESSFUL,
  payload: homework,
})

export const createHomework = (homework, cb) => {
  return {
    type: CREATE_HOMEWORK,
    payload: { homework, cb }
  }
}

export const createHomeworkSuccessful = homework => {
  return {
    type: CREATE_HOMEWORK_SUCCESSFUL,
    payload: homework,
  }
}

export const createHomeworkFailed = homework => {
  return {
    type: CREATE_HOMEWORK_FAILED,
    payload: homework,
  }
}

export const createHomeworkMassive = (homeworkMassive, cb) => {
  return {
    type: CREATE_HOMEWORK_MASSIVE,
    payload: { homeworkMassive, cb }
  }
}

export const editHomework = (homework, cb) => {
  return {
    type: EDIT_HOMEWORK,
    payload: { homework, cb }
  }
}

export const editHomeworkSuccessful = homework => {
  return {
    type: EDIT_HOMEWORK_SUCCESSFUL,
    payload: homework,
  }
}

export const editHomeworkFailed = homework => {
  return {
    type: EDIT_HOMEWORK_FAILED,
    payload: homework,
  }
}

export const completeHomework = (homework, cb) => {
  return {
    type: COMPLETE_HOMEWORK,
    payload: { homework, cb }
  }
}

export const completeHomeworkSuccessful = homework => {
  return {
    type: COMPLETE_HOMEWORK_SUCCESSFUL,
    payload: homework,
  }
}

export const completeHomeworkFailed = homework => {
  return {
    type: COMPLETE_HOMEWORK_FAILED,
    payload: homework,
  }
}

export const deleteHomeworkMassive = (homeworkMassive, cb) => {
  return {
    type: DELETE_HOMEWORK_MASSIVE,
    payload: { homeworkMassive, cb }
  }
}

export const deleteHomework = (homework, cb) => {
  return {
    type: DELETE_HOMEWORK,
    payload: { homework, cb }
  }
}

export const deleteHomeworkSuccessful = homework => {
  return {
    type: DELETE_HOMEWORK_SUCCESSFUL,
    payload: homework,
  }
}

export const deleteHomeworkFailed = homework => {
  return {
    type: DELETE_HOMEWORK_FAILED,
    payload: homework,
  }
}
