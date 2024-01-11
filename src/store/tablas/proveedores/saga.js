import { call, put, takeEvery } from "redux-saga/effects";

// Login Redux States
import { CREATE_PROVIDER, EDIT_PROVIDER, DELETE_PROVIDER, GET_PROVIDERS } from "./actionTypes";
import { 
  createProviderFailed, 
  getProvidersSuccessful,
  createProviderSuccessful, 
  editProviderFailed, 
  editProviderSuccessful, 
  deleteProviderFailed, 
  deleteProviderSuccessful
} from "./actions";


import {
  getAllProviders,
  postCreateProvider,
  putEditProvider,
  deleteDeleteProvider,
} from "../../../helpers/backend_helper";

function* getProviders({ payload: { withButtons, cb } }) {
  try {
    let response = yield call(getAllProviders);
    if(response.success){
      let dataProviders = response.data;

      if(withButtons){
        dataProviders.forEach((provider, position) => {
          provider.operaciones = withButtons(provider);

          dataProviders[position] = provider;
        });
      }
      
      cb(response);

      yield put(getProvidersSuccessful(dataProviders));
    }
  } catch (error) { console.log(error.message); }
}

function* createProvider({ payload: { provider, cb } }) {
  try {
    let response = yield call(postCreateProvider, provider);
        
    cb(response);

    if(response.success){
      yield put(createProviderSuccessful(response.data.provider));
    }else{
      yield put(createProviderFailed("El proveedor con ese nombre ya existe"));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(createProviderFailed(error));
  }
}

function* editProvider({ payload: { provider, cb } }) {
  try {
    let response = yield call(putEditProvider, provider);
    
    cb(response);
    
    if(response.success){
      yield put(editProviderSuccessful(response.data.provider));
    }else{
      yield put(editProviderFailed("El tipo de proveedor con ese nombre ya existe"));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(editProviderFailed(error));
  }
}

function* deleteProvider({ payload: { provider, cb } }) {
  try {
    let response = yield call(deleteDeleteProvider, provider);
    
    
    if(response.success){
      cb();
      yield put(deleteProviderSuccessful(response.data.provider));
    }else{
      yield put(deleteProviderFailed("El proveedor con ese nombre ya existe"));
    }
    
  } catch (error) {
    yield put(deleteProviderFailed(error));
  }
}

function* providersSaga() {
  yield takeEvery(GET_PROVIDERS, getProviders);
  yield takeEvery(CREATE_PROVIDER, createProvider);
  yield takeEvery(EDIT_PROVIDER, editProvider);
  yield takeEvery(DELETE_PROVIDER, deleteProvider);
}


export default providersSaga;
