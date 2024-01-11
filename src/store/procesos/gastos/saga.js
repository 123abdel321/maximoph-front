import { call, put, takeEvery } from "redux-saga/effects";

// Login Redux States
import { CREATE_SPENT, EDIT_SPENT, GET_SPENT_PDF, DELETE_SPENT, GET_SPENTS } from "./actionTypes";
import { 
  createSpentFailed, 
  getSpentsSuccessful,
  createSpentSuccessful, 
  editSpentFailed, 
  editSpentSuccessful, 
  deleteSpentFailed, 
  deleteSpentSuccessful
} from "./actions";


import {
  getAllSpents,
  postCreateSpent,
  putEditSpent,
  getSpentPDFAPI,
  deleteDeleteSpent,
} from "../../../helpers/backend_helper";

function* getSpentPDF({ payload: { withButtons, cb, idSpent } }) {
  try {
    let response = yield call(getSpentPDFAPI, {idSpent});
    
    const url = URL.createObjectURL(response);

    cb(url);

  } catch (error) { console.log(error); }
}

function* getSpents({ payload: { withButtons, cb } }) {
  try {
    let response = yield call(getAllSpents);
    if(response.success){
      let dataSpents = response.data;

      if(withButtons){
        dataSpents.forEach((spent, position) => {
          spent.operaciones = withButtons(spent);

          dataSpents[position] = spent;
        });
      }
      
      cb(response);

      yield put(getSpentsSuccessful(dataSpents, response.spentNextNumber, response.controlFechaDigitacion));
    }
  } catch (error) { console.log(error); }
}

function* createSpent({ payload: { spent, cb } }) {
  try {
    let response = yield call(postCreateSpent, spent);
        
    cb(response);

    if(response.success){
      yield put(createSpentSuccessful(response.data.spent));
    }else{
      yield put(createSpentFailed("El gasto con ese consecutivo ya existe"));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(createSpentFailed(error));
  }
}

function* editSpent({ payload: { spent, cb } }) {
  try {
    let response = yield call(putEditSpent, spent);
    
    cb(response);
    
    if(response.success){
      yield put(editSpentSuccessful(response.data.spent));
    }else{
      yield put(editSpentFailed("El gasto con ese consecutivo ya existe"));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(editSpentFailed(error));
  }
}

function* deleteSpent({ payload: { spent, cb } }) {
  try {
    let response = yield call(deleteDeleteSpent, spent);
    
    
    if(response.success){
      cb();
      yield put(deleteSpentSuccessful(response.data.spent));
    }else{
      yield put(deleteSpentFailed("El gasto con ese consecutivo ya existe"));
    }
    
  } catch (error) {
    yield put(deleteSpentFailed(error));
  }
}

function* spentssSaga() {
  yield takeEvery(GET_SPENTS, getSpents);
  yield takeEvery(GET_SPENT_PDF, getSpentPDF);
  yield takeEvery(CREATE_SPENT, createSpent);
  yield takeEvery(EDIT_SPENT, editSpent);
  yield takeEvery(DELETE_SPENT, deleteSpent);
}


export default spentssSaga;
