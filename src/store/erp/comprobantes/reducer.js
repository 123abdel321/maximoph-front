import {
  GET_VOUCHERS_SUCCESSFUL
} from "./actionTypes"

const initialState = {
  vouchers: [],
  message: null,
  loading: true,
  loadingGrid: true
}

const voucher = (state = initialState, action) => {
  switch (action.type) {
    case GET_VOUCHERS_SUCCESSFUL:
      state = {
        ...state,
        loadingGrid: false,
        vouchers: action.payload,
      }
      break
    default:
      state = { ...state }
      break
  }
  return state
}

export default voucher
