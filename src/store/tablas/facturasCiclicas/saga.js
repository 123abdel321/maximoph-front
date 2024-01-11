import { call, put, takeEvery } from "redux-saga/effects";

// Login Redux States
import { CREATE_CYCLICAL_BILL, CREATE_CYCLICAL_BILL_MASSIVE, PROCESS_CYCLICAL_BILL, EDIT_CYCLICAL_BILL, DELETE_CYCLICAL_BILL, DELETE_CYCLICAL_BILL_MASSIVE, GET_CYCLICAL_BILLS } from "./actionTypes";

import { 
  getCyclicalBillsSuccessful,
  createCyclicalBillFailed, 
  createCyclicalBillSuccessful, 
  
  processCyclicalBillFailed, 
  processCyclicalBillSuccessful, 
  
  editCyclicalBillFailed, 
  editCyclicalBillSuccessful, 
  deleteCyclicalBillFailed, 
  deleteCyclicalBillSuccessful
} from "./actions";


import {
  getAllCyclicalBills,
  postCreateCyclicalBill,
  postCreateCyclicalBillMassive,
  postProcessCyclicalBill,
  putEditCyclicalBill,
  deleteDeleteCyclicalBill,
  deleteDeleteCyclicalBillMassive
} from "../../../helpers/backend_helper";

function* getCyclicalBill({ payload: { withButtons, cb, date } }) {
  try {
    let response = yield call(getAllCyclicalBills, date);
    if(response.success){
      let dataCyclicalBills = response.data;

      if(withButtons){
        dataCyclicalBills.forEach((cyclicalBill, position) => {
          cyclicalBill.operaciones = withButtons(cyclicalBill);

          dataCyclicalBills[position] = cyclicalBill;
        });
      }
      
      cb(response);

      yield put(getCyclicalBillsSuccessful(dataCyclicalBills));
    }
  } catch (error) { console.log(error); }
}

function* createCyclicalBill({ payload: { cyclicalBill, cb } }) {
  try {
    let response = yield call(postCreateCyclicalBill, cyclicalBill);
        
    cb(response);

    if(response.success){
      yield put(createCyclicalBillSuccessful(response.data.cyclicalBill));
    }else{
      yield put(createCyclicalBillFailed("La factura ciclica con ese inmueble ya existe"));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(createCyclicalBillFailed(error));
  }
}

function* createCyclicalBillMassive({ payload: { cyclicalBill, cb } }) {
  try {
    let response = yield call(postCreateCyclicalBillMassive, cyclicalBill);
        
    cb(response);
    
  } catch (error) {
    cb({success: false});
  }
}

function* editCyclicalBill({ payload: { cyclicalBill, cb } }) {
  try {
    let response = yield call(putEditCyclicalBill, cyclicalBill);
    
    cb(response);
    
    if(response.success){
      yield put(editCyclicalBillSuccessful(response.data.cyclicalBill));
    }else{
      yield put(editCyclicalBillFailed("La factura ciclica con ese inmueble ya existe"));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(editCyclicalBillFailed(error));
  }
}

function* deleteCyclicalBill({ payload: { cyclicalBill, cb } }) {
  try {
    let response = yield call(deleteDeleteCyclicalBill, cyclicalBill);
    
    
    if(response.success){
      cb();
      yield put(deleteCyclicalBillSuccessful(response.data.cyclicalBill));
    }else{
      yield put(deleteCyclicalBillFailed("La factura ciclica con ese inmueble ya existe"));
    }
    
  } catch (error) {
    yield put(deleteCyclicalBillFailed(error));
  }
}

function* deleteCyclicalBillMassive({ payload: { cyclicalBill, cb } }) {
  try {
    let response = yield call(deleteDeleteCyclicalBillMassive, cyclicalBill);
        
    cb(response);
    
  } catch (error) {
    cb({success: false});
  }
}

function* processCyclicalBill({ payload: { cyclicalBill, cb } }) {
  try {
    let response = yield call(postProcessCyclicalBill, cyclicalBill);
        
    cb(response);

    if(response.success){
      yield put(processCyclicalBillSuccessful(response.data.cyclicalBill));
    }else{
      yield put(processCyclicalBillFailed("La factura ciclica con ese inmueble ya existe"));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(processCyclicalBillFailed(error));
  }
}

function* cyclicalBillsSaga() {
  yield takeEvery(GET_CYCLICAL_BILLS, getCyclicalBill);
  yield takeEvery(CREATE_CYCLICAL_BILL, createCyclicalBill);
  yield takeEvery(CREATE_CYCLICAL_BILL_MASSIVE, createCyclicalBillMassive);
  yield takeEvery(EDIT_CYCLICAL_BILL, editCyclicalBill);
  yield takeEvery(DELETE_CYCLICAL_BILL, deleteCyclicalBill);
  yield takeEvery(DELETE_CYCLICAL_BILL_MASSIVE, deleteCyclicalBillMassive);
  yield takeEvery(PROCESS_CYCLICAL_BILL, processCyclicalBill);
}


export default cyclicalBillsSaga;
