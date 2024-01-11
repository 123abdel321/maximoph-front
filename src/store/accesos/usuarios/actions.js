import {
  GET_CLIENT_USERS,
  GET_CLIENT_USERS_SUCCESSFUL,
  CREATE_CLIENT_USER,
  CREATE_CLIENT_USER_SUCCESSFUL,
  CREATE_CLIENT_USER_FAILED,
  EDIT_CLIENT_USER,
  EDIT_CLIENT_USER_SUCCESSFUL,
  EDIT_CLIENT_USER_FAILED,
  DELETE_CLIENT_USER,
  DELETE_CLIENT_USER_SUCCESSFUL,
  DELETE_CLIENT_USER_FAILED,
} from "./actionTypes"

export const getClientUsers = (withButtons, cb) => ({
  type: GET_CLIENT_USERS,
  payload: {withButtons, cb}
})

export const getClientUsersSuccessful = clientUser => ({
  type: GET_CLIENT_USERS_SUCCESSFUL,
  payload: clientUser,
})

export const createClientUser = (clientUser, cb) => {
  return {
    type: CREATE_CLIENT_USER,
    payload: { clientUser, cb }
  }
}

export const createClientUserSuccessful = clientUser => {
  return {
    type: CREATE_CLIENT_USER_SUCCESSFUL,
    payload: clientUser,
  }
}

export const createClientUserFailed = clientUser => {
  return {
    type: CREATE_CLIENT_USER_FAILED,
    payload: clientUser,
  }
}

export const editClientUser = (clientUser, cb) => {
  return {
    type: EDIT_CLIENT_USER,
    payload: { clientUser, cb }
  }
}

export const editClientUserSuccessful = clientUser => {
  return {
    type: EDIT_CLIENT_USER_SUCCESSFUL,
    payload: clientUser,
  }
}

export const editClientUserFailed = clientUser => {
  return {
    type: EDIT_CLIENT_USER_FAILED,
    payload: clientUser,
  }
}

export const deleteClientUser = (clientUser, cb) => {
  return {
    type: DELETE_CLIENT_USER,
    payload: { clientUser, cb }
  }
}

export const deleteClientUserSuccessful = clientUser => {
  return {
    type: DELETE_CLIENT_USER_SUCCESSFUL,
    payload: clientUser,
  }
}

export const deleteClientUserFailed = clientUser => {
  return {
    type: DELETE_CLIENT_USER_FAILED,
    payload: clientUser,
  }
}
