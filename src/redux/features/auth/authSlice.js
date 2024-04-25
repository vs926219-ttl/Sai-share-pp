import {
  CLEAR_AUTH_DATA,
  LOAD_AUTH_DATA,
  SET_AUTH_TOKEN,
  SET_KEYCLOAK_INSTANCE,
} from './actionTypes';

const initialState = {
  user: null,
  isAuthenticated: false,
  keycloak: null,
  authPolicies: [],
  authToken: null,
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case CLEAR_AUTH_DATA:
      return initialState;
    case SET_KEYCLOAK_INSTANCE:
      return { ...state, keycloak: action.instance };
    case SET_AUTH_TOKEN:
      return { ...state, authToken: action.token };
    case LOAD_AUTH_DATA:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
