import {
  GET_SENT_PQRSF,
  GET_SENT_PQRSF_SUCCESSFUL,
  GET_PQRSF,
  GET_PQRSF_SUCCESSFUL,
  CREATE_PQRSF,
  CREATE_PQRSF_SUCCESSFUL,
  CREATE_PQRSF_FAILED
} from "./actionTypes"

export const getSentPqrsf = (withButtons, cb) => ({
  type: GET_SENT_PQRSF,
  payload: {withButtons, cb}
})

export const getSentPqrsfSuccessful = (sentPqrsf) => ({
  type: GET_SENT_PQRSF_SUCCESSFUL,
  payload: { sentPqrsf },
})

export const getPqrsf = (withButtons, cb) => ({
  type: GET_PQRSF,
  payload: {withButtons, cb}
})

export const getPqrsfSuccessful = (pqrsf) => ({
  type: GET_PQRSF_SUCCESSFUL,
  payload: { pqrsf },
})

export const createPqrsf = (pqrsf, cb) => {
  return {
    type: CREATE_PQRSF,
    payload: { pqrsf, cb }
  }
}

export const createPqrsfSuccessful = pqrsf => {
  return {
    type: CREATE_PQRSF_SUCCESSFUL,
    payload: pqrsf,
  }
}

export const createPqrsfFailed = pqrsf => {
  return {
    type: CREATE_PQRSF_FAILED,
    payload: pqrsf,
  }
}
