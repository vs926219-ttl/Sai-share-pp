/* eslint-disable camelcase */
import { UPDATE_NAVIGATION_DATA } from './actionTypes';

const updateNavigationData = (data) => async (dispatch) => {
  dispatch({
    type: UPDATE_NAVIGATION_DATA,
    payload: data,
  });
};

export default updateNavigationData;
