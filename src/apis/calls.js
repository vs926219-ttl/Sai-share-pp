import moment from 'moment';
import axios from 'axios';

import {
  API_RESOURCE_URLS,
  APPLICATION_NAME,
  LOG_LEVEL,
} from '../constants';
import config from '../config/config';


const {
  API_BASE_URL,
} = config;

export const sendLogToService = async log =>
  axios.post(`${API_BASE_URL}/${API_RESOURCE_URLS.LOG_ERROR}`, log, {
    headers: {
      'Authorization': `Bearer ${
        window.keycloak && window.keycloak.token
      }`
    }
  });

export const log = (message, level, user) => {
  const logMessage = {
    message,
    level: level.name,
    timestamp: moment().toISOString(),
    application: APPLICATION_NAME,
    user,
  };
  sendLogToService(logMessage);
};

export const buildErrorMessage = error => {
  console.log({ error });
  let message;
  if (!error) {
    return message;
  }

  if (error.response) {
    message =
      `Request ${error.response.config?.method.toUpperCase()}' '${error.response.config?.url
      }, params:${JSON.stringify(error.response.config?.params)
      } failed, status:${error.response.status}`;
  } else {
    message = error.message;

    if (error.stack) {
      message += ` sourceFunction:${error.stack.split('\n')[1]}`;
    }
    if (error.config) {
      message += ` request: ${error.config.method} ${error.config.url}`;
    }
  }
  return message || JSON.stringify(error);
};

export const getUserProfile = async () => ({});

export const logError = async (error, user) => {
  const message = buildErrorMessage(error);
  console.error(message);
  log(message, LOG_LEVEL.ERROR, user);
};
