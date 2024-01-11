import { call, put, takeEvery } from "redux-saga/effects";

// Login Redux States
import { CREATE_HOMEWORK, CREATE_HOMEWORK_MASSIVE, EDIT_HOMEWORK, COMPLETE_HOMEWORK, DELETE_HOMEWORK, GET_HOMEWORKS, GET_OWN_HOMEWORKS, DELETE_HOMEWORK_MASSIVE } from "./actionTypes";
import { 
  createHomeworkFailed, 
  getHomeworksSuccessful,
  getOwnHomeworksSuccessful,
  createHomeworkSuccessful, 
  editHomeworkFailed, 
  editHomeworkSuccessful, 
  completeHomeworkFailed, 
  completeHomeworkSuccessful, 
  deleteHomeworkFailed, 
  deleteHomeworkSuccessful
} from "./actions";


import {
  getAllHomeworks,
  getAllOwnHomeworks,
  postCreateHomework,
  postCreateHomeworkMassive,
  putEditHomework,
  putCompleteHomework,
  deleteDeleteHomework,
  deleteDeleteHomeworkMassive,
} from "../../../helpers/backend_helper";

function* getHomeworks({ payload: { withButtons, cb } }) {
  try {
    let response = yield call(getAllHomeworks);
    if(response.success){
      let dataHomeworks = response.data;
      
      cb(response);

      yield put(getHomeworksSuccessful(dataHomeworks));
    }
  } catch (error) { console.log(error); }
}

function* getOwnHomeworks({ payload: { withButtons, cb } }) {
  try {
    let response = yield call(getAllOwnHomeworks);
    if(response.success){
      let dataOwnHomeworks = response.data;
      
      cb(response);

      yield put(getOwnHomeworksSuccessful(dataOwnHomeworks));
    }
  } catch (error) { console.log(error); }
}

function* createHomeWork({ payload: { homework, cb } }) {
  try {
    let response = yield call(postCreateHomework, homework);
        
    cb(response);

    if(response.success){
      yield put(createHomeworkSuccessful(response.data.homework));
    }else{
      yield put(createHomeworkFailed("La tarea con ese nombre ya existe"));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(createHomeworkFailed(error));
  }
}

function* createHomeWorkMassive({ payload: { homeworkMassive, cb } }) {
  try {
    let response = yield call(postCreateHomeworkMassive, homeworkMassive);
        
    cb(response);
    
  } catch (error) {
    cb({success: false});
  }
}

function* editHomework({ payload: { homework, cb } }) {
  try {
    let response = yield call(putEditHomework, homework);
    
    cb(response);
    
    if(response.success){
      yield put(editHomeworkSuccessful(response.data.homework));
    }else{
      yield put(editHomeworkFailed("La tarea con ese nombre ya existe"));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(editHomeworkFailed(error));
  }
}

function* completeHomework({ payload: { homework, cb } }) {
  try {
    let response = yield call(putCompleteHomework, homework);
    
    cb(response);
    
    if(response.success){
      yield put(completeHomeworkSuccessful(response.data.homework));
    }else{
      yield put(completeHomeworkFailed("La tarea con ese nombre ya existe"));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(completeHomeworkFailed(error));
  }
}

function* deleteHomeWork({ payload: { homework, cb } }) {
  try {
    let response = yield call(deleteDeleteHomework, homework);
    
    
    if(response.success){
      cb();
      yield put(deleteHomeworkSuccessful(response.data.homework));
    }else{
      yield put(deleteHomeworkFailed("La tarea con ese nombre ya existe"));
    }
    
  } catch (error) {
    yield put(deleteHomeworkFailed(error));
  }
}

function* deleteHomeworkMassive({ payload: { homeworkMassive, cb } }) {
  try {
    let response = yield call(deleteDeleteHomeworkMassive, homeworkMassive);
    
    cb(response);
    
  } catch (error) {
    yield put(deleteHomeworkFailed(error));
  }
}

function* homeworksSaga() {
  yield takeEvery(GET_HOMEWORKS, getHomeworks);
  yield takeEvery(GET_OWN_HOMEWORKS, getOwnHomeworks);
  yield takeEvery(CREATE_HOMEWORK, createHomeWork);
  yield takeEvery(CREATE_HOMEWORK_MASSIVE, createHomeWorkMassive);
  yield takeEvery(EDIT_HOMEWORK, editHomework);
  yield takeEvery(COMPLETE_HOMEWORK, completeHomework);
  yield takeEvery(DELETE_HOMEWORK, deleteHomeWork);
  yield takeEvery(DELETE_HOMEWORK_MASSIVE, deleteHomeworkMassive);
}


export default homeworksSaga;
