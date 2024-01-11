import { call, put, takeEvery } from "redux-saga/effects";

// Login Redux States
import { CREATE_PERSON, EDIT_PERSON, UPLOAD_PHOTO_PERSON, DELETE_PERSON, SYNC_PERSON_ERP, GET_PERSONS } from "./actionTypes";
import { 
  createPersonFailed, 
  getPersonsSuccessful,
  createPersonSuccessful, 
  uploadPhotoPersonFailed, 
  uploadPhotoPersonSuccessful, 
  editPersonFailed, 
  editPersonSuccessful, 
  deletePersonFailed, 
  deletePersonSuccessful,
  syncPersonERPFailed,
  syncPersonERPSuccessful,
} from "./actions";


import {
  getAllPersons,
  getAllPersonsErp,
  postCreatePerson,
  putEditPerson,
  putSyncPersonERP,
  deleteDeletePerson,
  postUploadPhotoPerson,
} from "../../../helpers/backend_helper";

function* getPersons({ payload: { withButtons, cb , erp} }) {
  try {
    let response;

    if(erp){
      response = yield call(getAllPersonsErp);
    }else{
      response = yield call(getAllPersons);
    }

    if(response.success){
      let dataPersons = response.data;

      if(withButtons){
        dataPersons.forEach((person, position) => {
          person.operaciones = withButtons(person);

          dataPersons[position] = person;
        });
      }
      
      cb(dataPersons, erp, response);

      yield put(getPersonsSuccessful(dataPersons));
    }
  } catch (error) { console.log(error); }
}

function* createPerson({ payload: { person, cb } }) {
  try {
    let response = yield call(postCreatePerson, person);
        
    cb(response);

    if(response.success){
      yield put(createPersonSuccessful(response.data.person));
    }else{
      yield put(createPersonFailed(response.error ? response.error : 'Hemos detectado un error interno, por favor contactar al equipo de Máximo PH.'));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(createPersonFailed(error));
  }
}

function* uploadPhotoPerson({ payload: { photoPerson, cb } }) {
  try {
    let response = yield call(postUploadPhotoPerson, photoPerson);
        
    cb(response);

    if(response.success){
      yield put(uploadPhotoPersonSuccessful(response.data.photoPerson));
    }else{
      yield put(uploadPhotoPersonFailed(response.error));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(uploadPhotoPersonFailed(error));
  }
}

function* editPerson({ payload: { person, cb } }) {
  try {
    let response = yield call(putEditPerson, person);
    
    cb(response);
    
    if(response.success){
      yield put(editPersonSuccessful(response.data.person));
    }else{
      yield put(editPersonFailed(response.error ? response.error : 'Hemos detectado un error interno, por favor contactar al equipo de Máximo PH.'));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(editPersonFailed(error));
  }
}

function* deletePerson({ payload: { person, cb } }) {
  try {
    let response = yield call(deleteDeletePerson, person);
    
    
    if(response.success){
      cb();
      yield put(deletePersonSuccessful(response.data.person));
    }else{
      yield put(deletePersonFailed("La persona con ese número de documento ya existe"));
    }
    
  } catch (error) {
    yield put(deletePersonFailed(error));
  }
}

function* syncPersonERP({ payload: { person, cb } }) {
  try {
    let response = yield call(putSyncPersonERP, person);
    
    if(response.success){
      cb();
      yield put(syncPersonERPSuccessful(response.data.person));
    }else{
      yield put(syncPersonERPFailed("La persona con ese número de documento ya existe"));
    }
    
  } catch (error) {
    yield put(syncPersonERPFailed(error));
  }
}

function* personsSaga() {
  yield takeEvery(GET_PERSONS, getPersons);
  yield takeEvery(CREATE_PERSON, createPerson);
  yield takeEvery(EDIT_PERSON, editPerson);
  yield takeEvery(DELETE_PERSON, deletePerson);
  yield takeEvery(UPLOAD_PHOTO_PERSON, uploadPhotoPerson);
  yield takeEvery(SYNC_PERSON_ERP, syncPersonERP);
}


export default personsSaga;
