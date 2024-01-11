import {
  GET_CUSTOMERS,
  GET_CUSTOMERS_SUCCESSFUL,
  CREATE_CUSTOMER,
  CREATE_CUSTOMER_SUCCESSFUL,
  CREATE_CUSTOMER_FAILED,
  EDIT_CUSTOMER,
  EDIT_LOGO_CUSTOMER,
  EDIT_CUSTOMER_SUCCESSFUL,
  EDIT_CUSTOMER_FAILED,
  DELETE_CUSTOMER,
  DELETE_CUSTOMER_SUCCESSFUL,
  DELETE_CUSTOMER_FAILED,
} from "./actionTypes"

export const getCustomersM = (withButtons, cb) => ({
  type: GET_CUSTOMERS,
  payload: {withButtons, cb}
})

export const getCustomersSuccessful = (customers) => ({
  type: GET_CUSTOMERS_SUCCESSFUL,
  payload: { customers },
})

export const createCustomer = (customer, cb) => {
  return {
    type: CREATE_CUSTOMER,
    payload: { customer, cb }
  }
}

export const createCustomerSuccessful = customer => {
  return {
    type: CREATE_CUSTOMER_SUCCESSFUL,
    payload: customer,
  }
}

export const createCustomerFailed = customer => {
  return {
    type: CREATE_CUSTOMER_FAILED,
    payload: customer,
  }
}

export const editCustomer = (customer, cb) => {
  return {
    type: EDIT_CUSTOMER,
    payload: { customer, cb }
  }
}

export const editLogoCustomer = (customer, cb) => {
  return {
    type: EDIT_LOGO_CUSTOMER,
    payload: { customer, cb }
  }
}

export const editCustomerSuccessful = customer => {
  return {
    type: EDIT_CUSTOMER_SUCCESSFUL,
    payload: customer,
  }
}

export const editCustomerFailed = customer => {
  return {
    type: EDIT_CUSTOMER_FAILED,
    payload: customer,
  }
}

export const deleteCustomerM = (customer, cb) => {
  return {
    type: DELETE_CUSTOMER,
    payload: { customer, cb }
  }
}

export const deleteCustomerSuccessful = customer => {
  return {
    type: DELETE_CUSTOMER_SUCCESSFUL,
    payload: customer,
  }
}

export const deleteCustomerFailed = customer => {
  return {
    type: DELETE_CUSTOMER_FAILED,
    payload: customer,
  }
}
