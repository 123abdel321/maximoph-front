import { call, put, takeEvery } from "redux-saga/effects";

// Login Redux States
import { CREATE_PROPERTY_PET, EDIT_PROPERTY_PET, UPLOAD_PHOTO_PET, DELETE_PROPERTY_PET, GET_PROPERTY_PETS } from "./actionTypes";
import { 
  createPropertyPetFailed, 
  getPropertyPetsSuccessful,
  createPropertyPetSuccessful, 
  editPropertyPetFailed, 
  editPropertyPetSuccessful, 
  deletePropertyPetFailed, 
  deletePropertyPetSuccessful,
  uploadPhotoPetFailed, 
  uploadPhotoPetSuccessful, 
} from "./actions";


import {
  getAllPropertyPets,
  postCreatePropertyPet,
  putEditPropertyPet,
  deleteDeletePropertyPet,
  postUploadPhotoPropertyPet,
} from "../../../helpers/backend_helper";

function* getPropertyPets({ payload: { withButtons, cb, editInmuebleId } }) {
  try {
    let response = yield call(getAllPropertyPets, { editInmuebleId });

    if(response.success){
      let dataPropertyPets = response.data;

      if(withButtons){
        dataPropertyPets.forEach((propertyPet, position) => {
          propertyPet.operaciones = withButtons(propertyPet);

          dataPropertyPets[position] = propertyPet;
        });
      }
      
      cb(response);

      yield put(getPropertyPetsSuccessful(dataPropertyPets));
    }
  } catch (error) { console.log(error); }
}

function* createPropertyPet({ payload: { propertyPet, cb } }) {
  try {
    let response = yield call(postCreatePropertyPet, propertyPet);
        
    cb(response);

    if(response.success){
      yield put(createPropertyPetSuccessful(response.data.propertyPet));
    }else{
      yield put(createPropertyPetFailed("La mascota con ese nombre ya se encuentra registrada."));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(createPropertyPetFailed(error));
  }
}

function* editPropertyPet({ payload: { propertyPet, cb } }) {
  try {
    let response = yield call(putEditPropertyPet, propertyPet);
    
    cb(response);
    
    if(response.success){
      yield put(editPropertyPetSuccessful(response.data.propertyPet));
    }else{
      yield put(editPropertyPetFailed("La mascota con ese nombre ya se encuentra registrada."));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(editPropertyPetFailed(error));
  }
}

function* deletePropertyPet({ payload: { propertyPet, cb } }) {
  try {
    let response = yield call(deleteDeletePropertyPet, propertyPet);
    
    
    if(response.success){
      cb();
      yield put(deletePropertyPetSuccessful(response.data.propertyPet));
    }else{
      yield put(deletePropertyPetFailed("La mascota con ese nombre ya se encuentra registrada."));
    }
    
  } catch (error) {
    yield put(deletePropertyPetFailed(error));
  }
}

function* uploadPhotoPet({ payload: { photoPet, cb } }) {
  try {
    let response = yield call(postUploadPhotoPropertyPet, photoPet);
        
    cb(response);

    if(response.success){
      yield put(uploadPhotoPetSuccessful(response.data.photoPet));
    }else{
      yield put(uploadPhotoPetFailed(response.error));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(uploadPhotoPetFailed(error));
  }
}

function* propertyPetsSaga() {
  yield takeEvery(GET_PROPERTY_PETS, getPropertyPets);
  yield takeEvery(CREATE_PROPERTY_PET, createPropertyPet);
  yield takeEvery(EDIT_PROPERTY_PET, editPropertyPet);
  yield takeEvery(DELETE_PROPERTY_PET, deletePropertyPet);
  yield takeEvery(UPLOAD_PHOTO_PET, uploadPhotoPet);
}


export default propertyPetsSaga;
