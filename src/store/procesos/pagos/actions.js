import {
  GET_PAYMENTS,
  GET_PAYMENTS_ACUMULATE,
  GET_PAYMENT_PDF,
  GET_PAYMENTS_SUCCESSFUL,
  GET_PAYMENT_EXTRACT,
  CREATE_PAYMENT,
  CREATE_PAYMENT_SUCCESSFUL,
  CREATE_PAYMENT_FAILED,
  EDIT_PAYMENT,
  EDIT_PAYMENT_SUCCESSFUL,
  EDIT_PAYMENT_FAILED,
  DELETE_PAYMENT,
  DELETE_PAYMENT_SUCCESSFUL,
  DELETE_PAYMENT_FAILED,
} from "./actionTypes"

export const getPayments = (withButtons, cb) => ({
  type: GET_PAYMENTS,
  payload: {withButtons, cb}
})

export const getPaymentsAcumulate = (cb) => ({
  type: GET_PAYMENTS_ACUMULATE,
  payload: {cb}
})

export const getPaymentPDF = (withButtons, cb, idPayment) => ({
  type: GET_PAYMENT_PDF,
  payload: {withButtons, cb, idPayment}
})

export const getExtractTerceroPayments = (tercero, cb) => ({
  type: GET_PAYMENT_EXTRACT,
  payload: {tercero, cb}
})

export const getPaymentsSuccessful = (payment, spentNextNumber, controlFechaDigitacion) => ({
  type: GET_PAYMENTS_SUCCESSFUL,
  payload: { payment, spentNextNumber, controlFechaDigitacion },
})

export const createPayment = (payment, cb) => {
  return {
    type: CREATE_PAYMENT,
    payload: { payment, cb }
  }
}

export const createPaymentSuccessful = payment => {
  return {
    type: CREATE_PAYMENT_SUCCESSFUL,
    payload: payment,
  }
}

export const createPaymentFailed = payment => {
  return {
    type: CREATE_PAYMENT_FAILED,
    payload: payment,
  }
}

export const editPayment = (payment, cb) => {
  return {
    type: EDIT_PAYMENT,
    payload: { payment, cb }
  }
}

export const editPaymentSuccessful = payment => {
  return {
    type: EDIT_PAYMENT_SUCCESSFUL,
    payload: payment,
  }
}

export const editPaymentFailed = payment => {
  return {
    type: EDIT_PAYMENT_FAILED,
    payload: payment,
  }
}

export const deletePayment = (payment, cb) => {
  return {
    type: DELETE_PAYMENT,
    payload: { payment, cb }
  }
}

export const deletePaymentSuccessful = payment => {
  return {
    type: DELETE_PAYMENT_SUCCESSFUL,
    payload: payment,
  }
}

export const deletePaymentFailed = payment => {
  return {
    type: DELETE_PAYMENT_FAILED,
    payload: payment,
  }
}
