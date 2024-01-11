import {
  GET_BILLS,
  GET_BILLS_DETAILS,
  GET_BILL_PDF,
  GET_BILLS_PDF,
  SEND_BILL_PDF,
  GET_BILLS_SUCCESSFUL,
  DELETE_BILL,
  DELETE_BILL_SUCCESSFUL,
  DELETE_BILL_FAILED,
  DELETE_BILLS,
  DELETE_BILLS_SUCCESSFUL,
  DELETE_BILLS_FAILED,
} from "./actionTypes"

export const getBills = (withButtons, cb, idHistory, idPerson) => ({
  type: GET_BILLS,
  payload: {withButtons, cb, idHistory, idPerson}
})

export const getBillsDetails = (withButtons, cb, idHistory, idPerson) => ({
  type: GET_BILLS_DETAILS,
  payload: {withButtons, cb, idHistory, idPerson}
})

export const getBillPDF = (withButtons, cb, idBill) => ({
  type: GET_BILL_PDF,
  payload: {withButtons, cb, idBill}
})

export const getBillsPDF = (withButtons, cb, idPeriodo, fisico) => ({
  type: GET_BILLS_PDF,
  payload: {withButtons, cb, idPeriodo, fisico}
})

export const sendBillPDF = (withButtons, cb, idBill) => ({
  type: SEND_BILL_PDF,
  payload: {withButtons, cb, idBill}
})

export const getBillsSuccessful = (bills, spentNextNumber, controlFechaDigitacion) => ({
  type: GET_BILLS_SUCCESSFUL,
  payload: { bills, spentNextNumber, controlFechaDigitacion },
})

export const deleteBill = (bill, cb) => {
  return {
    type: DELETE_BILL,
    payload: { bill, cb }
  }
}

export const deleteBillSuccessful = bill => {
  return {
    type: DELETE_BILL_SUCCESSFUL,
    payload: bill,
  }
}

export const deleteBillFailed = bill => {
  return {
    type: DELETE_BILL_FAILED,
    payload: bill,
  }
}

export const deleteBills = (bill, cb) => {
  return {
    type: DELETE_BILLS,
    payload: { bill, cb }
  }
}

export const deleteBillsSuccessful = bill => {
  return {
    type: DELETE_BILLS_SUCCESSFUL,
    payload: bill,
  }
}

export const deleteBillsFailed = bill => {
  return {
    type: DELETE_BILLS_FAILED,
    payload: bill,
  }
}
