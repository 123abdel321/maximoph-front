import {
  GET_PAYMENTS_SUCCESSFUL,
  CREATE_PAYMENT,
  CREATE_PAYMENT_SUCCESSFUL,
  CREATE_PAYMENT_FAILED,
  EDIT_PAYMENT,
  EDIT_PAYMENT_SUCCESSFUL,
  EDIT_PAYMENT_FAILED,
  DELETE_PAYMENT,
  DELETE_PAYMENT_SUCCESSFUL,
} from "./actionTypes"

const initialState = {
  editPaymentError: null,
  deletePaymentError: null,
  createPaymentError: null,
  payments: [],
  paymentNextNumber: '',
  message: null,
  loading: true,
  loadingGrid: true
}

const paymentReceipt = (state = initialState, action) => {
  switch (action.type) {
    case GET_PAYMENTS_SUCCESSFUL:
      state = {
        ...state,
        loadingGrid: false,
        createPaymentError: null,
        payments: action.payload.payments,
        paymentNextNumber: action.payload.paymentNextNumber
      }
      break
    case CREATE_PAYMENT:
      state = {
        ...state,
        loading: true,
        createPaymentError: null,
      }
      break
    case CREATE_PAYMENT_SUCCESSFUL:
      state = {
        ...state,
        loading: false,
        createPaymentError: null,
      }
      break
    case CREATE_PAYMENT_FAILED:
      state = {
        ...state,
        loading: false,
        createPaymentError: action.payload,
      }
      break
    case EDIT_PAYMENT:
        state = {
          ...state,
          loading: true,
          editPaymentError: null,
        }
        break
    case EDIT_PAYMENT_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          editPaymentError: null,
        }
        break
    case DELETE_PAYMENT:
        state = {
          ...state,
          loading: true,
          deletePaymentError: null,
        }
        break
    case DELETE_PAYMENT_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          deletePaymentError: null,
        }
        break
    default:
      state = { ...state }
      break
  }
  return state
}

export default paymentReceipt
