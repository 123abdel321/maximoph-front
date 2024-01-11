import {
  GET_COSTS_CENTER_SUCCESSFUL
} from "./actionTypes"

const initialState = {
  costsCenter: [],
  message: null,
  loading: true,
  loadingGrid: true
}

const costsCenter = (state = initialState, action) => {
  switch (action.type) {
    case GET_COSTS_CENTER_SUCCESSFUL:
      state = {
        ...state,
        loadingGrid: false,
        costsCenter: action.payload,
      }
      break
    default:
      state = { ...state }
      break
  }
  return state
}

export default costsCenter
