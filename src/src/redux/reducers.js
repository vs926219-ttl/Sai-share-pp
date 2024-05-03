import { combineReducers } from 'redux';

import authReducer from './features/auth/authSlice';
import filterReducer from './features/filter/filterSlice';
import navigationReducer from './features/navigation/navigationSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  navigation: navigationReducer,
  filters: filterReducer,
});

export default rootReducer;
