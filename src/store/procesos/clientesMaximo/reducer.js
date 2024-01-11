import {
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
} from "./actionTypes"

const initialState = {
  editCustomerError: null,
  deleteCustomerError: null,
  createCustomerError: null,
  customers: [],
  message: null,
  loading: true,
  loadingGrid: true
}

const customer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CUSTOMERS_SUCCESSFUL:
      state = {
        ...state,
        loadingGrid: false,
        createCustomerError: null,
        customers: action.payload.customers
      }
      break
    case CREATE_CUSTOMER:
      state = {
        ...state,
        loading: true,
        createCustomerError: null,
      }
      break
    case CREATE_CUSTOMER_SUCCESSFUL:
      state = {
        ...state,
        loading: false,
        createCustomerError: null,
      }
      break
    case CREATE_CUSTOMER_FAILED:
      state = {
        ...state,
        loading: false,
        createCustomerError: action.payload,
      }
      break
    case EDIT_CUSTOMER:
        state = {
          ...state,
          loading: true,
          editCustomerError: null,
        }
        break
    case EDIT_LOGO_CUSTOMER:
        state = {
          ...state,
          loading: true,
          editCustomerError: null,
        }
        break
    case EDIT_CUSTOMER_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          editCustomerError: null,
        }
        break
    case DELETE_CUSTOMER:
        state = {
          ...state,
          loading: true,
          deleteCustomerError: null,
        }
        break
    case DELETE_CUSTOMER_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          deleteCustomerError: null,
        }
        break
    default:
      state = { ...state }
      break
  }
  return state
}

export default customer
