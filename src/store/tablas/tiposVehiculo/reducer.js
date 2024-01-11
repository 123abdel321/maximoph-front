import {
  GET_VEHICLE_TYPES_SUCCESSFUL,
  CREATE_VEHICLE_TYPE,
  CREATE_VEHICLE_TYPE_SUCCESSFUL,
  CREATE_VEHICLE_TYPE_FAILED,
  EDIT_VEHICLE_TYPE,
  EDIT_VEHICLE_TYPE_SUCCESSFUL,
  EDIT_VEHICLE_TYPE_FAILED,
  DELETE_VEHICLE_TYPE,
  DELETE_VEHICLE_TYPE_SUCCESSFUL,
} from "./actionTypes"

const initialState = {
  editVehicleTypeError: null,
  deleteVehicleTypeError: null,
  createVehicleTypeError: null,
  vehicleTypes: [],
  message: null,
  loading: true,
  loadingGrid: true
}

const vehicleTypes = (state = initialState, action) => {
  switch (action.type) {
    case GET_VEHICLE_TYPES_SUCCESSFUL:
      state = {
        ...state,
        loadingGrid: false,
        createVehicleTypeError: null,
        vehicleTypes: action.payload,
      }
      break
    case CREATE_VEHICLE_TYPE:
      state = {
        ...state,
        loading: true,
        createVehicleTypeError: null,
      }
      break
    case CREATE_VEHICLE_TYPE_SUCCESSFUL:
      state = {
        ...state,
        loading: false,
        createVehicleTypeError: null,
      }
      break
    case CREATE_VEHICLE_TYPE_FAILED:
      state = {
        ...state,
        loading: false,
        createVehicleTypeError: action.payload,
      }
      break
    case EDIT_VEHICLE_TYPE:
        state = {
          ...state,
          loading: true,
          editVehicleTypeError: null,
        }
        break
    case EDIT_VEHICLE_TYPE_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          editVehicleTypeError: null,
        }
        break
    case DELETE_VEHICLE_TYPE:
        state = {
          ...state,
          loading: true,
          deleteVehicleTypeError: null,
        }
        break
    case DELETE_VEHICLE_TYPE_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          deleteVehicleTypeError: null,
        }
        break
    default:
      state = { ...state }
      break
  }
  return state
}

export default vehicleTypes
