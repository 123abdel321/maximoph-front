import {
  GET_BILL_CASH_RECEIPTS_SUCCESSFUL,
  CREATE_BILL_CASH_RECEIPT,
  CREATE_BILL_CASH_RECEIPT_SUCCESSFUL,
  CREATE_BILL_CASH_RECEIPT_FAILED,
  EDIT_BILL_CASH_RECEIPT,
  EDIT_BILL_CASH_RECEIPT_SUCCESSFUL,
  EDIT_BILL_CASH_RECEIPT_FAILED,
  DELETE_BILL_CASH_RECEIPT,
  DELETE_BILL_CASH_RECEIPT_SUCCESSFUL,
} from "./actionTypes"

const initialState = {
  editBillCashReceiptError: null,
  deleteBillCashReceiptError: null,
  createBillCashReceiptError: null,
  billCashReceipts: [],
  billCashReceiptNextNumber: '',
  controlFechaDigitacion: '',
  message: null,
  loading: true,
  loadingGrid: true
}

const billCashReceipt = (state = initialState, action) => {
  switch (action.type) {
    case GET_BILL_CASH_RECEIPTS_SUCCESSFUL:
      state = {
        ...state,
        loadingGrid: false,
        createBillCashReceiptError: null,
        billCashReceipts: action.payload.billCashReceipts,
        billCashReceiptNextNumber: action.payload.BillCashReceiptNextNumber,
        controlFechaDigitacion: action.payload.controlFechaDigitacion
      }
      break
    case CREATE_BILL_CASH_RECEIPT:
      state = {
        ...state,
        loading: true,
        createBillCashReceiptError: null,
      }
      break
    case CREATE_BILL_CASH_RECEIPT_SUCCESSFUL:
      state = {
        ...state,
        loading: false,
        createBillCashReceiptError: null,
      }
      break
    case CREATE_BILL_CASH_RECEIPT_FAILED:
      state = {
        ...state,
        loading: false,
        createBillCashReceiptError: action.payload,
      }
      break
    case EDIT_BILL_CASH_RECEIPT:
        state = {
          ...state,
          loading: true,
          editBillCashReceiptError: null,
        }
        break
    case EDIT_BILL_CASH_RECEIPT_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          editBillCashReceiptError: null,
        }
        break
    case DELETE_BILL_CASH_RECEIPT:
        state = {
          ...state,
          loading: true,
          deleteBillCashReceiptError: null,
        }
        break
    case DELETE_BILL_CASH_RECEIPT_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          deleteBillCashReceiptError: null,
        }
        break
    default:
      state = { ...state }
      break
  }
  return state
}

export default billCashReceipt
