import {
  GET_CITIES,
  GET_CITIES_SUCCESSFUL
} from "./actionTypes"

export const getCities = (withButtons, cb) => ({
  type: GET_CITIES,
  payload: {withButtons, cb}
})

export const getCitiesSuccessful = cities => ({
  type: GET_CITIES_SUCCESSFUL,
  payload: cities,
})