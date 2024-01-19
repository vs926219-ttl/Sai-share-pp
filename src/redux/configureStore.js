import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers';
import config from '../config/config';

const configureStore = () => {
  const middleware = [thunk];

  const composerFunction =
    config.ENV_TYPE === 'TEST' ? composeWithDevTools : compose;

  const composedEnhancers = composerFunction(applyMiddleware(...middleware));

  return createStore(rootReducer, composedEnhancers);
};

export default configureStore;
