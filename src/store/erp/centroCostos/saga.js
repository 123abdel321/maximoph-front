import { call, put, takeEvery } from "redux-saga/effects";

// Login Redux States
import { GET_COSTS_CENTER } from "./actionTypes";
import { 
  getCostsCenterSuccessful
} from "./actions";


import {
  getAllCostsCenter
} from "../../../helpers/backend_helper";

function* getCostsCenter({ payload: { withButtons, cb } }) {
  try {
    let response = yield call(getAllCostsCenter);
    if(response.success){
      let dataCostsCenter = response.data;

      if(withButtons){
        dataCostsCenter.forEach((costCenter, position) => {
          costCenter.operaciones = withButtons(costCenter);

          dataCostsCenter[position] = costCenter;
        });
      }
      
      cb();

      yield put(getCostsCenterSuccessful(dataCostsCenter));
    }
  } catch (error) { console.log(error); }
}

function* costsCenterSaga() {
  yield takeEvery(GET_COSTS_CENTER, getCostsCenter);
}


export default costsCenterSaga;
