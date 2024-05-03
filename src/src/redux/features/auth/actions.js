import jwtDecode from 'jwt-decode';
import { logoutAndClearData } from '../../../utils/utils';
import { API_RESOURCE_URLS, USER_OPERATIONS } from '../../../constants';
import { API } from '../../../apis/api';

import {
  CLEAR_AUTH_DATA,
  LOAD_AUTH_DATA,
  SET_AUTH_TOKEN,
  SET_KEYCLOAK_INSTANCE,
} from './actionTypes';

/*
 * load user profile from required backend
 * eg (from production-planning):
 * ```
 * {
 *  const response = await API.get(API_RESOURCE_URLS.USER_PROFILE);
 *  return response.data;
 * }
 * ```
 */
export const getUserProfile = async () => ({});

/*
 * load user auth policies from required backend for specified resources and type of operations
 * eg (from production-planning):
 * ```
 * {
 *  try {
 *  const response = await API.get(API_RESOURCE_URLS.AUTH_BULK_RESOURCE, {
 *    params: {
 *       resourceGroup: 'production-planning',
 *       operation: Object.values(USER_OPERATIONS),
 *     },
 *   });
 *   return response.data;
 * } catch (error) {
 *   console.log('failed to load auth policy', error);
 *   return [];
 *  }
 * }
 * ```
 */
const loadAuthPolicies = async () => {
  try {
    const response = await API.get(API_RESOURCE_URLS.AUTH_BULK_RESOURCE, {
      params: {
        resourceGroup: 'esakha',
        operation: Object.values(USER_OPERATIONS),
      },
    });
    return response.data;
  } catch (error) {
    console.log('failed to load resources, error:', error);
    return null;
  }
};

const logoutUser = () => (dispatch, getState) => {
  const { keycloak } = getState().auth;
  return logoutAndClearData(keycloak)
    .then(() => dispatch({ type: CLEAR_AUTH_DATA }))
    .then(() => {
      window.location.href = '/';
    });
};

const setKeycloakInstance = keycloak => ({
  type: SET_KEYCLOAK_INSTANCE,
  instance: keycloak,
});

const generateUser = async token => {
  try {
    const { name, email, sub: userId } = jwtDecode(token);
    const userProfile = await getUserProfile();
    return { name, email, userId, ...userProfile, isLoaded: true };
  } catch (err) {
    console.log('failed to load user profile, err:', err);
    return null
  }
};

const loadAuthData = (token, authenticated) => async dispatch => {
  const user = await generateUser(token);
  const authPolicies = await loadAuthPolicies(token);
  return dispatch({
    type: LOAD_AUTH_DATA,
    payload: {
      user,
      isAuthenticated: authenticated,
      authPolicies,
    },
  });
};

const setAuthToken = token => ({
  type: SET_AUTH_TOKEN,
  token,
});

export default {
  loadAuthData,
  setKeycloakInstance,
  logoutUser,
  setAuthToken,
};
