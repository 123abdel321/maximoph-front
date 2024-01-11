import {
  GET_USERS_ROLES,
  GET_USERS_ROLES_SUCCESSFUL,
  GET_ROLE_PERMISSIONS,
  CREATE_USER_ROL,
  CREATE_USER_ROL_SUCCESSFUL,
  CREATE_USER_ROL_FAILED,
  EDIT_USER_ROL,
  EDIT_USER_ROL_SUCCESSFUL,
  EDIT_USER_ROL_FAILED,
  EDIT_ROLE_PERMISSIONS,
  DELETE_USER_ROL,
  DELETE_USER_ROL_SUCCESSFUL,
  DELETE_USER_ROL_FAILED,
} from "./actionTypes"

export const getUsersRoles = (withButtons, cb) => ({
  type: GET_USERS_ROLES,
  payload: {withButtons, cb}
})

export const getUsersRolesSuccessful = dataUsersRoles => ({
  type: GET_USERS_ROLES_SUCCESSFUL,
  payload: dataUsersRoles,
})

export const getRolePermissions = (cb, userRol) => ({
  type: GET_ROLE_PERMISSIONS,
  payload: {cb, userRol}
})

export const editRolePermissions = (data, cb) => ({
  type: EDIT_ROLE_PERMISSIONS,
  payload: {data, cb}
})

export const createUserRol = (userRol, cb) => {
  return {
    type: CREATE_USER_ROL,
    payload: { userRol, cb }
  }
}

export const createUsersRolSuccessful = rol => {
  return {
    type: CREATE_USER_ROL_SUCCESSFUL,
    payload: rol,
  }
}

export const createUsersRolFailed = rol => {
  return {
    type: CREATE_USER_ROL_FAILED,
    payload: rol,
  }
}

export const editUserRol = (userRol, cb) => {
  return {
    type: EDIT_USER_ROL,
    payload: { userRol, cb }
  }
}

export const editUserRolSuccessful = rol => {
  return {
    type: EDIT_USER_ROL_SUCCESSFUL,
    payload: rol,
  }
}

export const editUserRolFailed = rol => {
  return {
    type: EDIT_USER_ROL_FAILED,
    payload: rol,
  }
}

export const deleteUserRol = (userRol, cb) => {
  return {
    type: DELETE_USER_ROL,
    payload: { userRol, cb }
  }
}

export const deleteUserRolSuccessful = rol => {
  return {
    type: DELETE_USER_ROL_SUCCESSFUL,
    payload: rol,
  }
}

export const deleteUserRolFailed = rol => {
  return {
    type: DELETE_USER_ROL_FAILED,
    payload: rol,
  }
}
