import { call, put, takeEvery } from "redux-saga/effects";

// Login Redux States
import { CREATE_BILLING_CONCEPT, EDIT_BILLING_CONCEPT, DELETE_BILLING_CONCEPT, GET_BILLING_CONCEPTS } from "./actionTypes";
import { 
  createBillingConceptFailed, 
  getBillingConceptsSuccessful,
  createBillingConceptSuccessful, 
  editBillingConceptFailed, 
  editBillingConceptSuccessful, 
  deleteBillingConceptFailed, 
  deleteBillingConceptSuccessful
} from "./actions";


import {
  getAllBillingConcepts,
  postCreateBillingConcept,
  putEditBillingConcept,
  deleteDeleteBillingConcept,
} from "../../../helpers/backend_helper";

function* getBillingConcepts({ payload: { withButtons, cb, strict} }) {
  try {
    let response = yield call(getAllBillingConcepts, { strict });
    if(response.success){
      let dataBillingConcepts = response.data;

      if(withButtons){
        dataBillingConcepts.forEach((billingConcept, position) => {
          billingConcept.operaciones = withButtons(billingConcept);

          dataBillingConcepts[position] = billingConcept;
        });
      }
      
      cb(response);

      yield put(getBillingConceptsSuccessful(dataBillingConcepts));
    }
  } catch (error) { console.log(error); }
}

function* createBillingConcept({ payload: { billingConcept, cb } }) {
  try {
    let response = yield call(postCreateBillingConcept, billingConcept);
        
    cb(response);

    if(response.success){
      yield put(createBillingConceptSuccessful(response.data.billingConcept));
    }else{
      yield put(createBillingConceptFailed("El concepto de facturación con ese nombre ya existe"));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(createBillingConceptFailed(error));
  }
}

function* editBillingConcept({ payload: { billingConcept, cb } }) {
  try {
    let response = yield call(putEditBillingConcept, billingConcept);
    
    cb(response);
    
    if(response.success){
      yield put(editBillingConceptSuccessful(response.data.billingConcept));
    }else{
      yield put(editBillingConceptFailed("El concepto de facturación con ese nombre ya existe"));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(editBillingConceptFailed(error));
  }
}

function* deleteBillingConcept({ payload: { billingConcept, cb } }) {
  try {
    let response = yield call(deleteDeleteBillingConcept, billingConcept);
    
    
    if(response.success){
      cb();
      yield put(deleteBillingConceptSuccessful(response.data.billingConcept));
    }else{
      yield put(deleteBillingConceptFailed("El concepto de facturación con ese nombre ya existe"));
    }
    
  } catch (error) {
    yield put(deleteBillingConceptFailed(error));
  }
}

function* billingConceptsSaga() {
  yield takeEvery(GET_BILLING_CONCEPTS, getBillingConcepts);
  yield takeEvery(CREATE_BILLING_CONCEPT, createBillingConcept);
  yield takeEvery(EDIT_BILLING_CONCEPT, editBillingConcept);
  yield takeEvery(DELETE_BILLING_CONCEPT, deleteBillingConcept);
}


export default billingConceptsSaga;
