import {
  GET_VEHICLE_TYPES,
  GET_VEHICLE_TYPES_SUCCESSFUL,
  CREATE_VEHICLE_TYPE,
  CREATE_VEHICLE_TYPE_SUCCESSFUL,
  CREATE_VEHICLE_TYPE_FAILED,
  EDIT_VEHICLE_TYPE,
  EDIT_VEHICLE_TYPE_SUCCESSFUL,
  EDIT_VEHICLE_TYPE_FAILED,
  DELETE_VEHICLE_TYPE,
  DELETE_VEHICLE_TYPE_SUCCESSFUL,
  DELETE_VEHICLE_TYPE_FAILED,
} from "./actionTypes"

export const getVehicleTypes = (withButtons, cb) => ({
  type: GET_VEHICLE_TYPES,
  payload: {withButtons, cb}
})

export const getVehicleTypesSuccessful = vehicleTypes => ({
  type: GET_VEHICLE_TYPES_SUCCESSFUL,
  payload: vehicleTypes,
})

export const createVehicleType = (vehicleType, cb) => {
  return {
    type: CREATE_VEHICLE_TYPE,
    payload: { vehicleType, cb }
  }
}

export const createVehicleTypeSuccessful = vehicleType => {
  return {
    type: CREATE_VEHICLE_TYPE_SUCCESSFUL,
    payload: vehicleType,
  }
}

export const createVehicleTypeFailed = vehicleType => {
  return {
    type: CREATE_VEHICLE_TYPE_FAILED,
    payload: vehicleType,
  }
}

export const editVehicleType = (vehicleType, cb) => {
  return {
    type: EDIT_VEHICLE_TYPE,
    payload: { vehicleType, cb }
  }
}

export const editVehicleTypeSuccessful = vehicleType => {
  return {
    type: EDIT_VEHICLE_TYPE_SUCCESSFUL,
    payload: vehicleType,
  }
}

export const editVehicleTypeFailed = vehicleType => {
  return {
    type: EDIT_VEHICLE_TYPE_FAILED,
    payload: vehicleType,
  }
}

export const deleteVehicleType = (vehicleType, cb) => {
  return {
    type: DELETE_VEHICLE_TYPE,
    payload: { vehicleType, cb }
  }
}

export const deleteVehicleTypeSuccessful = vehicleType => {
  return {
    type: DELETE_VEHICLE_TYPE_SUCCESSFUL,
    payload: vehicleType,
  }
}

export const deleteVehicleTypeFailed = vehicleType => {
  return {
    type: DELETE_VEHICLE_TYPE_FAILED,
    payload: vehicleType,
  }
}
