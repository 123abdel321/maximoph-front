import { call, put, takeEvery } from "redux-saga/effects";

// Login Redux States
import { CREATE_PROPERTY, EDIT_PROPERTY, DELETE_PROPERTY, GET_PROPERTIES } from "./actionTypes";
import { 
  createPropertyFailed, 
  getPropertiesSuccessful,
  createPropertySuccessful, 
  editPropertyFailed, 
  editPropertySuccessful, 
  deletePropertyFailed, 
  deletePropertySuccessful
} from "./actions";


import {
  getAllProperties,
  postCreateProperty,
  putEditProperty,
  deleteDeleteProperty,
} from "../../../helpers/backend_helper";

function* getProperties({ payload: { withButtons, cb } }) {
  try {
    let response = yield call(getAllProperties);
    if(response.success){
      let dataProperties = response.data;

      if(withButtons){
        dataProperties.forEach((property, position) => {
          property.operaciones = withButtons(property);

          dataProperties[position] = property;
        });
      }
      
      cb(response);

      yield put(getPropertiesSuccessful(dataProperties));
    }
  } catch (error) { console.log(error); }
}

function* createProperty({ payload: { property, cb } }) {
  try {
    let response = yield call(postCreateProperty, property);
        
    cb(response);

    if(response.success){
      yield put(createPropertySuccessful(response.data.property));
    }else{
      yield put(createPropertyFailed("La zona con ese nombre ya existe"));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(createPropertyFailed(error));
  }
}

function* editProperty({ payload: { property, cb } }) {
  try {
    let response = yield call(putEditProperty, property);
    
    cb(response);
    
    if(response.success){
      yield put(editPropertySuccessful(response.data.property));
    }else{
      yield put(editPropertyFailed("La zona con ese nombre ya existe"));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(editPropertyFailed(error));
  }
}

function* deleteProperty({ payload: { property, cb } }) {
  try {
    let response = yield call(deleteDeleteProperty, property);
    
    
    if(response.success){
      cb();
      yield put(deletePropertySuccessful(response.data.property));
    }else{
      yield put(deletePropertyFailed("La zona con ese nombre ya existe"));
    }
    
  } catch (error) {
    yield put(deletePropertyFailed(error));
  }
}

function* propertiesSaga() {
  yield takeEvery(GET_PROPERTIES, getProperties);
  yield takeEvery(CREATE_PROPERTY, createProperty);
  yield takeEvery(EDIT_PROPERTY, editProperty);
  yield takeEvery(DELETE_PROPERTY, deleteProperty);
}


export default propertiesSaga;
