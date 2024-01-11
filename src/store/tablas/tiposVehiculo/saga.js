import { call, put, takeEvery } from "redux-saga/effects";

// Login Redux States
import { CREATE_VEHICLE_TYPE, EDIT_VEHICLE_TYPE, DELETE_VEHICLE_TYPE, GET_VEHICLE_TYPES } from "./actionTypes";
import { 
  createVehicleTypeFailed, 
  getVehicleTypesSuccessful,
  createVehicleTypeSuccessful, 
  editVehicleTypeFailed, 
  editVehicleTypeSuccessful, 
  deleteVehicleTypeFailed, 
  deleteVehicleTypeSuccessful
} from "./actions";


import {
  getAllVehicleTypes,
  postCreateVehicleType,
  putEditVehicleType,
  deleteDeleteVehicleType,
} from "../../../helpers/backend_helper";

function* getVehicleTypes({ payload: { withButtons, cb } }) {
  try {
    let response = yield call(getAllVehicleTypes);
    if(response.success){
      let dataVehicleTypes = response.data;

      if(withButtons){
        dataVehicleTypes.forEach((vehicleType, position) => {
          vehicleType.operaciones = withButtons(vehicleType);

          dataVehicleTypes[position] = vehicleType;
        });
      }
      
      cb(response);

      yield put(getVehicleTypesSuccessful(dataVehicleTypes));
    }
  } catch (error) { console.log(error); }
}

function* createVehicleType({ payload: { vehicleType, cb } }) {
  try {
    let response = yield call(postCreateVehicleType, vehicleType);
        
    cb(response);

    if(response.success){
      yield put(createVehicleTypeSuccessful(response.data.vehicleType));
    }else{
      yield put(createVehicleTypeFailed("El tipo de vehículo con ese nombre ya existe"));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(createVehicleTypeFailed(error));
  }
}

function* editVehicleType({ payload: { vehicleType, cb } }) {
  try {
    let response = yield call(putEditVehicleType, vehicleType);
    
    cb(response);
    
    if(response.success){
      yield put(editVehicleTypeSuccessful(response.data.vehicleType));
    }else{
      yield put(editVehicleTypeFailed("El tipo de vehículo con ese nombre ya existe"));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(editVehicleTypeFailed(error));
  }
}

function* deleteVehicleType({ payload: { vehicleType, cb } }) {
  try {
    let response = yield call(deleteDeleteVehicleType, vehicleType);
    
    
    if(response.success){
      cb();
      yield put(deleteVehicleTypeSuccessful(response.data.vehicleType));
    }else{
      yield put(deleteVehicleTypeFailed("El tipo de vehículo con ese nombre ya existe"));
    }
    
  } catch (error) {
    yield put(deleteVehicleTypeFailed(error));
  }
}

function* vehicleTypesSaga() {
  yield takeEvery(GET_VEHICLE_TYPES, getVehicleTypes);
  yield takeEvery(CREATE_VEHICLE_TYPE, createVehicleType);
  yield takeEvery(EDIT_VEHICLE_TYPE, editVehicleType);
  yield takeEvery(DELETE_VEHICLE_TYPE, deleteVehicleType);
}


export default vehicleTypesSaga;
