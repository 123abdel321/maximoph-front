import { call, put, takeEvery } from "redux-saga/effects";

// Login Redux States
import { CREATE_CONCEPT_VISIT, EDIT_CONCEPT_VISIT, DELETE_CONCEPT_VISIT, GET_CONCEPTS_VISIT } from "./actionTypes";
import { 
  createConceptVisitFailed, 
  getConceptsVisitSuccessful,
  createConceptVisitSuccessful, 
  editConceptVisitFailed, 
  editConceptVisitSuccessful, 
  deleteConceptVisitFailed, 
  deleteConceptVisitSuccessful
} from "./actions";


import {
  getAllConceptsVisit,
  postCreateConceptVisit,
  putEditConceptVisit,
  deleteDeleteConceptVisit,
} from "../../../helpers/backend_helper";

function* getConceptsVisit({ payload: { withButtons, cb } }) {
  try {
    let response = yield call(getAllConceptsVisit);
    if(response.success){
      let dataConceptsVisit = response.data;

      if(withButtons){
        dataConceptsVisit.forEach((conceptVisit, position) => {
          conceptVisit.operaciones = withButtons(conceptVisit);

          dataConceptsVisit[position] = conceptVisit;
        });
      }
      
      cb(response);

      yield put(getConceptsVisitSuccessful(dataConceptsVisit));
    }
  } catch (error) { console.log(error); }
}

function* createConceptVisit({ payload: { conceptVisit, cb } }) {
  try {
    let response = yield call(postCreateConceptVisit, conceptVisit);
        
    cb(response);

    if(response.success){
      yield put(createConceptVisitSuccessful(response.data.visitConcept));
    }else{
      yield put(createConceptVisitFailed("El concepto de visita con ese nombre ya existe"));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(createConceptVisitFailed(error));
  }
}

function* editConceptVisit({ payload: { concept, cb } }) {
  try {
    let response = yield call(putEditConceptVisit, concept);
    
    cb(response);
    
    if(response.success){
      yield put(editConceptVisitSuccessful(response.data.visitConcept));
    }else{
      yield put(editConceptVisitFailed("El concepto de visita con ese nombre ya existe"));
    }
    
  } catch (error) {
    cb({success: false});
    yield put(editConceptVisitFailed(error));
  }
}

function* deleteConceptVisit({ payload: { conceptVisit, cb } }) {
  try {
    let response = yield call(deleteDeleteConceptVisit, conceptVisit);
    
    
    if(response.success){
      cb();
      yield put(deleteConceptVisitSuccessful(response.data.visitConcept));
    }else{
      yield put(deleteConceptVisitFailed("El concepto de visita con ese nombre ya existe"));
    }
    
  } catch (error) {
    yield put(deleteConceptVisitFailed(error));
  }
}

function* conceptsVisitSaga() {
  yield takeEvery(GET_CONCEPTS_VISIT, getConceptsVisit);
  yield takeEvery(CREATE_CONCEPT_VISIT, createConceptVisit);
  yield takeEvery(EDIT_CONCEPT_VISIT, editConceptVisit);
  yield takeEvery(DELETE_CONCEPT_VISIT, deleteConceptVisit);
}


export default conceptsVisitSaga;
