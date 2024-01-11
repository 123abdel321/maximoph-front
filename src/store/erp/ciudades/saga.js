import { call, put, takeEvery } from "redux-saga/effects";

// Login Redux States
import { GET_CITIES } from "./actionTypes";
import { 
  getCitiesSuccessful
} from "./actions";


import {
  getAllCities
} from "../../../helpers/backend_helper";

function* getCities({ payload: { withButtons, cb } }) {
  try {
    let response = yield call(getAllCities);
    if(response.success){
      let dataCities = response.data;

      if(withButtons){
        dataCities.forEach((city, position) => {
          city.operaciones = withButtons(city);

          dataCities[position] = city;
        });
      }
      
      cb();

      yield put(getCitiesSuccessful(dataCities));
    }
  } catch (error) { console.log(error); }
}

function* citiesSaga() {
  yield takeEvery(GET_CITIES, getCities);
}


export default citiesSaga;
