import {
  GET_ZONES_SUCCESSFUL,
  CREATE_ZONE,
  CREATE_ZONE_SUCCESSFUL,
  CREATE_ZONE_FAILED,
  EDIT_ZONE,
  EDIT_ZONE_SUCCESSFUL,
  EDIT_ZONE_FAILED,
  DELETE_ZONE,
  DELETE_ZONE_SUCCESSFUL,
} from "./actionTypes"

const initialState = {
  editZoneError: null,
  deleteZoneError: null,
  createZoneError: null,
  zones: [],
  message: null,
  loading: true,
  loadingGrid: true
}

const zone = (state = initialState, action) => {
  switch (action.type) {
    case GET_ZONES_SUCCESSFUL:
      state = {
        ...state,
        loadingGrid: false,
        createZoneError: null,
        zones: action.payload,
      }
      break
    case CREATE_ZONE:
      state = {
        ...state,
        loading: true,
        createZoneError: null,
      }
      break
    case CREATE_ZONE_SUCCESSFUL:
      state = {
        ...state,
        loading: false,
        createZoneError: null,
      }
      break
    case CREATE_ZONE_FAILED:
      state = {
        ...state,
        loading: false,
        createZoneError: action.payload,
      }
      break
    case EDIT_ZONE:
        state = {
          ...state,
          loading: true,
          editZoneError: null,
        }
        break
    case EDIT_ZONE_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          editZoneError: null,
        }
        break
    case DELETE_ZONE:
        state = {
          ...state,
          loading: true,
          deleteZoneError: null,
        }
        break
    case DELETE_ZONE_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          deleteZoneError: null,
        }
        break
    default:
      state = { ...state }
      break
  }
  return state
}

export default zone
