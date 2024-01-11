import { call, put, takeEvery } from "redux-saga/effects";

// Login Redux States
import { GET_ACCOUNTS } from "./actionTypes";
import { 
  getAccountsSuccessful
} from "./actions";


import {
  getAllAccounts
} from "../../../helpers/backend_helper";

function* getAccounts({ payload: { withButtons, cb } }) {
  try {
    let response = yield call(getAllAccounts);
    if(response.success){
      let dataAccounts = response.data;

      if(withButtons){
        dataAccounts.forEach((account, position) => {
          account.operaciones = withButtons(account);

          dataAccounts[position] = account;
        });
      }
      
      cb();

      yield put(getAccountsSuccessful(dataAccounts));
    }
  } catch (error) { console.log(error); }
}

function* accountsSaga() {
  yield takeEvery(GET_ACCOUNTS, getAccounts);
}


export default accountsSaga;
