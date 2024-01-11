import { call, put, takeEvery } from "redux-saga/effects";

// Login Redux States
import { CREATE_PAYMENT, EDIT_PAYMENT, GET_PAYMENT_PDF, GET_PAYMENTS_ACUMULATE, DELETE_PAYMENT, GET_PAYMENTS, GET_PAYMENT_EXTRACT } from "./actionTypes";
import { 
  createPaymentFailed, 
  getPaymentsSuccessful,
  createPaymentSuccessful, 
  editPaymentFailed, 
  editPaymentSuccessful, 
  deletePaymentFailed, 
  deletePaymentSuccessful
} from "./actions";


import {
  getAllPayments,
  getAllPaymentsAcumulate,
  getPaymentsPDFAPI,
  getExtractPayments,
  postCreatePayments,
  putEditPayments,
  deleteDeletePayments,
} from "../../../helpers/backend_helper";

function* getPaymentPDF({ payload: { withButtons, cb, idPayment } }) {
  try {
    let response = yield call(getPaymentsPDFAPI, {idPayment});
    
    const url = URL.createObjectURL(response);

    cb(url);

  } catch (error) { console.log(error); }
}

function* getPayments({ payload: { withButtons, cb } }) {
  try {
    let response = yield call(getAllPayments);
    if(response.success){
      let dataPayments = response.data;

      if(withButtons){
        dataPayments.forEach((spent, position) => {
          spent.operaciones = withButtons(spent);

          dataPayments[position] = spent;
        });
      }
      
      cb(response);

      yield put(getPaymentsSuccessful(dataPayments, response.paymentNextNumber));
    }
  } catch (error) { console.log(error); }
}

function* getPaymentsAcumulate({ payload: { cb } }) {
  try {
    let response = yield call(getAllPaymentsAcumulate);
    if(response.success){
      cb(response);
    }
  } catch (error) { console.log(error); }
}

function* getExtractTerceroPayments({ payload: { tercero, cb } }) {
  try {
    let response = yield call(getExtractPayments, tercero);
    if(response.success){
      cb(response);
    }
  } catch (error) { console.log(error); }
}

function* createPayment({ payload: { payment, cb } }) {
  try {
    let response = yield call(postCreatePayments, payment);
        
    cb(response);

    if(response.success){
      yield put(createPaymentSuccessful(response.data.payment));
    }else{
      yield put(createPaymentFailed("El pago con ese consecutivo ya existe"));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(createPaymentFailed(error));
  }
}

function* editPayment({ payload: { payment, cb } }) {
  try {
    let response = yield call(putEditPayments, payment);
    
    cb(response);
    
    if(response.success){
      yield put(editPaymentSuccessful(response.data.payment));
    }else{
      yield put(editPaymentFailed("El pago con ese consecutivo ya existe"));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(editPaymentFailed(error));
  }
}

function* deletePayment({ payload: { payment, cb } }) {
  try {
    let response = yield call(deleteDeletePayments, payment);
    
    
    if(response.success){
      cb();
      yield put(deletePaymentSuccessful(response.data.payment));
    }else{
      yield put(deletePaymentFailed("El pago con ese consecutivo ya existe"));
    }
    
  } catch (error) {
    yield put(deletePaymentFailed(error));
  }
}

function* paymentsSaga() {
  yield takeEvery(GET_PAYMENTS, getPayments);
  yield takeEvery(GET_PAYMENTS_ACUMULATE, getPaymentsAcumulate);
  yield takeEvery(GET_PAYMENT_PDF, getPaymentPDF);
  yield takeEvery(GET_PAYMENT_EXTRACT, getExtractTerceroPayments);
  yield takeEvery(CREATE_PAYMENT, createPayment);
  yield takeEvery(EDIT_PAYMENT, editPayment);
  yield takeEvery(DELETE_PAYMENT, deletePayment);
}


export default paymentsSaga;
