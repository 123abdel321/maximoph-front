import {
  GET_ACCOUNTS_SUCCESSFUL
} from "./actionTypes"

const initialState = {
  accounts: [],
  message: null,
  loading: true,
  loadingGrid: true
}

const account = (state = initialState, action) => {
  switch (action.type) {
    case GET_ACCOUNTS_SUCCESSFUL:
      state = {
        ...state,
        loadingGrid: false,
        accounts: action.payload,
      }
      break
    default:
      state = { ...state }
      break
  }
  return state
}

export default account
