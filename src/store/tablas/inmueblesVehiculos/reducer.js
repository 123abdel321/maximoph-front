import {
  GET_PROPERTY_VEHICLES_SUCCESSFUL,
  CREATE_PROPERTY_VEHICLE,
  CREATE_PROPERTY_VEHICLE_SUCCESSFUL,
  CREATE_PROPERTY_VEHICLE_FAILED,
  EDIT_PROPERTY_VEHICLE,
  EDIT_PROPERTY_VEHICLE_SUCCESSFUL,
  EDIT_PROPERTY_VEHICLE_FAILED,
  DELETE_PROPERTY_VEHICLE,
  DELETE_PROPERTY_VEHICLE_SUCCESSFUL,

  UPLOAD_PHOTO_VEHICLE,
  UPLOAD_PHOTO_VEHICLE_SUCCESSFUL,
  UPLOAD_PHOTO_VEHICLE_FAILED,
} from "./actionTypes"

const initialState = {
  editPropertyVehicleError: null,
  deletePropertyVehicleError: null,
  createPropertyVehicleError: null,
  propertyVehicles: [],
  message: null,
  loading: true,
  loadingGrid: true
}

const propertyVehicle = (state = initialState, action) => {
  switch (action.type) {
    case GET_PROPERTY_VEHICLES_SUCCESSFUL:
      state = {
        ...state,
        loadingGrid: false,
        createPropertyVehicleError: null,
        propertyVehicles: action.payload,
      }
      break
    case CREATE_PROPERTY_VEHICLE:
      state = {
        ...state,
        loading: true,
        createPropertyVehicleError: null,
      }
      break
    case CREATE_PROPERTY_VEHICLE_SUCCESSFUL:
      state = {
        ...state,
        loading: false,
        createPropertyVehicleError: null,
      }
      break
    case CREATE_PROPERTY_VEHICLE_FAILED:
      state = {
        ...state,
        loading: false,
        createPropertyVehicleError: action.payload,
      }
      break
    case EDIT_PROPERTY_VEHICLE:
        state = {
          ...state,
          loading: true,
          editPropertyVehicleError: null,
        }
        break
    case EDIT_PROPERTY_VEHICLE_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          editPropertyVehicleError: null,
        }
        break
    case DELETE_PROPERTY_VEHICLE:
        state = {
          ...state,
          loading: true,
          deletePropertyVehicleError: null,
        }
        break
    case DELETE_PROPERTY_VEHICLE_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          deletePropertyVehicleError: null,
        }
        break
    case UPLOAD_PHOTO_VEHICLE:
      state = {
        ...state,
        loading: true,
        uploadPhotoVehicleError: null,
      }
      break
    case UPLOAD_PHOTO_VEHICLE_SUCCESSFUL:
      state = {
        ...state,
        loading: false,
        uploadPhotoVehicleError: null,
      }
      break
    case UPLOAD_PHOTO_VEHICLE_FAILED:
      state = {
        ...state,
        loading: false,
        uploadPhotoVehicleError: action.payload,
      }
      break
    default:
      state = { ...state }
      break
  }
  return state
}

export default propertyVehicle
