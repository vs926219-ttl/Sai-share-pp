import React, { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getAllowedOperations } from '../../utils/authUtils';
import { useAuthorizationContext } from '../../providers/AuthorizationHandler/AuthorizationHandler';

const AllowedOperationsContext = createContext();

const withAllowedOperationsProvider = (
  WrappedComponent,
  ...resourceTypes
) => props => {
  const { authPolicies } = useAuthorizationContext();
  const [allowedOperations, setAllowedOperations] = useState([]);

  useEffect(() => {
    const evaluatedOperationsForAllResourceTypes = getAllowedOperations(
      resourceTypes,
      authPolicies
    );
    setAllowedOperations(evaluatedOperationsForAllResourceTypes);
  }, [authPolicies]);

  return (
    <AllowedOperationsContext.Provider value={{ allowedOperations }}>
      <WrappedComponent {...props} />
    </AllowedOperationsContext.Provider>
  );
};

withAllowedOperationsProvider.propTypes = {
  authPolicies: PropTypes.array
};

export default withAllowedOperationsProvider;

export const useAllowedOperationsContext = () =>
  useContext(AllowedOperationsContext);
