import { call, put, takeEvery } from "redux-saga/effects";

// Login Redux States
import { CREATE_PQRSF, GET_PQRSF, GET_SENT_PQRSF } from "./actionTypes";
import { 
  createPqrsfFailed, 
  getPqrsfSuccessful,
  getSentPqrsfSuccessful,
  createPqrsfSuccessful
} from "./actions";


import {
  getAllPqrsf,
  getAllOwnPqrsf,
  postCreatePqrsf,
} from "../../../helpers/backend_helper";

function* getSentPqrsf({ payload: { withButtons, cb } }) {
  try {
    let response = yield call(getAllOwnPqrsf);
    if(response.success){
      let dataSentPqrsf = response.data;
      
      cb(response);

      yield put(getSentPqrsfSuccessful(dataSentPqrsf));
    }
  } catch (error) { console.log(error); }
}

function* getPqrsf({ payload: { withButtons, cb } }) {
  try {
    let response = yield call(getAllPqrsf);
    if(response.success){
      let dataPqrsf = response.data;
      
      cb(response);

      yield put(getPqrsfSuccessful(dataPqrsf));
    }
  } catch (error) { console.log(error); }
}

function* createPqrsf({ payload: { pqrsf, cb } }) {
  try {
    let response = yield call(postCreatePqrsf, pqrsf);
        
    cb(response);

    yield put(createPqrsfSuccessful(response.data.pqrsf));
    
  } catch (error) {
    cb({success: false});
    yield put(createPqrsfFailed(error));
  }
}

function* pqrsfSaga() {
  yield takeEvery(GET_SENT_PQRSF, getSentPqrsf);
  yield takeEvery(GET_PQRSF, getPqrsf);
  yield takeEvery(CREATE_PQRSF, createPqrsf);
}


export default pqrsfSaga;
