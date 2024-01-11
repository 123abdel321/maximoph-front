import { call, put, takeEvery } from "redux-saga/effects";

// Login Redux States
import { CREATE_CONTROL_VISIT, EDIT_CONTROL_VISIT, DELETE_CONTROL_VISIT, GET_CONTROL_VISITS, GET_CONTROL_VISITS_VISITORS } from "./actionTypes";
import { 
  createControlVisitFailed, 
  getControlVisitsSuccessful,
  createControlVisitSuccessful, 
  editControlVisitFailed, 
  editControlVisitSuccessful, 
  deleteControlVisitFailed, 
  deleteControlVisitSuccessful
} from "./actions";


import {
  getAllControlVisits,
  getVisitorsControlVisits,
  postCreateControlVisit,
  putEditControlVisit,
  deleteDeleteControlVisit
} from "../../../helpers/backend_helper";

function* getControlVisits({ payload: { withButtons, cb } }) {
  try {
    let response = yield call(getAllControlVisits);
    if(response.success){
      let dataControlVisits = response.data;

      if(withButtons){
        dataControlVisits.forEach((controlVisit, position) => {
          controlVisit.operaciones = withButtons(controlVisit);

          dataControlVisits[position] = controlVisit;
        });
      }
      
      cb(response);

      yield put(getControlVisitsSuccessful(dataControlVisits));
    }
  } catch (error) { console.log(error); }
}

function* getControlVisitsVisitors({ payload: { cb, search } }) {
  try {
    let response = yield call(getVisitorsControlVisits, search);

    if(response.success){
      cb(response.data);
    }
  } catch (error) { console.log(error); }
}

function* createControlVisit({ payload: { controlVisit, cb } }) {
  try {
    let response = yield call(postCreateControlVisit, controlVisit);
        
    cb(response);

    if(response.success){
      yield put(createControlVisitSuccessful(response.data.controlVisit));
    }else{
      yield put(createControlVisitFailed("La visita ya existe"));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(createControlVisitFailed(error));
  }
}

function* editControlVisit({ payload: { controlVisit, cb } }) {
  try {
    let response = yield call(putEditControlVisit, controlVisit);
    
    cb(response);
    
    if(response.success){
      yield put(editControlVisitSuccessful(response.data.controlVisit));
    }else{
      yield put(editControlVisitFailed("La visita ya existe"));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(editControlVisitFailed(error));
  }
}

function* deleteControlVisit({ payload: { controlVisit, cb } }) {
  try {
    let response = yield call(deleteDeleteControlVisit, controlVisit);
    
    
    if(response.success){
      cb();
      yield put(deleteControlVisitSuccessful(response.data.controlVisit));
    }else{
      yield put(deleteControlVisitFailed("La visita ya existe"));
    }
    
  } catch (error) {
    yield put(deleteControlVisitFailed(error));
  }
}

function* controlVisitsSaga() {
  yield takeEvery(GET_CONTROL_VISITS, getControlVisits);
  yield takeEvery(GET_CONTROL_VISITS_VISITORS, getControlVisitsVisitors);
  yield takeEvery(CREATE_CONTROL_VISIT, createControlVisit);
  yield takeEvery(EDIT_CONTROL_VISIT, editControlVisit);
  yield takeEvery(DELETE_CONTROL_VISIT, deleteControlVisit);
}


export default controlVisitsSaga;
