import {
  GET_PROPERTIES_OWNER_RENTER,
  GET_PROPERTY_OWNERS_RENTERS,
  GET_PROPERTY_OWNERS_RENTERS_SUCCESSFUL,
  CREATE_PROPERTY_OWNER_RENTER,
  CREATE_PROPERTY_OWNER_RENTER_SUCCESSFUL,
  CREATE_PROPERTY_OWNER_RENTER_FAILED,
  EDIT_PROPERTY_OWNER_RENTER,
  EDIT_PROPERTY_OWNER_RENTER_SUCCESSFUL,
  EDIT_PROPERTY_OWNER_RENTER_FAILED,
  DELETE_PROPERTY_OWNER_RENTER,
  DELETE_PROPERTY_OWNER_RENTER_SUCCESSFUL,
  DELETE_PROPERTY_OWNER_RENTER_FAILED,
} from "./actionTypes"

export const getPropertiesOwnerRenter = (withButtons, cb, email) => ({
  type: GET_PROPERTIES_OWNER_RENTER,
  payload: {withButtons, cb, email}
})

export const getPropertyOwnersRenters = (withButtons, cb, editInmuebleId) => ({
  type: GET_PROPERTY_OWNERS_RENTERS,
  payload: {withButtons, cb, editInmuebleId}
})

export const getPropertyOwnersRentersSuccessful = propertyOwnersRenters => ({
  type: GET_PROPERTY_OWNERS_RENTERS_SUCCESSFUL,
  payload: propertyOwnersRenters,
})

export const createPropertyOwnerRenter = (propertyOwnerRenter, cb) => {
  return {
    type: CREATE_PROPERTY_OWNER_RENTER,
    payload: { propertyOwnerRenter, cb }
  }
}

export const createPropertyOwnerRenterSuccessful = propertyOwnerRenter => {
  return {
    type: CREATE_PROPERTY_OWNER_RENTER_SUCCESSFUL,
    payload: propertyOwnerRenter,
  }
}

export const createPropertyOwnerRenterFailed = propertyOwnerRenter => {
  return {
    type: CREATE_PROPERTY_OWNER_RENTER_FAILED,
    payload: propertyOwnerRenter,
  }
}

export const editPropertyOwnerRenter = (propertyOwnerRenter, cb) => {
  return {
    type: EDIT_PROPERTY_OWNER_RENTER,
    payload: { propertyOwnerRenter, cb }
  }
}

export const editPropertyOwnerRenterSuccessful = propertyOwnerRenter => {
  return {
    type: EDIT_PROPERTY_OWNER_RENTER_SUCCESSFUL,
    payload: propertyOwnerRenter,
  }
}

export const editPropertyOwnerRenterFailed = propertyOwnerRenter => {
  return {
    type: EDIT_PROPERTY_OWNER_RENTER_FAILED,
    payload: propertyOwnerRenter,
  }
}

export const deletePropertyOwnerRenter = (propertyOwnerRenter, cb) => {
  return {
    type: DELETE_PROPERTY_OWNER_RENTER,
    payload: { propertyOwnerRenter, cb }
  }
}

export const deletePropertyOwnerRenterSuccessful = propertyOwnerRenter => {
  return {
    type: DELETE_PROPERTY_OWNER_RENTER_SUCCESSFUL,
    payload: propertyOwnerRenter,
  }
}

export const deletePropertyOwnerRenterFailed = propertyOwnerRenter => {
  return {
    type: DELETE_PROPERTY_OWNER_RENTER_FAILED,
    payload: propertyOwnerRenter,
  }
}
