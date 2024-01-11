import { 
  GET_BILLS_SUCCESSFUL,
  DELETE_BILL,
  DELETE_BILL_SUCCESSFUL,
  DELETE_BILLS,
  DELETE_BILLS_SUCCESSFUL 
} from "./actionTypes"

const initialState = {
  bills: [],
  message: null,
  loading: true,
  loadingGrid: true,
  deleteBillError: null,
  deleteBillsError: null
}

const bill = (state = initialState, action) => {
  switch (action.type) {
    case GET_BILLS_SUCCESSFUL:
      state = {
        ...state,
        loadingGrid: false,
        bills: action.payload.bills
      }
    break
    case DELETE_BILL:
        state = {
          ...state,
          loading: true,
          deleteBillError: null,
        }
    break
    case DELETE_BILL_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          deleteBillError: null,
        }
    break
    case DELETE_BILLS:
        state = {
          ...state,
          loading: true,
          deleteBillsError: null,
        }
    break
    case DELETE_BILLS_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          deleteBillsError: null,
        }
    break
    default:
      state = { ...state }
      break
  }
  return state
}

export default bill
