import axios from 'axios';
import qs from 'qs';
import config from '../config/config';
import { logoutAndClearData } from '../utils/utils';

const { API_BASE_URL } = config;

const loadApiRequestAuthInterceptor = instance => {
  const newAuthInterceptor = instance.interceptors.request.use(req => {
    req.headers.Authorization = `Bearer ${
      window.keycloak && window.keycloak.token
    }`;
    return req;
  });
  return newAuthInterceptor;
};

const add401ResponseInterceptor = instance => {
  instance.interceptors.response.use(
    res => res,
    error => {
      if (
        error.response &&
        error.response.request.responseURL.startsWith(config.API_BASE_URL) &&
        error.response.status === 401 &&
        window.keycloak
      ) {
        console.log('add401ResponseInterceptor -> error', error);
        console.log('unauthorized: clearing storage');
        logoutAndClearData(window.keycloak);
      }
      return Promise.reject(error);
    },
  );
};

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: { Accept: 'application/json' },
  paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
});

add401ResponseInterceptor(API);

loadApiRequestAuthInterceptor(API);

const { CancelToken } = axios;

export { API, CancelToken };
