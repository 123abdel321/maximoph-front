import {
  GET_CYCLICAL_BILL_DETAILS_SUCCESSFUL,
  CREATE_CYCLICAL_BILL_DETAIL,
  CREATE_CYCLICAL_BILL_DETAIL_SUCCESSFUL,
  CREATE_CYCLICAL_BILL_DETAIL_FAILED,
  EDIT_CYCLICAL_BILL_DETAIL,
  EDIT_CYCLICAL_BILL_DETAIL_SUCCESSFUL,
  EDIT_CYCLICAL_BILL_DETAIL_FAILED,
  DELETE_CYCLICAL_BILL_DETAIL,
  DELETE_CYCLICAL_BILL_DETAIL_SUCCESSFUL,
} from "./actionTypes"

const initialState = {
  editCyclicalBillDetailError: null,
  deleteCyclicalBillDetailError: null,
  createCyclicalBillDetailError: null,
  cyclicalBillDetails: [],
  message: null,
  loading: true,
  loadingGrid: true
}

const cyclicalBillDetails = (state = initialState, action) => {
  switch (action.type) {
    case GET_CYCLICAL_BILL_DETAILS_SUCCESSFUL:
      state = {
        ...state,
        loadingGrid: false,
        createCyclicalBillDetailError: null,
        cyclicalBillDetails: action.payload,
      }
      break
    case CREATE_CYCLICAL_BILL_DETAIL:
      state = {
        ...state,
        loading: true,
        createCyclicalBillDetailError: null,
      }
      break
    case CREATE_CYCLICAL_BILL_DETAIL_SUCCESSFUL:
      state = {
        ...state,
        loading: false,
        createCyclicalBillDetailError: null,
      }
      break
    case CREATE_CYCLICAL_BILL_DETAIL_FAILED:
      state = {
        ...state,
        loading: false,
        createCyclicalBillDetailError: action.payload,
      }
      break
    case EDIT_CYCLICAL_BILL_DETAIL:
        state = {
          ...state,
          loading: true,
          editCyclicalBillDetailError: null,
        }
        break
    case EDIT_CYCLICAL_BILL_DETAIL_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          editCyclicalBillDetailError: null,
        }
        break
    case DELETE_CYCLICAL_BILL_DETAIL:
        state = {
          ...state,
          loading: true,
          deleteCyclicalBillDetailError: null,
        }
        break
    case DELETE_CYCLICAL_BILL_DETAIL_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          deleteCyclicalBillDetailError: null,
        }
        break
    default:
      state = { ...state }
      break
  }
  return state
}

export default cyclicalBillDetails
