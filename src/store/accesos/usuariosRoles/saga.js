import { call, put, takeEvery } from "redux-saga/effects";

// Login Redux States
import { CREATE_USER_ROL, EDIT_USER_ROL, EDIT_ROLE_PERMISSIONS, DELETE_USER_ROL, GET_USERS_ROLES, GET_ROLE_PERMISSIONS } from "./actionTypes";
import { 
  createUsersRolFailed, 
  getUsersRolesSuccessful,
  createUsersRolSuccessful, 
  editUserRolFailed, 
  editUserRolSuccessful, 
  deleteUserRolFailed, 
  deleteUserRolSuccessful
} from "./actions";


import {
  getAllUsersRoles,
  getAllRolePermissions,
  postCreateUserRol,
  putEditUserRol,
  putEditRolePermissions,
  deleteDeleteUserRol
} from "../../../helpers/backend_helper";

function* getUsersRoles({ payload: { withButtons, cb } }) {
  try {
    let response = yield call(getAllUsersRoles);
    if(response.success){
      let dataUsersRoles = response.data;

      if(withButtons){
        dataUsersRoles.forEach((userRol, position) => {
          userRol.operaciones = withButtons(userRol);

          dataUsersRoles[position] = userRol;
        });
      }
      
      cb(response.data, response);

      yield put(getUsersRolesSuccessful(dataUsersRoles));
    }
  } catch (error) { console.log(error); }
}

function* getRolePermissions({ payload: { cb, userRol } }) {
  try {
    let response = yield call(getAllRolePermissions, userRol);
    if(response.success){
      let dataRolePermissions = response.data;
      
      cb(dataRolePermissions, response);
    }
  } catch (error) { console.log(error); }
}

function* createUserRol({ payload: { userRol, cb } }) {
  try {
    let response = yield call(postCreateUserRol, userRol);
        
    cb(response);

    if(response.success){
      yield put(createUsersRolSuccessful(response.data.userRol));
    }else{
      yield put(createUsersRolFailed("El rol con ese nombre ya existe"));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(createUsersRolFailed(error));
  }
}

function* editRolePermissions({ payload: { data, cb } }) {
  try {
    let response = yield call(putEditRolePermissions, data);

    cb(response);
    
  } catch (error) {
    cb({success: false});
    yield put(editUserRolFailed(error));
  }
}

function* editUserRol({ payload: { userRol, cb } }) {
  try {
    let response = yield call(putEditUserRol, userRol);
    
    cb(response);
    
    if(response.success){
      yield put(editUserRolSuccessful(response.data.userRol));
    }else{
      yield put(editUserRolFailed("El rol con ese nombre ya existe"));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(editUserRolFailed(error));
  }
}

function* deleteUserRol({ payload: { userRol, cb } }) {
  try {
    let response = yield call(deleteDeleteUserRol, userRol);
    
    
    if(response.success){
      cb();
      yield put(deleteUserRolSuccessful(response.data.person));
    }else{
      yield put(deleteUserRolFailed("El rol con ese nombre ya existe"));
    }
    
  } catch (error) {
    yield put(deleteUserRolFailed(error));
  }
}

function* usersRolesSaga() {
  yield takeEvery(GET_USERS_ROLES, getUsersRoles);
  yield takeEvery(GET_ROLE_PERMISSIONS, getRolePermissions);
  yield takeEvery(CREATE_USER_ROL, createUserRol);
  yield takeEvery(EDIT_USER_ROL, editUserRol);
  yield takeEvery(EDIT_ROLE_PERMISSIONS, editRolePermissions);
  yield takeEvery(DELETE_USER_ROL, deleteUserRol);
}


export default usersRolesSaga;
