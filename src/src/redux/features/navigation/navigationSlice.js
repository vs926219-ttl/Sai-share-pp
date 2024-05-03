import { UPDATE_NAVIGATION_DATA } from './actionTypes';

export const initialState = {
  navigationData: [],
};

export default function navigationReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_NAVIGATION_DATA:
      return { ...state, navigationData: action.payload };
    default:
      return state;
  }
}
