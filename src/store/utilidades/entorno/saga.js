import { call, put, takeEvery } from "redux-saga/effects";

// Login Redux States
import { GET_DATA_SUMMARY_ERP, EDIT_API_KEY_ERP, SYNC_DATA_ERP, EDIT_ENVIROMENT_MAXIMO, GET_TABLE_IMPORTER_TEMPLATE, POST_TABLE_IMPORTER_TEMPLATE, GET_LOGS_MAXIMO, REMOVE_NOTIFICATION  } from "./actionTypes";

import { 
  getDataSummaryErpSuccessful,
  editApiKeyErpFailed, 
  editApiKeyErpSuccessful,
  editEnviromentMaximoFailed, 
  editEnviromentMaximoSuccessful
} from "./actions";


import {
  postSyncErp,
  getLogsMaximo,
  getSpecificTableImporterTemplate,
  postSpecificTableImporterTemplate,
  getAllSummaryErp,
  putEditApiKeyErp,
  putEnviromentMaximo,
  deleteDeleteNotification
} from "../../../helpers/backend_helper";

function* getLogs({ payload: { origin, cb } }) {
  try {
    let response = yield call(getLogsMaximo, origin);
    if(response.success){
      if(cb) cb(response);
    }
  } catch (error) { console.log(error); }
}

function* downloadTableImporterTemplate({ payload: { origin, cb } }) {
  try {
    let response = yield call(getSpecificTableImporterTemplate, origin);
    if(response.success){
      if(cb) cb(response);
    }
  } catch (error) { console.log(error); }
}

function* uploadTableImporterTemplate({ payload: { template, cb } }) {
  try {
    let response = yield call(postSpecificTableImporterTemplate, template);
    if(cb) cb(response);
  } catch (error) { console.log(error); }
}

function* getSummaryErp({ payload: { withButtons, cb } }) {
  try {
    let response = yield call(getAllSummaryErp);
    if(response.success){
      let dataSummaryErp = response.data;

      cb(dataSummaryErp);
      
      yield put(getDataSummaryErpSuccessful(dataSummaryErp));
    }
  } catch (error) { console.log(error); }
}

function* editApiKeyErp({ payload: { apiKey, cb } }) {
  try {
    let response = yield call(putEditApiKeyErp, apiKey);
    
    cb(response);
    
    if(response.success){
      yield put(editApiKeyErpSuccessful(response.success));
    }else{
      yield put(editApiKeyErpFailed("API KEY Inválida"));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(editApiKeyErpFailed(error));
  }
}

function* syncDataERP({ payload: { data, cb } }) {
  try {
    let response = yield call(postSyncErp, data);
    
    cb(response);
  } catch (error) {
    cb({success: false});
  }
}

function* removeNotification({ payload: { notificationId } }) {
  try {
    yield call(deleteDeleteNotification, notificationId);
  } catch (error) {
    cb({success: false});
  }
}

function* editEnviromentMaximo({ payload: { enviromentValues, cb } }) {
  try {
    let response = yield call(putEnviromentMaximo, enviromentValues);
    
    cb(response);
    
    if(response.success){
      yield put(editEnviromentMaximoSuccessful(response.success));
    }else{
      yield put(editEnviromentMaximoFailed("Error al actualizar la información del entorno Máximo"));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(editEnviromentMaximoFailed(error));
  }
}

function* entornoSaga() {
  yield takeEvery(GET_LOGS_MAXIMO, getLogs);
  yield takeEvery(SYNC_DATA_ERP, syncDataERP);
  yield takeEvery(EDIT_API_KEY_ERP, editApiKeyErp);
  yield takeEvery(GET_DATA_SUMMARY_ERP, getSummaryErp);
  yield takeEvery(REMOVE_NOTIFICATION, removeNotification);
  yield takeEvery(EDIT_ENVIROMENT_MAXIMO, editEnviromentMaximo);
  yield takeEvery(GET_TABLE_IMPORTER_TEMPLATE, downloadTableImporterTemplate);
  yield takeEvery(POST_TABLE_IMPORTER_TEMPLATE, uploadTableImporterTemplate);
}


export default entornoSaga;
