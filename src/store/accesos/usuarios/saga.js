import { call, put, takeEvery } from "redux-saga/effects";

// Login Redux States
import { CREATE_CLIENT_USER, EDIT_CLIENT_USER, DELETE_CLIENT_USER, GET_CLIENT_USERS } from "./actionTypes";
import { 
  createClientUserFailed, 
  getClientUsersSuccessful,
  createClientUserSuccessful, 
  editClientUserFailed, 
  editClientUserSuccessful, 
  deleteClientUserFailed, 
  deleteClientUserSuccessful
} from "./actions";


import {
  getAllClientUsers,
  postCreateClientUser,
  putEditClientUser,
  deleteDeleteClientUser,
} from "../../../helpers/backend_helper";

function* getClientUsers({ payload: { withButtons, cb } }) {
  try {
    let response = yield call(getAllClientUsers);
    if(response.success){
      let dataClientUsers = response.data;

      if(withButtons){
        dataClientUsers.forEach((clientUser, position) => {
          clientUser.operaciones = withButtons(clientUser);

          dataClientUsers[position] = clientUser;
        });
      }
      
      cb(response);

      yield put(getClientUsersSuccessful(dataClientUsers));
    }
  } catch (error) { console.log(error); }
}

function* createClientUser({ payload: { clientUser, cb } }) {
  try {
    let response = yield call(postCreateClientUser, clientUser);
        
    cb(response);

    if(response.success){
      yield put(createClientUserSuccessful());
    }else{
      yield put(createClientUserFailed("El usuario con ese email ya existe"));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(createClientUserFailed(error));
  }
}

function* editClientUser({ payload: { clientUser, cb } }) {
  try {
    let response = yield call(putEditClientUser, clientUser);
    
    cb(response);
    
    if(response.success){
      yield put(editClientUserSuccessful());
    }else{
      yield put(editClientUserFailed("El usuario con ese nombre ya existe"));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(editClientUserFailed(error));
  }
}

function* deleteClientUser({ payload: { clientUser, cb } }) {
  try {
    let response = yield call(deleteDeleteClientUser, clientUser);
    
    
    if(response.success){
      cb();
      yield put(deleteClientUserSuccessful());
    }else{
      yield put(deleteClientUserFailed("El usuario con ese nombre ya existe"));
    }
    
  } catch (error) {
    yield put(deleteClientUserFailed(error));
  }
}

function* typesClientUserSaga() {
  yield takeEvery(GET_CLIENT_USERS, getClientUsers);
  yield takeEvery(CREATE_CLIENT_USER, createClientUser);
  yield takeEvery(EDIT_CLIENT_USER, editClientUser);
  yield takeEvery(DELETE_CLIENT_USER, deleteClientUser);
}


export default typesClientUserSaga;
