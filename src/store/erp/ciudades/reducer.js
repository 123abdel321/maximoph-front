import {
  GET_CITIES_SUCCESSFUL
} from "./actionTypes"

const initialState = {
  cities: [],
  message: null,
  loading: true,
  loadingGrid: true
}

const cities = (state = initialState, action) => {
  switch (action.type) {
    case GET_CITIES_SUCCESSFUL:
      state = {
        ...state,
        loadingGrid: false,
        cities: action.payload,
      }
      break
    default:
      state = { ...state }
      break
  }
  return state
}

export default cities
