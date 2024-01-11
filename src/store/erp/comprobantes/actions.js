import {
  GET_VOUCHERS,
  GET_VOUCHERS_SUCCESSFUL
} from "./actionTypes"

export const getVouchers = (withButtons, cb) => ({
  type: GET_VOUCHERS,
  payload: {withButtons, cb}
})

export const getVouchersSuccessful = vouchers => ({
  type: GET_VOUCHERS_SUCCESSFUL,
  payload: vouchers,
})