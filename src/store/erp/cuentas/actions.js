import {
  GET_ACCOUNTS,
  GET_ACCOUNTS_SUCCESSFUL
} from "./actionTypes"

export const getAccounts = (withButtons, cb) => ({
  type: GET_ACCOUNTS,
  payload: {withButtons, cb}
})

export const getAccountsSuccessful = accounts => ({
  type: GET_ACCOUNTS_SUCCESSFUL,
  payload: accounts,
})