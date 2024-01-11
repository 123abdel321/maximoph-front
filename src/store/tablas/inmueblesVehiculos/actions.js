import {
  UPLOAD_PHOTO_VEHICLE,
  UPLOAD_PHOTO_VEHICLE_FAILED,
  UPLOAD_PHOTO_VEHICLE_SUCCESSFUL,
  GET_PROPERTY_VEHICLES,
  GET_PROPERTY_VEHICLES_SUCCESSFUL,
  CREATE_PROPERTY_VEHICLE,
  CREATE_PROPERTY_VEHICLE_SUCCESSFUL,
  CREATE_PROPERTY_VEHICLE_FAILED,
  EDIT_PROPERTY_VEHICLE,
  EDIT_PROPERTY_VEHICLE_SUCCESSFUL,
  EDIT_PROPERTY_VEHICLE_FAILED,
  DELETE_PROPERTY_VEHICLE,
  DELETE_PROPERTY_VEHICLE_SUCCESSFUL,
  DELETE_PROPERTY_VEHICLE_FAILED,
} from "./actionTypes"

export const getPropertyVehicles = (withButtons, cb, editInmuebleId) => ({
  type: GET_PROPERTY_VEHICLES,
  payload: {withButtons, cb, editInmuebleId}
})

export const getPropertyVehiclesSuccessful = propertyVehicles => ({
  type: GET_PROPERTY_VEHICLES_SUCCESSFUL,
  payload: propertyVehicles,
})

export const createPropertyVehicle = (propertyVehicle, cb) => {
  return {
    type: CREATE_PROPERTY_VEHICLE,
    payload: { propertyVehicle, cb }
  }
}

export const createPropertyVehicleSuccessful = propertyVehicle => {
  return {
    type: CREATE_PROPERTY_VEHICLE_SUCCESSFUL,
    payload: propertyVehicle,
  }
}

export const createPropertyVehicleFailed = propertyVehicle => {
  return {
    type: CREATE_PROPERTY_VEHICLE_FAILED,
    payload: propertyVehicle,
  }
}

export const editPropertyVehicle = (propertyVehicle, cb) => {
  return {
    type: EDIT_PROPERTY_VEHICLE,
    payload: { propertyVehicle, cb }
  }
}

export const editPropertyVehicleSuccessful = propertyVehicle => {
  return {
    type: EDIT_PROPERTY_VEHICLE_SUCCESSFUL,
    payload: propertyVehicle,
  }
}

export const editPropertyVehicleFailed = propertyVehicle => {
  return {
    type: EDIT_PROPERTY_VEHICLE_FAILED,
    payload: propertyVehicle,
  }
}

export const deletePropertyVehicle = (propertyVehicle, cb) => {
  return {
    type: DELETE_PROPERTY_VEHICLE,
    payload: { propertyVehicle, cb }
  }
}

export const deletePropertyVehicleSuccessful = propertyVehicle => {
  return {
    type: DELETE_PROPERTY_VEHICLE_SUCCESSFUL,
    payload: propertyVehicle,
  }
}

export const deletePropertyVehicleFailed = propertyVehicle => {
  return {
    type: DELETE_PROPERTY_VEHICLE_FAILED,
    payload: propertyVehicle,
  }
}

export const uploadPhotoVehicle = (photoVehicle, cb) => {
  return {
    type: UPLOAD_PHOTO_VEHICLE,
    payload: { photoVehicle, cb }
  }
}

export const uploadPhotoVehicleSuccessful = photoVehicle => {
  return {
    type: UPLOAD_PHOTO_VEHICLE_SUCCESSFUL,
    payload: photoVehicle,
  }
}

export const uploadPhotoVehicleFailed = photoVehicle => {
  return {
    type: UPLOAD_PHOTO_VEHICLE_FAILED,
    payload: photoVehicle,
  }
}
