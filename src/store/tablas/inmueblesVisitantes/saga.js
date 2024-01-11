import { call, put, takeEvery } from "redux-saga/effects";

// Login Redux States
import { CREATE_PROPERTY_VISITOR, EDIT_PROPERTY_VISITOR, DELETE_PROPERTY_VISITOR, GET_PROPERTY_VISITORS } from "./actionTypes";
import { 
  createPropertyVisitorFailed, 
  getPropertyVisitorsSuccessful,
  createPropertyVisitorSuccessful, 
  editPropertyVisitorFailed, 
  editPropertyVisitorSuccessful, 
  deletePropertyVisitorFailed, 
  deletePropertyVisitorSuccessful
} from "./actions";


import {
  getAllPropertyVisitors,
  postCreatePropertyVisitor,
  putEditPropertyVisitor,
  deleteDeletePropertyVisitor,
} from "../../../helpers/backend_helper";

function* getPropertyVisitors({ payload: { withButtons, cb, editInmuebleId } }) {
  try {
    let response = yield call(getAllPropertyVisitors, { editInmuebleId });
    if(response.success){
      let dataPropertyVisitors = response.data;

      if(withButtons){
        dataPropertyVisitors.forEach((propertyVisitor, position) => {
          propertyVisitor.operaciones = withButtons(propertyVisitor);

          dataPropertyVisitors[position] = propertyVisitor;
        });
      }
      
      cb();

      yield put(getPropertyVisitorsSuccessful(dataPropertyVisitors));
    }
  } catch (error) { console.log(error); }
}

function* createPropertyVisitor({ payload: { propertyVisitor, cb } }) {
  try {
    let response = yield call(postCreatePropertyVisitor, propertyVisitor);
        
    cb(response);

    if(response.success){
      yield put(createPropertyVisitorSuccessful(response.data.propertyVisitor));
    }else{
      yield put(createPropertyVisitorFailed("El visitante con ese documento ya se encuentra registrado."));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(createPropertyVisitorFailed(error));
  }
}

function* editPropertyVisitor({ payload: { propertyVisitor, cb } }) {
  try {
    let response = yield call(putEditPropertyVisitor, propertyVisitor);
    
    cb(response);
    
    if(response.success){
      yield put(editPropertyVisitorSuccessful(response.data.propertyVisitor));
    }else{
      yield put(editPropertyVisitorFailed("El visitante con ese documento ya se encuentra registrado."));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(editPropertyVisitorFailed(error));
  }
}

function* deletePropertyVisitor({ payload: { propertyVisitor, cb } }) {
  try {
    let response = yield call(deleteDeletePropertyVisitor, propertyVisitor);
    
    
    if(response.success){
      cb();
      yield put(deletePropertyVisitorSuccessful(response.data.propertyVisitor));
    }else{
      yield put(deletePropertyVisitorFailed("El visitante con ese documento ya se encuentra registrado."));
    }
    
  } catch (error) {
    yield put(deletePropertyVisitorFailed(error));
  }
}

function* propertyVisitorsSaga() {
  yield takeEvery(GET_PROPERTY_VISITORS, getPropertyVisitors);
  yield takeEvery(CREATE_PROPERTY_VISITOR, createPropertyVisitor);
  yield takeEvery(EDIT_PROPERTY_VISITOR, editPropertyVisitor);
  yield takeEvery(DELETE_PROPERTY_VISITOR, deletePropertyVisitor);
}


export default propertyVisitorsSaga;
