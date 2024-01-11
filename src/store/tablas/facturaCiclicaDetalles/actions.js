import {
  GET_CYCLICAL_BILL_DETAILS,
  GET_CYCLICAL_BILL_DETAILS_SUCCESSFUL,
  CREATE_CYCLICAL_BILL_DETAIL,
  CREATE_CYCLICAL_BILL_DETAIL_SUCCESSFUL,
  CREATE_CYCLICAL_BILL_DETAIL_FAILED,
  EDIT_CYCLICAL_BILL_DETAIL,
  EDIT_CYCLICAL_BILL_DETAIL_SUCCESSFUL,
  EDIT_CYCLICAL_BILL_DETAIL_FAILED,
  DELETE_CYCLICAL_BILL_DETAIL,
  DELETE_CYCLICAL_BILL_DETAIL_SUCCESSFUL,
  DELETE_CYCLICAL_BILL_DETAIL_FAILED,
} from "./actionTypes"

export const getCyclicalBillDetails = (withButtons, cb, editFacturaCiclicaId) => ({
  type: GET_CYCLICAL_BILL_DETAILS,
  payload: {withButtons, cb, editFacturaCiclicaId}
})

export const getCyclicalBillDetailsSuccessful = cyclicalBillDetails => ({
  type: GET_CYCLICAL_BILL_DETAILS_SUCCESSFUL,
  payload: cyclicalBillDetails,
})

export const createCyclicalBillDetail = (cyclicalBillDetail, cb) => {
  return {
    type: CREATE_CYCLICAL_BILL_DETAIL,
    payload: { cyclicalBillDetail, cb }
  }
}

export const createCyclicalBillDetailSuccessful = cyclicalBillDetail => {
  return {
    type: CREATE_CYCLICAL_BILL_DETAIL_SUCCESSFUL,
    payload: cyclicalBillDetail,
  }
}

export const createCyclicalBillDetailFailed = cyclicalBillDetail => {
  return {
    type: CREATE_CYCLICAL_BILL_DETAIL_FAILED,
    payload: cyclicalBillDetail,
  }
}

export const editCyclicalBillDetail = (cyclicalBillDetail, cb) => {
  return {
    type: EDIT_CYCLICAL_BILL_DETAIL,
    payload: { cyclicalBillDetail, cb }
  }
}

export const editCyclicalBillDetailSuccessful = cyclicalBillDetail => {
  return {
    type: EDIT_CYCLICAL_BILL_DETAIL_SUCCESSFUL,
    payload: cyclicalBillDetail,
  }
}

export const editCyclicalBillDetailFailed = cyclicalBillDetail => {
  return {
    type: EDIT_CYCLICAL_BILL_DETAIL_FAILED,
    payload: cyclicalBillDetail,
  }
}

export const deleteCyclicalBillDetail = (cyclicalBillDetail, cb) => {
  return {
    type: DELETE_CYCLICAL_BILL_DETAIL,
    payload: { cyclicalBillDetail, cb }
  }
}

export const deleteCyclicalBillDetailSuccessful = cyclicalBillDetail => {
  return {
    type: DELETE_CYCLICAL_BILL_DETAIL_SUCCESSFUL,
    payload: cyclicalBillDetail,
  }
}

export const deleteCyclicalBillDetailFailed = cyclicalBillDetail => {
  return {
    type: DELETE_CYCLICAL_BILL_DETAIL_FAILED,
    payload: cyclicalBillDetail,
  }
}
