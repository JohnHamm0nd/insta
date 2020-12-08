import Axios from "axios";
import { makeUseAxios } from "axios-hooks";
import { API_HOST } from "Constants";

export const axiosInstance = Axios.create({
  baseURL: API_HOST
});

export const useAxios = makeUseAxios({
  axios: axiosInstance
});


//axiosInstance.interceptors.request.use(
  //(config) => {
    //if (config.method === "get") { // GET 요청일 때
      //config.params = {
        //...config.params,
        //_: new Date().getTime(),  // _ 이름의 dummy querystring를 붙입니다.
      //};
    //}
    //return config;
  //},
  //(error) => {
    //return Promise.reject(error);
  //}
//);
//export const useAxios = makeUseAxios({
  //axios: axiosInstance
//});
