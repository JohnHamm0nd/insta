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
        //_: new Date().getTime(),  // _ 이름의 dummy querystring를 붙임. (서버에서 데이터가 바뀌었는데 같은 쿼리에 대한 캐시응답을 막으려고 하는 듯)
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
