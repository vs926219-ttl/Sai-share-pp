import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import { PopupManager } from '../src/providers';
import configureStore from '../src/redux/configureStore';
import { StylesProvider } from '@material-ui/core';

const AllProviddersDecorator = storyFn => {
  // const allAllowedAuthPolicy = Object.values(USER_OPERATIONS).map(
  //   operation => ({
  //     allowed: ['*'],
  //     denied: [],
  //     operation,
  //     resourceGroup: 'production-planning',
  //   }),
  // );

  return (
    <StylesProvider injectFirst>
      <Provider
        store={configureStore({})} // initialize here with state if needed
      >
        <PopupManager>
          {/* <AuthorizationContext.Provider
              value={{
                user: {},
                isAuthenticated: true,
                authPolicies: allAllowedAuthPolicy,
              }}
            > */}
          <Router>{storyFn()}</Router>
          {/* </AuthorizationContext.Provider> */}
        </PopupManager>
      </Provider>
    </StylesProvider>
  );
};

export default AllProviddersDecorator;
