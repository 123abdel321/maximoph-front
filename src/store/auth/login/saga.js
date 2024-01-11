import { call, put, takeEvery, takeLatest } from "redux-saga/effects";

// Login Redux States
import { LOGIN_USER, UPDATE_TOKEN_FB_USER, LOGOUT_USER, SOCIAL_LOGIN } from "./actionTypes";
import { apiError, loginSuccess, logoutUserSuccess } from "./actions";


import {
  postLogin,
  updateTokenFBUser
} from "../../../helpers/backend_helper";

function* loginUser({ payload: { user, history, cb, idCliente } }) {
  try {
    yield put(apiError(""));

    let response = yield call(postLogin, {
      email: user.email,
      password: user.password,
    });
    
    if(response.success){
      let customers = response.data.clients;
      if(response.data.clients.length==1||idCliente){
        response = yield call(postLogin, {
          email: user.email,
          password: user.password,
          idCliente: (idCliente||customers[0].id).toString()
        });
        console.log(response.data);
        let nameCustomerUser = '';
        let idC = (idCliente||customers[0].id);

        console.log(customers);

        customers.map(cust=>{
          if(cust.id==idC) nameCustomerUser = cust.cliente_nombre;
        });

        localStorage.setItem("authUser", JSON.stringify(response.data.user));
        localStorage.setItem("2._mu", user.password);
        localStorage.setItem("customersUser", JSON.stringify(customers||[]));
        localStorage.setItem("logo", response.data.user.logo);
        localStorage.setItem("enviromentMaximo", JSON.stringify(response.data.enviromentMaximo));
      
        yield put(loginSuccess(response.data.user));

        localStorage.setItem("customerUser", nameCustomerUser);

        yield put(loginSuccess(response.data.user));

        if(([24,25,26]).indexOf(response.data.user.id_rol)<0){
          //history('/tablas/personas');
          window.location.href="/procesos/control-visitas";
        }else if(response.data.user.id_rol==26){
          //history('/procesos/facturacion-historico');
          window.location.href="/procesos/clientes-instalados-maximo";
        }else{
          //history('/procesos/facturacion-historico');
          window.location.href="/procesos/facturacion-historico";
        }
      }else{
        cb(response.data.clients, true);
      }
    }else{
      cb([], false);
      yield put(apiError("Credenciales incorrectas, por favor valida."));
    }
  } catch (error) {
    yield put(apiError(error));
  }
}

function* updtateTokenFirebaseUser({ payload: { token } }) {
  try {
    yield call(updateTokenFBUser, {
      token: token
    });
  } catch (error) {
    yield put(apiError(error));
  }
}

// function* logoutUser({ payload: { history } }) {
//   try {
//     localStorage.removeItem("authUser");

//     if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
//       const response = yield call(fireBaseBackend.logout);
//       yield put(logoutUserSuccess(response));
//     }
//     console.log("history",history)
//     history("/login");
//   } catch (error) {
//     yield put(apiError(error));
//   }
// }

function* logoutUser({ payload: { history } }) {
  try {
    localStorage.removeItem("2._mu");
    localStorage.removeItem("logo");
    localStorage.removeItem("authUser");
    localStorage.removeItem("customersUser");
    localStorage.removeItem("enviromentMaximo");
    localStorage.removeItem("customerUser");

    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const response = yield call(fireBaseBackend.logout);
      yield put(logoutUserSuccess(response));
    }
    history('/login');
  } catch (error) {
    yield put(apiError(error));
  }
}


function* socialLogin({ payload: { data, history, type } }) {
  try {
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const fireBaseBackend = getFirebaseBackend();
      const response = yield call(
        fireBaseBackend.socialLoginUser,
        data,
        type,
      );
      localStorage.setItem("authUser", JSON.stringify(response));
      yield put(loginSuccess(response));
    } else {
      const response = yield call(postSocialLogin, data);
      localStorage.setItem("authUser", JSON.stringify(response));
      yield put(loginSuccess(response));
    }
    history("/tablas/personas");
  } catch (error) {
    yield put(apiError(error));
  }
}

function* authSaga() {
  yield takeEvery(LOGIN_USER, loginUser);
  yield takeEvery(UPDATE_TOKEN_FB_USER, updtateTokenFirebaseUser);
  yield takeLatest(SOCIAL_LOGIN, socialLogin);
  yield takeEvery(LOGOUT_USER, logoutUser);
}

export default authSaga;
