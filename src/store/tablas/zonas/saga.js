import { call, put, takeEvery } from "redux-saga/effects";

// Login Redux States
import { CREATE_ZONE, EDIT_ZONE, DELETE_ZONE, GET_ZONES } from "./actionTypes";
import { 
  createZoneFailed, 
  getZonesSuccessful,
  createZoneSuccessful, 
  editZoneFailed, 
  editZoneSuccessful, 
  deleteZoneFailed, 
  deleteZoneSuccessful
} from "./actions";


import {
  getAllZones,
  postCreateZone,
  putEditZone,
  deleteDeleteZone,
} from "../../../helpers/backend_helper";

function* getZones({ payload: { withButtons, cb } }) {
  try {
    let response = yield call(getAllZones);
    if(response.success){
      let dataZones = response.data;

      if(withButtons){
        dataZones.forEach((zone, position) => {
          zone.operaciones = withButtons(zone);

          dataZones[position] = zone;
        });
      }
      
      cb(response);

      yield put(getZonesSuccessful(dataZones));
    }
  } catch (error) { console.log(error); }
}

function* createZone({ payload: { zone, cb } }) {
  try {
    let response = yield call(postCreateZone, zone);
        
    cb(response);

    if(response.success){
      yield put(createZoneSuccessful(response.data.zone));
    }else{
      yield put(createZoneFailed("La zona con ese nombre ya existe"));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(createZoneFailed(error));
  }
}

function* editZone({ payload: { zone, cb } }) {
  try {
    let response = yield call(putEditZone, zone);
    
    cb(response);
    
    if(response.success){
      yield put(editZoneSuccessful(response.data.zone));
    }else{
      yield put(editZoneFailed("La zona con ese nombre ya existe"));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(editZoneFailed(error));
  }
}

function* deleteZone({ payload: { zone, cb } }) {
  try {
    let response = yield call(deleteDeleteZone, zone);
    
    
    if(response.success){
      cb();
      yield put(deleteZoneSuccessful(response.data.zone));
    }else{
      yield put(deleteZoneFailed("La zona con ese nombre ya existe"));
    }
    
  } catch (error) {
    yield put(deleteZoneFailed(error));
  }
}

function* zonesSaga() {
  yield takeEvery(GET_ZONES, getZones);
  yield takeEvery(CREATE_ZONE, createZone);
  yield takeEvery(EDIT_ZONE, editZone);
  yield takeEvery(DELETE_ZONE, deleteZone);
}


export default zonesSaga;
