import {
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
} from "./actionTypes"

const initialState = {
  editCyclicalBillError: null,
  deleteCyclicalBillError: null,
  createCyclicalBillError: null,
  cyclicalBills: [],
  message: null,
  loading: true,
  loadingGrid: true
}

const cyclicalBills = (state = initialState, action) => {
  switch (action.type) {
    case GET_CYCLICAL_BILLS_SUCCESSFUL:
      state = {
        ...state,
        loadingGrid: false,
        createCyclicalBillError: null,
        cyclicalBills: action.payload,
      }
      break
    case CREATE_CYCLICAL_BILL:
      state = {
        ...state,
        loading: true,
        createCyclicalBillError: null,
      }
      break
    case CREATE_CYCLICAL_BILL_MASSIVE:
      state = {
        ...state,
        loading: true,
        createCyclicalBillError: null,
      }
      break
    case CREATE_CYCLICAL_BILL_SUCCESSFUL:
      state = {
        ...state,
        loading: false,
        createCyclicalBillError: null,
      }
      break
    case CREATE_CYCLICAL_BILL_FAILED:
      state = {
        ...state,
        loading: false,
        createCyclicalBillError: action.payload,
      }
      break
      
    case PROCESS_CYCLICAL_BILL:
      state = {
        ...state,
        loading: true,
        processCyclicalBillError: null,
      }
      break
    case PROCESS_CYCLICAL_BILL_SUCCESSFUL:
      state = {
        ...state,
        loading: false,
        processCyclicalBillError: null,
      }
      break
    case PROCESS_CYCLICAL_BILL_FAILED:
      state = {
        ...state,
        loading: false,
        processCyclicalBillError: action.payload,
      }
      break

    case EDIT_CYCLICAL_BILL:
        state = {
          ...state,
          loading: true,
          editCyclicalBillError: null,
        }
        break
    case EDIT_CYCLICAL_BILL_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          editCyclicalBillError: null,
        }
        break
    case DELETE_CYCLICAL_BILL:
        state = {
          ...state,
          loading: true,
          deleteCyclicalBillError: null,
        }
        break
    case DELETE_CYCLICAL_BILL_MASSIVE:
        state = {
          ...state,
          loading: true,
          deleteCyclicalBillError: null,
        }
        break
    case DELETE_CYCLICAL_BILL_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          deleteCyclicalBillError: null,
        }
        break
    default:
      state = { ...state }
      break
  }
  return state
}

export default cyclicalBills
