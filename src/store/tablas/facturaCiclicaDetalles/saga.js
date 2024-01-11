import { call, put, takeEvery } from "redux-saga/effects";

// Login Redux States
import { CREATE_CYCLICAL_BILL_DETAIL, EDIT_CYCLICAL_BILL_DETAIL, DELETE_CYCLICAL_BILL_DETAIL, GET_CYCLICAL_BILL_DETAILS } from "./actionTypes";
import { 
  createCyclicalBillDetailFailed, 
  getCyclicalBillDetailsSuccessful,
  createCyclicalBillDetailSuccessful, 
  editCyclicalBillDetailFailed, 
  editCyclicalBillDetailSuccessful, 
  deleteCyclicalBillDetailFailed, 
  deleteCyclicalBillDetailSuccessful
} from "./actions";


import {
  getAllCyclicalBillDetails,
  postCreateCyclicalBillDetail,
  putEditCyclicalBillDetail,
  deleteDeleteCyclicalBillDetail,
} from "../../../helpers/backend_helper";

function* getCyclicalBillDetails({ payload: { withButtons, cb, editFacturaCiclicaId } }) {
  try {

    let response = yield call(getAllCyclicalBillDetails, { editFacturaCiclicaId });

    if(response.success){
      let dataCyclicalBillDetails = response.data;

      if(withButtons){
        dataCyclicalBillDetails.forEach((cyclicalBill, position) => {
          cyclicalBill.operaciones = withButtons(cyclicalBill);

          dataCyclicalBillDetails[position] = cyclicalBill;
        });
      }
      
      cb();

      yield put(getCyclicalBillDetailsSuccessful(dataCyclicalBillDetails));
    }
  } catch (error) { console.log(error); }
}

function* createCyclicalBillDetail({ payload: { cyclicalBillDetail, cb } }) {
  try {
    let response = yield call(postCreateCyclicalBillDetail, cyclicalBillDetail);
        
    cb(response);

    if(response.success){
      yield put(createCyclicalBillDetailSuccessful(response.data.cyclicalBillDetail));
    }else{
      yield put(createCyclicalBillDetailFailed("La factura ciclica detalle con ese inmueble ya existe"));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(createCyclicalBillDetailFailed(error));
  }
}

function* editCyclicalBillDetail({ payload: { cyclicalBillDetail, cb } }) {
  try {
    let response = yield call(putEditCyclicalBillDetail, cyclicalBillDetail);
    
    cb(response);
    
    if(response.success){
      yield put(editCyclicalBillDetailSuccessful(response.data.cyclicalBillDetail));
    }else{
      yield put(editCyclicalBillDetailFailed("La factura ciclica detalle con ese inmueble ya existe"));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(editCyclicalBillDetailFailed(error));
  }
}

function* deleteCyclicalBillDetail({ payload: { cyclicalBillDetail, cb } }) {
  try {
    let response = yield call(deleteDeleteCyclicalBillDetail, cyclicalBillDetail);
    
    
    if(response.success){
      cb();
      yield put(deleteCyclicalBillDetailSuccessful(response.data.cyclicalBillDetail));
    }else{
      yield put(deleteCyclicalBillDetailFailed("La factura ciclica detalle con ese inmueble ya existe"));
    }
    
  } catch (error) {
    yield put(deleteCyclicalBillDetailFailed(error));
  }
}

function* cyclicalBillDetailsSaga() {
  yield takeEvery(GET_CYCLICAL_BILL_DETAILS, getCyclicalBillDetails);
  yield takeEvery(CREATE_CYCLICAL_BILL_DETAIL, createCyclicalBillDetail);
  yield takeEvery(EDIT_CYCLICAL_BILL_DETAIL, editCyclicalBillDetail);
  yield takeEvery(DELETE_CYCLICAL_BILL_DETAIL, deleteCyclicalBillDetail);
}


export default cyclicalBillDetailsSaga;
