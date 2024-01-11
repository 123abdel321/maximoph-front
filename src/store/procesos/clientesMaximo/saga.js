import { call, put, takeEvery } from "redux-saga/effects";

// Login Redux States
import { CREATE_CUSTOMER, EDIT_CUSTOMER, EDIT_LOGO_CUSTOMER, DELETE_CUSTOMER, GET_CUSTOMERS } from "./actionTypes";
import { 
  createCustomerFailed, 
  getCustomersSuccessful,
  createCustomerSuccessful, 
  editCustomerFailed, 
  editCustomerSuccessful, 
  deleteCustomerFailed, 
  deleteCustomerSuccessful
} from "./actions";


import {
  getAllCustomers,
  postCreateCustomer,
  putEditCustomer,
  putEditLogoCustomer,
  deleteDeleteCustomer,
} from "../../../helpers/backend_helper";

function* getCustomers({ payload: { withButtons, cb } }) {
  try {
    let response = yield call(getAllCustomers);
    if(response.success){
      let dataCustomers = response.data;

      if(withButtons){
        dataCustomers.forEach((customer, position) => {
          customer.operaciones = withButtons(customer);

          dataCustomers[position] = customer;
        });
      }
      
      cb(response);

      yield put(getCustomersSuccessful(dataCustomers));
    }
  } catch (error) { console.log(error); }
}

function* createCustomer({ payload: { customer, cb } }) {
  try {
    let response = yield call(postCreateCustomer, customer);
        
    cb(response);

    if(response.success){
      yield put(createCustomerSuccessful(response.data));
    }else{
      yield put(createCustomerFailed("El cliente con ese número de documento ya existe"));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(createCustomerFailed(error));
  }
}

function* editCustomer({ payload: { customer, cb } }) {
  try {
    let response = yield call(putEditCustomer, customer);
    
    cb(response);
    
    if(response.success){
      yield put(editCustomerSuccessful(response.data));
    }else{
      yield put(editCustomerFailed("El cliente con ese número de documento ya existe"));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(editCustomerFailed(error));
  }
}

function* editLogoCustomer({ payload: { customer, cb } }) {
  try {
    let response = yield call(putEditLogoCustomer, customer);
    
    cb(response);
    
    if(response.success){
      yield put(editCustomerSuccessful(response.data));
    }else{
      yield put(editCustomerFailed("El cliente con ese número de documento ya existe"));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(editCustomerFailed(error));
  }
}

function* deleteCustomer({ payload: { customer, cb } }) {
  try {
    let response = yield call(deleteDeleteCustomer, customer);
    
    
    if(response.success){
      cb();
      yield put(deleteCustomerSuccessful(response.data));
    }else{
      yield put(deleteCustomerFailed("El cliente con ese número de documento ya existe"));
    }
    
  } catch (error) {
    yield put(deleteCustomerFailed(error));
  }
}

function* customerssSaga() {
  yield takeEvery(GET_CUSTOMERS, getCustomers);
  yield takeEvery(CREATE_CUSTOMER, createCustomer);
  yield takeEvery(EDIT_CUSTOMER, editCustomer);
  yield takeEvery(EDIT_LOGO_CUSTOMER, editLogoCustomer);
  yield takeEvery(DELETE_CUSTOMER, deleteCustomer);
}


export default customerssSaga;
