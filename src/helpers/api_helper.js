import axios from "axios";
import accessToken from "./jwt-token-access/accessToken";

//pass new generated access token here
const token = accessToken;

//apply base url for axios
const API_URL = (process.env.REACT_API_URL||'http://24.144.93.62:3002')+"/api";

const axiosApi = axios.create({
  baseURL: API_URL,
});

axiosApi.defaults.headers.common["Authorization"] = token;

axiosApi.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export async function get(url, config = {}) {
  try{
    return await axiosApi
      .get(url, { ...config })
      .then((response) => response.data);
  }catch(error){
    if(error.response.status==401){
      localStorage.clear();
      window.location="/";
    }
  }
}

export async function getPDF(url, config = {}) {
  let response = await fetch(API_URL + url, { method: 'GET', headers: {
    'Authorization': token
  } });
  
  if(response.status=="401"){
    response = false;
  }else{
    response = await response.blob();
  }

  return response;
}

export async function getSendPDF(url, config = {}) {
  let response = await fetch(API_URL + url, { method: 'GET', headers: {
    'Authorization': token
  } });
  response = await response.blob();

  return response;
}

export async function post(url, data, config = {}) {
  if(config.headers){
    try{
      let response = await fetch(API_URL + url, { method: 'POST', body: data, headers: {
        'Authorization': token
      } });
      response = await response.json();

      return response;
    }catch(error){
      if(error.response.status==401){
        localStorage.clear();
        window.location="/";
      }
    }
  }else{
    return axiosApi
      .post(url, { ...data }, { ...config })
      .then((response) => response.data);
  }
}

export async function put(url, data, config = {}) {
  try{
    return axiosApi
      .put(url, { ...data }, { ...config })
      .then((response) => response.data);
  }catch(error){
    if(error.response.status==401){
      localStorage.clear();
      window.location="/";
    }
  }
}

export async function del(url, config = {}) {
  try{
    return await axiosApi
      .delete(url, { ...config })
      .then((response) => response.data);
  }catch(error){
    if(error.response.status==401){
      localStorage.clear();
      window.location="/";
    }
  }
}
