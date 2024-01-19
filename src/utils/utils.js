import moment from "moment";
import config from '../config/config';

const { API_BASE_URL } = config;

// eslint-disable-next-line import/prefer-default-export
export const logoutAndClearData = keycloak =>
  keycloak.logout({redirectUri: config.HOME_UI_BASE_URL}).then(() => {
    window.keycloak = null;
    window.location.href = '/';
  });

export const getISTTime = unixTimeInSeconds =>
  moment.unix(unixTimeInSeconds).format('hh:mm:ssa');

export const getApiRelativeUrl = url =>
  url.substring(API_BASE_URL.length)