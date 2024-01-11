import { call, put, takeEvery } from "redux-saga/effects";

// Login Redux States
import { CREATE_PROPERTY_OWNER_RENTER, EDIT_PROPERTY_OWNER_RENTER, DELETE_PROPERTY_OWNER_RENTER, GET_PROPERTY_OWNERS_RENTERS, GET_PROPERTIES_OWNER_RENTER } from "./actionTypes";
import { 
  createPropertyOwnerRenterFailed, 
  createPropertyOwnerRenterSuccessful, 
  getPropertyOwnersRentersSuccessful,
  editPropertyOwnerRenterFailed, 
  editPropertyOwnerRenterSuccessful, 
  deletePropertyOwnerRenterFailed, 
  deletePropertyOwnerRenterSuccessful
} from "./actions";


import {
  getAllPropertiesOwnerRenter,
  getAllPropertyOwnersRenters,
  postCreatePropertyOwnerRenter,
  putEditPropertyOwnerRenter,
  deleteDeletePropertyOwnerRenter,
} from "../../../helpers/backend_helper";

function* getPropertiesOwnerRenter({ payload: { withButtons, cb, email } }) {
  try {
    let response = yield call(getAllPropertiesOwnerRenter, { email });
    if(response.success){
      cb(response);
    }
  } catch (error) { console.log(error); }
}

function* getPropertyOwnersRenters({ payload: { withButtons, cb, editInmuebleId } }) {
  try {
    let response = yield call(getAllPropertyOwnersRenters, { editInmuebleId });
    if(response.success){
      let dataPropertyOwnersRenters = response.data;

      if(withButtons){
        dataPropertyOwnersRenters.forEach((propertyOwnerRenter, position) => {
          propertyOwnerRenter.operaciones = withButtons(propertyOwnerRenter);

          dataPropertyOwnersRenters[position] = propertyOwnerRenter;
        });
      }
      
      cb(response.data);

      yield put(getPropertyOwnersRentersSuccessful(dataPropertyOwnersRenters));
    }
  } catch (error) { console.log(error); }
}

function* createPropertyOwnerRenter({ payload: { propertyOwnerRenter, cb } }) {
  try {
    let response = yield call(postCreatePropertyOwnerRenter, propertyOwnerRenter);
        
    cb(response);

    if(response.success){
      yield put(createPropertyOwnerRenterSuccessful(response.data.propertyOwnerRenter));
    }else{
      yield put(createPropertyOwnerRenterFailed("El propietario/inquilino con ese documento ya se encuentra registrado."));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(createPropertyOwnerRenterFailed(error));
  }
}

function* editPropertyOwnerRenter({ payload: { propertyOwnerRenter, cb } }) {
  try {
    let response = yield call(putEditPropertyOwnerRenter, propertyOwnerRenter);
    
    cb(response);
    
    if(response.success){
      yield put(editPropertyOwnerRenterSuccessful(response.data.propertyOwnerRenter));
    }else{
      yield put(editPropertyOwnerRenterFailed("El propietario/inquilino con ese documento ya se encuentra registrado."));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(editPropertyOwnerRenterFailed(error));
  }
}

function* deletePropertyOwnerRenter({ payload: { propertyOwnerRenter, cb } }) {
  try {
    let response = yield call(deleteDeletePropertyOwnerRenter, propertyOwnerRenter);
    
    
    if(response.success){
      cb();
      yield put(deletePropertyOwnerRenterSuccessful(response.data.propertyOwnerRenter));
    }else{
      yield put(deletePropertyOwnerRenterFailed("El propietario/inquilino con ese documento ya se encuentra registrado."));
    }
    
  } catch (error) {
    yield put(deletePropertyOwnerRenterFailed(error));
  }
}

function* propertyOwnersRentersSaga() {
  yield takeEvery(GET_PROPERTIES_OWNER_RENTER, getPropertiesOwnerRenter);
  yield takeEvery(GET_PROPERTY_OWNERS_RENTERS, getPropertyOwnersRenters);
  yield takeEvery(CREATE_PROPERTY_OWNER_RENTER, createPropertyOwnerRenter);
  yield takeEvery(EDIT_PROPERTY_OWNER_RENTER, editPropertyOwnerRenter);
  yield takeEvery(DELETE_PROPERTY_OWNER_RENTER, deletePropertyOwnerRenter);
}


export default propertyOwnersRentersSaga;
