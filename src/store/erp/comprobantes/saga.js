import { call, put, takeEvery } from "redux-saga/effects";

// Login Redux States
import { GET_VOUCHERS } from "./actionTypes";
import { 
  getVouchersSuccessful
} from "./actions";


import {
  getAllVouchers
} from "../../../helpers/backend_helper";

function* getVouchers({ payload: { withButtons, cb } }) {
  try {
    let response = yield call(getAllVouchers);
    if(response.success){
      let dataVouchers = response.data;

      if(withButtons){
        dataVouchers.forEach((voucher, position) => {
          voucher.operaciones = withButtons(voucher);

          dataVouchers[position] = voucher;
        });
      }
      
      cb();

      yield put(getVouchersSuccessful(dataVouchers));
    }
  } catch (error) { console.log(error); }
}

function* vouchersSaga() {
  yield takeEvery(GET_VOUCHERS, getVouchers);
}


export default vouchersSaga;
