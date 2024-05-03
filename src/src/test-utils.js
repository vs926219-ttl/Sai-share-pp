/* eslint-disable react/prop-types */
import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { StylesProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { RESOURCE_TYPE, USER_OPERATIONS } from './constants';
import store from './redux';
import { AuthorizationHandler, PopupManager } from './providers';

const AllTheProviders = ({ children, testAuthPolicy, testAuthUser }) => {
  const allAllowedAuthPolicy = Object.values(USER_OPERATIONS).map(
    operation => ({
      allowed: ['*'],
      denied: [],
      operation,
      resourceGroup: 'esakha',
    }),
  );
  return (
    <StylesProvider injectFirst>
      <Provider store={store}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <PopupManager>
            <AuthorizationHandler
              value={{
                user: testAuthUser || {},
                isAuthenticated: true,
                authPolicies: testAuthPolicy || allAllowedAuthPolicy,
                authResources: {
                  denied: [],
                  allowed: ['org:tml:application:avantgarde-home:esakha:ppap'],
                  resourceGroup: 'application-access',
                  operation: 'access-application',
                },
              }}
            >
              <Router>{children}</Router>
            </AuthorizationHandler>
          </PopupManager>
        </MuiPickersUtilsProvider>
      </Provider>
    </StylesProvider>
  );
};

const customRender = (ui, options) =>
  render(ui, {
    wrapper: props => <AllTheProviders {...props} {...options?.wrapperProps} />,
    ...options,
  });
  
// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };

export const getTestAuthPolicy = (role) => {
  switch (role) {
    case 'read-only':
      return Object.values(USER_OPERATIONS).map(operation => ({
        allowed: [],
        denied: [],
        operation,
        resourceGroup: 'esakha',
      }));

    case 'project-master': {
      const plantPPCOperations = [
        USER_OPERATIONS.CREATE_PROJECT,
        USER_OPERATIONS.LIST_PROJECTS
      ];
      return plantPPCOperations.map(operation => ({
        allowed: [`org:tml:resource:${RESOURCE_TYPE.PROJECT}`],
        denied: [],
        operation,
        resourceGroup: 'esakha',
      }));
    }
    case 'document-master': {
      const plantPPCOperations = [
        USER_OPERATIONS.CREATE_PPAP_STAGE_DOCUMENT,
      ];
      return plantPPCOperations.map(operation => ({
        allowed: [`org:tml:resource:${RESOURCE_TYPE.PPAP_STAGE_DOCUMENT}`],
        denied: [],
        operation,
        resourceGroup: 'esakha',
      }));
    }
    case 'process': {
      const operations = [
        USER_OPERATIONS.CREATE_PPAP,
        USER_OPERATIONS.INITIATE_PPAP,
        USER_OPERATIONS.TERMINATE_PPAP
      ];
      return operations.map(operation => ({
        allowed: [`org:tml:resource:${RESOURCE_TYPE.PPAP}`],
        denied: [],
        operation,
        resourceGroup: 'esakha',
      }));
    }

    case 'part-category': {
      const operations = [USER_OPERATIONS.LIST_PART_CATEGORIES]
      return operations.map(operation => ({
        allowed: [`org:tml:resource:${RESOURCE_TYPE.PART_CATEGORY}`],
        denied: [],
        operation,
        resourceGroup: 'esakha',
      }));
    }

    case 'ppap-submission-level': {
      const operations = [USER_OPERATIONS.LIST_PPAP_SUBMISSION_LEVELS]
      return operations.map(operation => ({
        allowed: [`org:tml:resource:${RESOURCE_TYPE.PPAP_SUBMISSION_LEVEL}`],
        denied: [],
        operation,
        resourceGroup: 'esakha',
      }));
    }

    case 'ppap-reason': {
      const operations = [USER_OPERATIONS.LIST_PPAP_REASONS]
      return operations.map(operation => ({
        allowed: [`org:tml:resource:${RESOURCE_TYPE.PPAP_REASON}`],
        denied: [],
        operation,
        resourceGroup: 'esakha',
      }));
    }

    default:
      return [];
  }
};