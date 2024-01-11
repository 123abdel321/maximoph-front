import { call, put, takeEvery } from "redux-saga/effects";

// Login Redux States
import { GET_BILLS, GET_BILLS_DETAILS, GET_BILL_PDF, GET_BILLS_PDF, DELETE_BILL, DELETE_BILLS, SEND_BILL_PDF } from "./actionTypes";
import { getBillsSuccessful, deleteBillFailed, deleteBillSuccessful, deleteBillsFailed, deleteBillsSuccessful  } from "./actions";


import { 
  getAllBills, 
  getAllBillsDetails,
  getBillPDFAPI, 
  getBillsPDFAPI, 
  sendBillPDFAPI, 
  deleteDeleteBill,
  deleteDeleteBills
} from "../../../helpers/backend_helper";

function* getBillPDF({ payload: { withButtons, cb, idBill } }) {
  try {
    let response = yield call(getBillPDFAPI, {idBill});
    
    const url = URL.createObjectURL(response);

    cb(url);

  } catch (error) { console.log(error); }
}

function* getBillsPDF({ payload: { withButtons, cb, idPeriodo, fisico } }) {
  try {
    let response = yield call(getBillsPDFAPI, {idPeriodo, fisico});
    
    const url = URL.createObjectURL(response);

    cb(url);

  } catch (error) { console.log(error); }
}

function* sendBillPDF({ payload: { withButtons, cb, idBill } }) {
  try {
    let response = yield call(sendBillPDFAPI, {idBill});
    
    cb(response);

  } catch (error) { console.log(error); }
}

function* getBills({ payload: { withButtons, cb, idHistory, idPerson } }) {
  try {
    let response = yield call(getAllBills, {idHistory, idPerson});
    if(response.success){
      let dataBills = response.data;

      if(withButtons){
        dataBills.forEach((bill, position) => {
          bill.operaciones = withButtons(bill);

          dataBills[position] = bill;
        });
      }
      
      cb(response);

      
      yield put(getBillsSuccessful(dataBills));
    }
  } catch (error) { console.log(error); }
}

function* getBillsDetails({ payload: { withButtons, cb, idHistory, idPerson } }) {
  try {
    let response = yield call(getAllBillsDetails, {idHistory, idPerson});
    if(response.success){
      let dataBills = response.data;

      if(withButtons){
        dataBills.forEach((bill, position) => {
          bill.operaciones = withButtons(bill);

          dataBills[position] = bill;
        });
      }
      
      cb(response);
    }
  } catch (error) { console.log(error); }
}

function* deleteBill({ payload: { bill, cb } }) {
  try {
    let response = yield call(deleteDeleteBill, bill);
    
    if(response.success){
      cb();
      yield put(deleteBillSuccessful(response.data.bill));
    }else{
      yield put(deleteBillFailed("La cuenta de cobro con ese consecutivo ya fue anulada"));
    }
    
  } catch (error) {
    yield put(deleteBillFailed(error));
  }
}

function* deleteBills({ payload: { bill, cb } }) {
  try {
    let response = yield call(deleteDeleteBills, bill);
    
    if(response.success){
      cb();
      yield put(deleteBillsSuccessful(response.data.bill));
    }else{
      yield put(deleteBillsFailed("La cuenta de cobro con ese consecutivo ya fue anulada"));
    }
    
  } catch (error) {
    yield put(deleteBillsFailed(error));
  }
}

function* billsSaga() {
  yield takeEvery(GET_BILLS, getBills);
  yield takeEvery(GET_BILLS_DETAILS, getBillsDetails);
  yield takeEvery(DELETE_BILL, deleteBill);
  yield takeEvery(DELETE_BILLS, deleteBills);
  yield takeEvery(GET_BILL_PDF, getBillPDF);
  yield takeEvery(GET_BILLS_PDF, getBillsPDF);
  yield takeEvery(SEND_BILL_PDF, sendBillPDF);
}


export default billsSaga;
