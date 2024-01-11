import {
  GET_PROVIDER_TYPES,
  GET_PROVIDER_TYPES_SUCCESSFUL,
  CREATE_PROVIDER_TYPE,
  CREATE_PROVIDER_TYPE_SUCCESSFUL,
  CREATE_PROVIDER_TYPE_FAILED,
  EDIT_PROVIDER_TYPE,
  EDIT_PROVIDER_TYPE_SUCCESSFUL,
  EDIT_PROVIDER_TYPE_FAILED,
  DELETE_PROVIDER_TYPE,
  DELETE_PROVIDER_TYPE_SUCCESSFUL,
  DELETE_PROVIDER_TYPE_FAILED,
} from "./actionTypes"

export const getProviderTypes = (withButtons, cb) => ({
  type: GET_PROVIDER_TYPES,
  payload: {withButtons, cb}
})

export const getProviderTypesSuccessful = providerTypes => ({
  type: GET_PROVIDER_TYPES_SUCCESSFUL,
  payload: providerTypes,
})

export const createProviderType = (providerType, cb) => {
  return {
    type: CREATE_PROVIDER_TYPE,
    payload: { providerType, cb }
  }
}

export const createProviderTypeSuccessful = providerType => {
  return {
    type: CREATE_PROVIDER_TYPE_SUCCESSFUL,
    payload: providerType,
  }
}

export const createProviderTypeFailed = providerType => {
  return {
    type: CREATE_PROVIDER_TYPE_FAILED,
    payload: providerType,
  }
}

export const editProviderType = (providerType, cb) => {
  return {
    type: EDIT_PROVIDER_TYPE,
    payload: { providerType, cb }
  }
}

export const editProviderTypeSuccessful = providerType => {
  return {
    type: EDIT_PROVIDER_TYPE_SUCCESSFUL,
    payload: providerType,
  }
}

export const editProviderTypeFailed = providerType => {
  return {
    type: EDIT_PROVIDER_TYPE_FAILED,
    payload: providerType,
  }
}

export const deleteProviderType = (providerType, cb) => {
  return {
    type: DELETE_PROVIDER_TYPE,
    payload: { providerType, cb }
  }
}

export const deleteProviderTypeSuccessful = providerType => {
  return {
    type: DELETE_PROVIDER_TYPE_SUCCESSFUL,
    payload: providerType,
  }
}

export const deleteProviderTypeFailed = providerType => {
  return {
    type: DELETE_PROVIDER_TYPE_FAILED,
    payload: providerType,
  }
}
