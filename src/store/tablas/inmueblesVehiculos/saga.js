import { call, put, takeEvery } from "redux-saga/effects";

// Login Redux States
import { CREATE_PROPERTY_VEHICLE, EDIT_PROPERTY_VEHICLE, UPLOAD_PHOTO_VEHICLE, DELETE_PROPERTY_VEHICLE, GET_PROPERTY_VEHICLES } from "./actionTypes";
import { 
  createPropertyVehicleFailed, 
  getPropertyVehiclesSuccessful,
  createPropertyVehicleSuccessful, 
  editPropertyVehicleFailed, 
  editPropertyVehicleSuccessful, 
  deletePropertyVehicleFailed, 
  deletePropertyVehicleSuccessful,
  uploadPhotoVehicleFailed, 
  uploadPhotoVehicleSuccessful, 
} from "./actions";


import {
  getAllPropertyVehicles,
  postCreatePropertyVehicle,
  putEditPropertyVehicle,
  deleteDeletePropertyVehicle,
  postUploadPhotoPropertyVehicle,
} from "../../../helpers/backend_helper";

function* getPropertyVehicles({ payload: { withButtons, cb, editInmuebleId } }) {
  try {
    let response = yield call(getAllPropertyVehicles, { editInmuebleId });

    if(response.success){
      let dataPropertyVehicles = response.data;

      if(withButtons){
        dataPropertyVehicles.forEach((propertyVehicle, position) => {
          propertyVehicle.operaciones = withButtons(propertyVehicle);

          dataPropertyVehicles[position] = propertyVehicle;
        });
      }
      
      cb();

      yield put(getPropertyVehiclesSuccessful(dataPropertyVehicles));
    }
  } catch (error) { console.log(error); }
}

function* createPropertyVehicle({ payload: { propertyVehicle, cb } }) {
  try {
    let response = yield call(postCreatePropertyVehicle, propertyVehicle);
        
    cb(response);

    if(response.success){
      yield put(createPropertyVehicleSuccessful(response.data.propertyVehicle));
    }else{
      yield put(createPropertyVehicleFailed("El vehículo con esa placa ya se encuentra registrado."));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(createPropertyVehicleFailed(error));
  }
}

function* editPropertyVehicle({ payload: { propertyVehicle, cb } }) {
  try {
    let response = yield call(putEditPropertyVehicle, propertyVehicle);
    
    cb(response);
    
    if(response.success){
      yield put(editPropertyVehicleSuccessful(response.data.propertyVehicle));
    }else{
      yield put(editPropertyVehicleFailed("El vehículo con esa placa ya se encuentra registrado."));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(editPropertyVehicleFailed(error));
  }
}

function* deletePropertyVehicle({ payload: { propertyVehicle, cb } }) {
  try {
    let response = yield call(deleteDeletePropertyVehicle, propertyVehicle);
    
    
    if(response.success){
      cb();
      yield put(deletePropertyVehicleSuccessful(response.data.propertyVehicle));
    }else{
      yield put(deletePropertyVehicleFailed("El vehículo con esa placa ya se encuentra registrado."));
    }
    
  } catch (error) {
    yield put(deletePropertyVehicleFailed(error));
  }
}

function* uploadPhotoVehicle({ payload: { photoVehicle, cb } }) {
  try {
    let response = yield call(postUploadPhotoPropertyVehicle, photoVehicle);
        
    cb(response);

    if(response.success){
      yield put(uploadPhotoVehicleSuccessful(response.data.photoVehicle));
    }else{
      yield put(uploadPhotoVehicleFailed(response.error));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(uploadPhotoVehicleFailed(error));
  }
}

function* propertyVehiclesSaga() {
  yield takeEvery(GET_PROPERTY_VEHICLES, getPropertyVehicles);
  yield takeEvery(CREATE_PROPERTY_VEHICLE, createPropertyVehicle);
  yield takeEvery(EDIT_PROPERTY_VEHICLE, editPropertyVehicle);
  yield takeEvery(DELETE_PROPERTY_VEHICLE, deletePropertyVehicle);
  yield takeEvery(UPLOAD_PHOTO_VEHICLE, uploadPhotoVehicle);
}


export default propertyVehiclesSaga;
