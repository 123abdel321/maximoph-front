import {
  GET_USERS_ROLES_SUCCESSFUL,
  CREATE_USER_ROL,
  CREATE_USER_ROL_SUCCESSFUL,
  CREATE_USER_ROL_FAILED,
  EDIT_USER_ROL,
  EDIT_USER_ROL_SUCCESSFUL,
  EDIT_USER_ROL_FAILED,
  DELETE_USER_ROL,
  DELETE_USER_ROL_SUCCESSFUL,
} from "./actionTypes"

const initialState = {
  editUserRolError: null,
  deleteUserRolError: null,
  createUserRolError: null,
  usersRoles: [],
  message: null,
  loading: true,
  loadingGrid: true
}

const userRol = (state = initialState, action) => {
  switch (action.type) {
    case GET_USERS_ROLES_SUCCESSFUL:
      state = {
        ...state,
        loadingGrid: false,
        createUserRolError: null,
        usersRoles: action.payload,
      }
      break
    case CREATE_USER_ROL:
      state = {
        ...state,
        loading: true,
        createUserRolError: null,
      }
      break
    case CREATE_USER_ROL_SUCCESSFUL:
      state = {
        ...state,
        loading: false,
        createUserRolError: null,
      }
      break
    case CREATE_USER_ROL_FAILED:
      state = {
        ...state,
        loading: false,
        createUserRolError: action.payload,
      }
      break
    case EDIT_USER_ROL:
        state = {
          ...state,
          loading: true,
          editUserRolError: null,
        }
        break
    case EDIT_USER_ROL_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          editUserRolError: null,
        }
        break
    case DELETE_USER_ROL:
        state = {
          ...state,
          loading: true,
          deleteUserRolError: null,
        }
        break
    case DELETE_USER_ROL_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          deleteUserRolError: null,
        }
        break
    default:
      state = { ...state }
      break
  }
  return state
}

export default userRol
