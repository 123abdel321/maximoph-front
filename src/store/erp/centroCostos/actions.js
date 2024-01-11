import {
  GET_COSTS_CENTER,
  GET_COSTS_CENTER_SUCCESSFUL
} from "./actionTypes"

export const getCostsCenter = (withButtons, cb) => ({
  type: GET_COSTS_CENTER,
  payload: {withButtons, cb}
})

export const getCostsCenterSuccessful = costsCenter => ({
  type: GET_COSTS_CENTER_SUCCESSFUL,
  payload: costsCenter,
})