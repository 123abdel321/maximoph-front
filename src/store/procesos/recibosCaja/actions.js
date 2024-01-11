import {
  GET_BILL_CASH_RECEIPTS,
  GET_BILL_CASH_RECEIPT_PDF,
  GET_PEACE_AND_SAFETY_PDF,
  GET_BILL_CASH_RECEIPTS_SUCCESSFUL,
  GET_BILL_CASH_EXTRACT_RECEIPTS,
  CREATE_BILL_CASH_RECEIPT,
  CREATE_BILL_CASH_RECEIPT_ANTICIPOS,
  CREATE_BILL_CASH_RECEIPT_SUCCESSFUL,
  CREATE_BILL_CASH_RECEIPT_FAILED,
  EDIT_BILL_CASH_RECEIPT,
  EDIT_BILL_CASH_RECEIPT_SUCCESSFUL,
  EDIT_BILL_CASH_RECEIPT_FAILED,
  DELETE_BILL_CASH_RECEIPT,
  DELETE_BILL_CASH_RECEIPT_SUCCESSFUL,
  DELETE_BILL_CASH_RECEIPT_FAILED,
  GET_BILL_CASH_VOUCHERS,
  GET_BILL_CASH_OWN_VOUCHERS,
  CREATE_BILL_CASH_VOUCHER,
  EDIT_BILL_CASH_VOUCHER
} from "./actionTypes"

export const getBillCashVouchers = (cb) => ({
  type: GET_BILL_CASH_VOUCHERS,
  payload: {cb}
})

export const getBillCashOwnVouchers = (cb) => ({
  type: GET_BILL_CASH_OWN_VOUCHERS,
  payload: {cb}
})

export const getBillCashReceipts = (withButtons, cb) => ({
  type: GET_BILL_CASH_RECEIPTS,
  payload: {withButtons, cb}
})

export const getBillCashReceiptPDF = (withButtons, cb, idBillCashReceipt) => ({
  type: GET_BILL_CASH_RECEIPT_PDF,
  payload: {withButtons, cb, idBillCashReceipt}
})

export const getPeaceAndSafetyPDF = (persona, cb) => ({
  type: GET_PEACE_AND_SAFETY_PDF,
  payload: {persona, cb}
})

export const getExtractTerceroBillCashReceipts = (tercero, cb) => ({
  type: GET_BILL_CASH_EXTRACT_RECEIPTS,
  payload: {tercero, cb}
})

export const getBillCashReceiptsSuccessful = (billCashReceipt, spentNextNumber, controlFechaDigitacion) => ({
  type: GET_BILL_CASH_RECEIPTS_SUCCESSFUL,
  payload: { billCashReceipt, spentNextNumber, controlFechaDigitacion },
})

export const createBillCashVoucher = (voucher, cb) => {
  return {
    type: CREATE_BILL_CASH_VOUCHER,
    payload: { voucher, cb }
  }
}

export const createBillCashReceiptAnticipos = (historyBills, cb) => {
  return {
    type: CREATE_BILL_CASH_RECEIPT_ANTICIPOS,
    payload: { historyBills, cb }
  }
}

export const createBillCashReceipt = (billCashReceipt, cb) => {
  return {
    type: CREATE_BILL_CASH_RECEIPT,
    payload: { billCashReceipt, cb }
  }
}

export const createBillCashReceiptSuccessful = billCashReceipt => {
  return {
    type: CREATE_BILL_CASH_RECEIPT_SUCCESSFUL,
    payload: billCashReceipt,
  }
}

export const createBillCashReceiptFailed = billCashReceipt => {
  return {
    type: CREATE_BILL_CASH_RECEIPT_FAILED,
    payload: billCashReceipt,
  }
}

export const editBillCashVoucher = (voucher, cb) => {
  return {
    type: EDIT_BILL_CASH_VOUCHER,
    payload: { voucher, cb }
  }
}

export const editBillCashReceipt = (billCashReceipt, cb) => {
  return {
    type: EDIT_BILL_CASH_RECEIPT,
    payload: { billCashReceipt, cb }
  }
}

export const editBillCashReceiptSuccessful = billCashReceipt => {
  return {
    type: EDIT_BILL_CASH_RECEIPT_SUCCESSFUL,
    payload: billCashReceipt,
  }
}

export const editBillCashReceiptFailed = billCashReceipt => {
  return {
    type: EDIT_BILL_CASH_RECEIPT_FAILED,
    payload: billCashReceipt,
  }
}

export const deleteBillCashReceipt = (billCashReceipt, cb) => {
  return {
    type: DELETE_BILL_CASH_RECEIPT,
    payload: { billCashReceipt, cb }
  }
}

export const deleteBillCashReceiptSuccessful = billCashReceipt => {
  return {
    type: DELETE_BILL_CASH_RECEIPT_SUCCESSFUL,
    payload: billCashReceipt,
  }
}

export const deleteBillCashReceiptFailed = billCashReceipt => {
  return {
    type: DELETE_BILL_CASH_RECEIPT_FAILED,
    payload: billCashReceipt,
  }
}
