import {
  GET_CYCLICAL_BILLS,
  GET_CYCLICAL_BILLS_SUCCESSFUL,
  CREATE_CYCLICAL_BILL,
  CREATE_CYCLICAL_BILL_MASSIVE,
  CREATE_CYCLICAL_BILL_SUCCESSFUL,
  CREATE_CYCLICAL_BILL_FAILED,
  
  PROCESS_CYCLICAL_BILL,
  PROCESS_CYCLICAL_BILL_SUCCESSFUL,
  PROCESS_CYCLICAL_BILL_FAILED,
  
  EDIT_CYCLICAL_BILL,
  EDIT_CYCLICAL_BILL_SUCCESSFUL,
  EDIT_CYCLICAL_BILL_FAILED,
  DELETE_CYCLICAL_BILL,
  DELETE_CYCLICAL_BILL_MASSIVE,
  DELETE_CYCLICAL_BILL_SUCCESSFUL,
  DELETE_CYCLICAL_BILL_FAILED,
} from "./actionTypes"

export const getCyclicalBills = (withButtons, cb, date) => ({
  type: GET_CYCLICAL_BILLS,
  payload: {withButtons, cb, date}
})

export const getCyclicalBillsSuccessful = cyclicalBills => ({
  type: GET_CYCLICAL_BILLS_SUCCESSFUL,
  payload: cyclicalBills,
})

export const createCyclicalBill = (cyclicalBill, cb) => {
  return {
    type: CREATE_CYCLICAL_BILL,
    payload: { cyclicalBill, cb }
  }
}

export const createCyclicalBillMassive = (cyclicalBill, cb) => {
  return {
    type: CREATE_CYCLICAL_BILL_MASSIVE,
    payload: { cyclicalBill, cb }
  }
}

export const deleteCyclicalBillMassive = (cyclicalBill, cb) => {
  return {
    type: DELETE_CYCLICAL_BILL_MASSIVE,
    payload: { cyclicalBill, cb }
  }
}

export const createCyclicalBillSuccessful = cyclicalBill => {
  return {
    type: CREATE_CYCLICAL_BILL_SUCCESSFUL,
    payload: cyclicalBill,
  }
}

export const createCyclicalBillFailed = cyclicalBill => {
  return {
    type: CREATE_CYCLICAL_BILL_FAILED,
    payload: cyclicalBill,
  }
}

export const processCyclicalBill = (cyclicalBill, cb) => {
  return {
    type: PROCESS_CYCLICAL_BILL,
    payload: { cyclicalBill, cb }
  }
}

export const processCyclicalBillSuccessful = cyclicalBill => {
  return {
    type: PROCESS_CYCLICAL_BILL_SUCCESSFUL,
    payload: cyclicalBill,
  }
}

export const processCyclicalBillFailed = cyclicalBill => {
  return {
    type: PROCESS_CYCLICAL_BILL_FAILED,
    payload: cyclicalBill,
  }
}

export const editCyclicalBill = (cyclicalBill, cb) => {
  return {
    type: EDIT_CYCLICAL_BILL,
    payload: { cyclicalBill, cb }
  }
}

export const editCyclicalBillSuccessful = cyclicalBill => {
  return {
    type: EDIT_CYCLICAL_BILL_SUCCESSFUL,
    payload: cyclicalBill,
  }
}

export const editCyclicalBillFailed = cyclicalBill => {
  return {
    type: EDIT_CYCLICAL_BILL_FAILED,
    payload: cyclicalBill,
  }
}

export const deleteCyclicalBill = (cyclicalBill, cb) => {
  return {
    type: DELETE_CYCLICAL_BILL,
    payload: { cyclicalBill, cb }
  }
}

export const deleteCyclicalBillSuccessful = cyclicalBill => {
  return {
    type: DELETE_CYCLICAL_BILL_SUCCESSFUL,
    payload: cyclicalBill,
  }
}

export const deleteCyclicalBillFailed = cyclicalBill => {
  return {
    type: DELETE_CYCLICAL_BILL_FAILED,
    payload: cyclicalBill,
  }
}
