import { call, put, takeEvery } from "redux-saga/effects";

// Login Redux States
import { CREATE_PROVIDER_TYPE, EDIT_PROVIDER_TYPE, DELETE_PROVIDER_TYPE, GET_PROVIDER_TYPES } from "./actionTypes";
import { 
  createProviderTypeFailed, 
  getProviderTypesSuccessful,
  createProviderTypeSuccessful, 
  editProviderTypeFailed, 
  editProviderTypeSuccessful, 
  deleteProviderTypeFailed, 
  deleteProviderTypeSuccessful
} from "./actions";


import {
  getAllProviderTypes,
  postCreateProviderType,
  putEditProviderType,
  deleteDeleteProviderType,
} from "../../../helpers/backend_helper";

function* getProviderTypes({ payload: { withButtons, cb } }) {
  try {
    let response = yield call(getAllProviderTypes);
    if(response.success){
      let dataProviderTypes = response.data;
      
      if(withButtons){
        dataProviderTypes.forEach((providerType, position) => {
          providerType.operaciones = withButtons(providerType);

          dataProviderTypes[position] = providerType;
        });
      }
      
      cb(response);

      yield put(getProviderTypesSuccessful(dataProviderTypes));
    }
  } catch (error) { console.log(error); }
}

function* createProviderType({ payload: { providerType, cb } }) {
  try {
    let response = yield call(postCreateProviderType, providerType);
        
    cb(response);

    if(response.success){
      yield put(createProviderTypeSuccessful(response.data.providerType));
    }else{
      yield put(createProviderTypeFailed("El tipo de proveedor con ese nombre ya existe"));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(createProviderTypeFailed(error));
  }
}

function* editProviderType({ payload: { providerType, cb } }) {
  try {
    let response = yield call(putEditProviderType, providerType);
    
    cb(response);
    
    if(response.success){
      yield put(editProviderTypeSuccessful(response.data.providerType));
    }else{
      yield put(editProviderTypeFailed("El tipo de proveedor con ese nombre ya existe"));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(editProviderTypeFailed(error));
  }
}

function* deleteProviderType({ payload: { providerType, cb } }) {
  try {
    let response = yield call(deleteDeleteProviderType, providerType);
    
    
    if(response.success){
      cb();
      yield put(deleteProviderTypeSuccessful(response.data.providerType));
    }else{
      yield put(deleteProviderTypeFailed("El tipo de proveedor con ese nombre ya existe"));
    }
    
  } catch (error) {
    yield put(deleteProviderTypeFailed(error));
  }
}

function* providerTypesSaga() {
  yield takeEvery(GET_PROVIDER_TYPES, getProviderTypes);
  yield takeEvery(CREATE_PROVIDER_TYPE, createProviderType);
  yield takeEvery(EDIT_PROVIDER_TYPE, editProviderType);
  yield takeEvery(DELETE_PROVIDER_TYPE, deleteProviderType);
}


export default providerTypesSaga;
