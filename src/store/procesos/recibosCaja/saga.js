import { call, put, takeEvery } from "redux-saga/effects";

// Login Redux States
import { CREATE_BILL_CASH_RECEIPT, EDIT_BILL_CASH_RECEIPT, GET_BILL_CASH_RECEIPT_PDF, GET_PEACE_AND_SAFETY_PDF, DELETE_BILL_CASH_RECEIPT, GET_BILL_CASH_RECEIPTS, GET_BILL_CASH_EXTRACT_RECEIPTS, GET_BILL_CASH_VOUCHERS, GET_BILL_CASH_OWN_VOUCHERS, CREATE_BILL_CASH_VOUCHER, CREATE_BILL_CASH_RECEIPT_ANTICIPOS, EDIT_BILL_CASH_VOUCHER } from "./actionTypes";
import { 
  createBillCashReceiptFailed, 
  getBillCashReceiptsSuccessful,
  createBillCashReceiptSuccessful, 
  editBillCashReceiptFailed, 
  editBillCashReceiptSuccessful, 
  deleteBillCashReceiptFailed, 
  deleteBillCashReceiptSuccessful
} from "./actions";


import {
  getAllBillCashReceipts,
  getBillCashReceiptPDFAPI,
  getExtractBillCashReceipts,
  postCreateBillCashReceipt,
  postCreateBillCashReceiptAnticipos,
  putEditBillCashReceipt,
  deleteDeleteBillCashReceipt,

  getAllVouchersBCR,
  getAllOwnVouchersBCR,
  postCreateVoucher,
  putEditVoucher,
  getPeaceAndSafetyPDFAPI
} from "../../../helpers/backend_helper";

function* getAllVouchers({ payload: { cb } }) {
  try {
    let response = yield call(getAllVouchersBCR);

    cb(response);

  } catch (error) { console.log(error); }
}

function* getAllOwnVouchers({ payload: { cb } }) {
  try {
    let response = yield call(getAllOwnVouchersBCR);

    cb(response);

  } catch (error) { console.log(error); }
}

function* getBillCashReceiptPDF({ payload: { withButtons, cb, idBillCashReceipt } }) {
  try {
    let response = yield call(getBillCashReceiptPDFAPI, {idBillCashReceipt});
    
    const url = URL.createObjectURL(response);

    cb(url);

  } catch (error) { console.log(error); }
}

function* getPeaceAndSafetyPDF({ payload: { persona, cb } }) {
  try {
    let response = yield call(getPeaceAndSafetyPDFAPI, {persona});
    
    const url = response ? URL.createObjectURL(response) : false;

    cb(url);

  } catch (error) { console.log(error); }
}

function* getBillCashReceipts({ payload: { withButtons, cb } }) {
  try {
    let response = yield call(getAllBillCashReceipts);
    if(response.success){
      let dataBillCashReceipts = response.data;

      if(withButtons){
        dataBillCashReceipts.forEach((spent, position) => {
          spent.operaciones = withButtons(spent);

          dataBillCashReceipts[position] = spent;
        });
      }
      
      cb(response);

      yield put(getBillCashReceiptsSuccessful(dataBillCashReceipts, response.billCashReceiptNextNumber, response.controlFechaDigitacion));
    }
  } catch (error) { console.log(error); }
}

function* getExtractTerceroBillCashReceipts({ payload: { tercero, cb } }) {
  try {
    let response = yield call(getExtractBillCashReceipts, tercero);
    if(response.success){
      cb(response);
    }
  } catch (error) { console.log(error); }
}

function* createBillCashReceiptVoucher({ payload: { voucher, cb } }) {
  try {
    let response = yield call(postCreateVoucher, voucher);
        
    cb(response);

  } catch (error) {
    cb({success: false, error});
  }
}

function* createBillCashReceiptAnticipos({ payload: { historyBills, cb } }) {
  try {
    let response = yield call(postCreateBillCashReceiptAnticipos, historyBills);
        
    cb(response);
    
  } catch (error) {
    cb({success: false});
    yield put(createBillCashReceiptFailed(error));
  }
}

function* createBillCashReceipt({ payload: { billCashReceipt, cb } }) {
  try {
    let response = yield call(postCreateBillCashReceipt, billCashReceipt);
        
    cb(response);

    if(response.success){
      yield put(createBillCashReceiptSuccessful(response.data.billCashReceipt));
    }else{
      yield put(createBillCashReceiptFailed("El recibo de caja con ese consecutivo ya existe"));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(createBillCashReceiptFailed(error));
  }
}

function* editBillCashReceiptVoucher({ payload: { voucher, cb } }) {
  try {
    let response = yield call(putEditVoucher, voucher);
    
    cb(response);
    
  } catch (error) {
    cb({success: false, error});
  }
}

function* editBillCashReceipt({ payload: { billCashReceipt, cb } }) {
  try {
    let response = yield call(putEditBillCashReceipt, billCashReceipt);
    
    cb(response);
    
    if(response.success){
      yield put(editBillCashReceiptSuccessful(response.data.billCashReceipt));
    }else{
      yield put(editBillCashReceiptFailed("El recibo de caja con ese consecutivo ya existe"));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(editBillCashReceiptFailed(error));
  }
}

function* deleteBillCashReceipt({ payload: { billCashReceipt, cb } }) {
  try {
    let response = yield call(deleteDeleteBillCashReceipt, billCashReceipt);
    
    
    if(response.success){
      cb();
      yield put(deleteBillCashReceiptSuccessful(response.data.billCashReceipt));
    }else{
      yield put(deleteBillCashReceiptFailed("El recibo de caja con ese consecutivo ya existe"));
    }
    
  } catch (error) {
    yield put(deleteBillCashReceiptFailed(error));
  }
}

function* billCashReceiptsSaga() {
  yield takeEvery(GET_BILL_CASH_VOUCHERS, getAllVouchers);
  yield takeEvery(GET_BILL_CASH_OWN_VOUCHERS, getAllOwnVouchers);
  yield takeEvery(GET_BILL_CASH_RECEIPTS, getBillCashReceipts);
  yield takeEvery(GET_BILL_CASH_RECEIPT_PDF, getBillCashReceiptPDF);
  yield takeEvery(GET_PEACE_AND_SAFETY_PDF, getPeaceAndSafetyPDF);
  yield takeEvery(GET_BILL_CASH_EXTRACT_RECEIPTS, getExtractTerceroBillCashReceipts);
  yield takeEvery(CREATE_BILL_CASH_VOUCHER, createBillCashReceiptVoucher);
  yield takeEvery(CREATE_BILL_CASH_RECEIPT_ANTICIPOS, createBillCashReceiptAnticipos);
  yield takeEvery(CREATE_BILL_CASH_RECEIPT, createBillCashReceipt);
  yield takeEvery(EDIT_BILL_CASH_RECEIPT, editBillCashReceipt);
  yield takeEvery(EDIT_BILL_CASH_VOUCHER, editBillCashReceiptVoucher);
  yield takeEvery(DELETE_BILL_CASH_RECEIPT, deleteBillCashReceipt);
}


export default billCashReceiptsSaga;
