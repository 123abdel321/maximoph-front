import { call, put, takeEvery } from "redux-saga/effects";

// Login Redux States
import { CREATE_TYPE_HOMEWORK, EDIT_TYPE_HOMEWORK, DELETE_TYPE_HOMEWORK, GET_TYPES_HOMEWORK } from "./actionTypes";
import { 
  createTypeHomeworkFailed, 
  getTypesHomeworkSuccessful,
  createTypeHomeworkSuccessful, 
  editTypeHomeworkFailed, 
  editTypeHomeworkSuccessful, 
  deleteTypeHomeworkFailed, 
  deleteTypeHomeworkSuccessful
} from "./actions";


import {
  getAllTypesHomework,
  postCreateTypeHomework,
  putEditTypeHomework,
  deleteDeleteTypeHomework,
} from "../../../helpers/backend_helper";

function* getTypesHomework({ payload: { withButtons, cb } }) {
  try {
    let response = yield call(getAllTypesHomework);
    if(response.success){
      let dataTypesHomework = response.data;

      if(withButtons){
        dataTypesHomework.forEach((typeHomework, position) => {
          typeHomework.operaciones = withButtons(typeHomework);

          dataTypesHomework[position] = typeHomework;
        });
      }
      
      cb(response);

      yield put(getTypesHomeworkSuccessful(dataTypesHomework));
    }
  } catch (error) { console.log(error); }
}

function* createTypeHomeWork({ payload: { concept, cb } }) {
  try {
    let response = yield call(postCreateTypeHomework, concept);
        
    cb(response);

    if(response.success){
      yield put(createTypeHomeworkSuccessful(response.data.typeHomework));
    }else{
      yield put(createTypeHomeworkFailed("El tipo de tarea con ese nombre ya existe"));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(createTypeHomeworkFailed(error));
  }
}

function* editTypeHomework({ payload: { concept, cb } }) {
  try {
    let response = yield call(putEditTypeHomework, concept);
    
    cb(response);
    
    if(response.success){
      yield put(editTypeHomeworkSuccessful(response.data.typeHomework));
    }else{
      yield put(editTypeHomeworkFailed("El tipo de tarea con ese nombre ya existe"));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(editTypeHomeworkFailed(error));
  }
}

function* deleteTypeHomeWork({ payload: { concept, cb } }) {
  try {
    let response = yield call(deleteDeleteTypeHomework, concept);
    
    
    if(response.success){
      cb();
      yield put(deleteTypeHomeworkSuccessful(response.data.person));
    }else{
      yield put(deleteTypeHomeworkFailed("El tipo de tarea con ese nombre ya existe"));
    }
    
  } catch (error) {
    yield put(deleteTypeHomeworkFailed(error));
  }
}

function* typesHomeworkSaga() {
  yield takeEvery(GET_TYPES_HOMEWORK, getTypesHomework);
  yield takeEvery(CREATE_TYPE_HOMEWORK, createTypeHomeWork);
  yield takeEvery(EDIT_TYPE_HOMEWORK, editTypeHomework);
  yield takeEvery(DELETE_TYPE_HOMEWORK, deleteTypeHomeWork);
}


export default typesHomeworkSaga;
