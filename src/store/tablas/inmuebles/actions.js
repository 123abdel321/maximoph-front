import {
  GET_PROPERTIES,
  GET_PROPERTIES_SUCCESSFUL,
  CREATE_PROPERTY,
  CREATE_PROPERTY_SUCCESSFUL,
  CREATE_PROPERTY_FAILED,
  EDIT_PROPERTY,
  EDIT_PROPERTY_SUCCESSFUL,
  EDIT_PROPERTY_FAILED,
  DELETE_PROPERTY,
  DELETE_PROPERTY_SUCCESSFUL,
  DELETE_PROPERTY_FAILED,
} from "./actionTypes"

export const getProperties = (withButtons, cb) => ({
  type: GET_PROPERTIES,
  payload: {withButtons, cb}
})

export const getPropertiesSuccessful = properties => ({
  type: GET_PROPERTIES_SUCCESSFUL,
  payload: properties,
})

export const createProperty = (property, cb) => {
  return {
    type: CREATE_PROPERTY,
    payload: { property, cb }
  }
}

export const createPropertySuccessful = property => {
  return {
    type: CREATE_PROPERTY_SUCCESSFUL,
    payload: property,
  }
}

export const createPropertyFailed = property => {
  return {
    type: CREATE_PROPERTY_FAILED,
    payload: property,
  }
}

export const editProperty = (property, cb) => {
  return {
    type: EDIT_PROPERTY,
    payload: { property, cb }
  }
}

export const editPropertySuccessful = property => {
  return {
    type: EDIT_PROPERTY_SUCCESSFUL,
    payload: property,
  }
}

export const editPropertyFailed = property => {
  return {
    type: EDIT_PROPERTY_FAILED,
    payload: property,
  }
}

export const deleteProperty = (property, cb) => {
  return {
    type: DELETE_PROPERTY,
    payload: { property, cb }
  }
}

export const deletePropertySuccessful = property => {
  return {
    type: DELETE_PROPERTY_SUCCESSFUL,
    payload: property,
  }
}

export const deletePropertyFailed = property => {
  return {
    type: DELETE_PROPERTY_FAILED,
    payload: property,
  }
}
