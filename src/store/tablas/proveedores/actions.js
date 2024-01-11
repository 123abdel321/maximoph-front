import {
  GET_PROVIDERS,
  GET_PROVIDERS_SUCCESSFUL,
  CREATE_PROVIDER,
  CREATE_PROVIDER_SUCCESSFUL,
  CREATE_PROVIDER_FAILED,
  EDIT_PROVIDER,
  EDIT_PROVIDER_SUCCESSFUL,
  EDIT_PROVIDER_FAILED,
  DELETE_PROVIDER,
  DELETE_PROVIDER_SUCCESSFUL,
  DELETE_PROVIDER_FAILED,
} from "./actionTypes"

export const getProviders = (withButtons, cb) => ({
  type: GET_PROVIDERS,
  payload: {withButtons, cb}
})

export const getProvidersSuccessful = providers => ({
  type: GET_PROVIDERS_SUCCESSFUL,
  payload: providers,
})

export const createProvider = (provider, cb) => {
  return {
    type: CREATE_PROVIDER,
    payload: { provider, cb }
  }
}

export const createProviderSuccessful = provider => {
  return {
    type: CREATE_PROVIDER_SUCCESSFUL,
    payload: provider,
  }
}

export const createProviderFailed = provider => {
  return {
    type: CREATE_PROVIDER_FAILED,
    payload: provider,
  }
}

export const editProvider = (provider, cb) => {
  return {
    type: EDIT_PROVIDER,
    payload: { provider, cb }
  }
}

export const editProviderSuccessful = provider => {
  return {
    type: EDIT_PROVIDER_SUCCESSFUL,
    payload: provider,
  }
}

export const editProviderFailed = provider => {
  return {
    type: EDIT_PROVIDER_FAILED,
    payload: provider,
  }
}

export const deleteProvider = (provider, cb) => {
  return {
    type: DELETE_PROVIDER,
    payload: { provider, cb }
  }
}

export const deleteProviderSuccessful = provider => {
  return {
    type: DELETE_PROVIDER_SUCCESSFUL,
    payload: provider,
  }
}

export const deleteProviderFailed = provider => {
  return {
    type: DELETE_PROVIDER_FAILED,
    payload: provider,
  }
}
