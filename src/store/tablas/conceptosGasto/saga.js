import { call, put, takeEvery } from "redux-saga/effects";

// Login Redux States
import { CREATE_SPENT_CONCEPT, EDIT_SPENT_CONCEPT, DELETE_SPENT_CONCEPT, GET_SPENT_CONCEPTS } from "./actionTypes";
import { 
  createSpentConceptFailed, 
  getSpentConceptsSuccessful,
  createSpentConceptSuccessful, 
  editSpentConceptFailed, 
  editSpentConceptSuccessful, 
  deleteSpentConceptFailed, 
  deleteSpentConceptSuccessful
} from "./actions";


import {
  getAllSpentConcepts,
  postCreateSpentConcept,
  putEditSpentConcept,
  deleteDeleteSpentConcept,
} from "../../../helpers/backend_helper";

function* getSpentConcepts({ payload: { withButtons, cb } }) {
  try {
    let response = yield call(getAllSpentConcepts);
    if(response.success){
      let dataSpentConcepts = response.data;

      if(withButtons){
        dataSpentConcepts.forEach((spentConcept, position) => {
          spentConcept.operaciones = withButtons(spentConcept);

          dataSpentConcepts[position] = spentConcept;
        });
      }
      
      cb(response);

      yield put(getSpentConceptsSuccessful(dataSpentConcepts));
    }
  } catch (error) { console.log(error); }
}

function* createSpentConcept({ payload: { spentConcept, cb } }) {
  try {
    let response = yield call(postCreateSpentConcept, spentConcept);
        
    cb(response);

    if(response.success){
      yield put(createSpentConceptSuccessful(response.data.spentConcept));
    }else{
      yield put(createSpentConceptFailed("El concepto de gasto con ese nombre ya existe"));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(createSpentConceptFailed(error));
  }
}

function* editSpentConcept({ payload: { spentConcept, cb } }) {
  try {
    let response = yield call(putEditSpentConcept, spentConcept);
    
    cb(response);
    
    if(response.success){
      yield put(editSpentConceptSuccessful(response.data.spentConcept));
    }else{
      yield put(editSpentConceptFailed("El concepto de gasto con ese nombre ya existe"));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(editSpentConceptFailed(error));
  }
}

function* deleteSpentConcept({ payload: { spentConcept, cb } }) {
  try {
    let response = yield call(deleteDeleteSpentConcept, spentConcept);
    
    
    if(response.success){
      cb();
      yield put(deleteSpentConceptSuccessful(response.data.spentConcept));
    }else{
      yield put(deleteSpentConceptFailed("El concepto de gasto con ese nombre ya existe"));
    }
    
  } catch (error) {
    yield put(deleteSpentConceptFailed(error));
  }
}

function* spentConceptsSaga() {
  yield takeEvery(GET_SPENT_CONCEPTS, getSpentConcepts);
  yield takeEvery(CREATE_SPENT_CONCEPT, createSpentConcept);
  yield takeEvery(EDIT_SPENT_CONCEPT, editSpentConcept);
  yield takeEvery(DELETE_SPENT_CONCEPT, deleteSpentConcept);
}


export default spentConceptsSaga;
