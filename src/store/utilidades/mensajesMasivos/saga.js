import { call, put, takeEvery } from "redux-saga/effects";

// Login Redux States
import { CREATE_MASSIVE_MESSAGE, GET_MASSIVE_MESSAGES, GET_RECEIVE_MESSAGES, UPDATE_MASSIVE_MESSAGE } from "./actionTypes";
import { 
  createMassiveMessageFailed, 
  getMassiveMessagesSuccessful,
  getReceiveMessagesSuccessful,
  createMassiveMessageSuccessful
} from "./actions";


import {
  getAllMassiveMessages,
  getAllReceiveMessages,
  postCreateMassiveMessage,
  putReadMassiveMessage
} from "../../../helpers/backend_helper";

function* getReceiveMessages({ payload: { withButtons, cb } }) {
  try {
    let response = yield call(getAllReceiveMessages);
    if(response.success){
      let dataReceiveMessages = response.data;
      
      cb(response);

      yield put(getReceiveMessagesSuccessful(dataReceiveMessages));
    }
  } catch (error) { console.log(error); }
}

function* getMassiveMessages({ payload: { withButtons, cb } }) {
  try {
    let response = yield call(getAllMassiveMessages);
    if(response.success){
      let dataMassiveMessages = response.data;
      
      cb(response);

      yield put(getMassiveMessagesSuccessful(dataMassiveMessages));
    }
  } catch (error) { console.log(error); }
}

function* createMassiveMessage({ payload: { massiveMessage, cb } }) {
  try {
    let response = yield call(postCreateMassiveMessage, massiveMessage);
        
    cb(response);

    yield put(createMassiveMessageSuccessful(response.data.massiveMessage));
    
  } catch (error) {
    cb({success: false});
    yield put(createMassiveMessageFailed(error));
  }
}

function* updateMassiveMessage({ payload: { massiveMessage, cb } }) {
  try {
    let response = yield call(putReadMassiveMessage, massiveMessage);
    
    
    if(response.success){
      cb();
    }
    
  } catch (error) {
    yield put(deleteTypeHomeworkFailed(error));
  }
}

function* massiveMessagesSaga() {
  yield takeEvery(GET_RECEIVE_MESSAGES, getReceiveMessages);
  yield takeEvery(GET_MASSIVE_MESSAGES, getMassiveMessages);
  yield takeEvery(CREATE_MASSIVE_MESSAGE, createMassiveMessage);
  yield takeEvery(UPDATE_MASSIVE_MESSAGE, updateMassiveMessage);
}


export default massiveMessagesSaga;
