import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { GridLoadingSpinner } from '../components';
import { useAuthorizationContext } from '../providers/AuthorizationHandler/AuthorizationHandler';

const PrivateRoute = ({
  component: Component,
  componentProps,
  ...rest
}) => {
  const { isAuthenticated, user } = useAuthorizationContext();
  return (
    <Route
      {...rest}
      render={() =>
        isAuthenticated && user?.isLoaded ? (
          <Component {...componentProps} />
        ) : (
          <div
            style={{
              margin: '40vh auto',
              height: '20vh',
              width: '20vh',
              textAlign: 'center',
            }}
          >
            <GridLoadingSpinner />
          </div>
        )
      }
    />
  )
};

PrivateRoute.propTypes = {
  component: PropTypes.any.isRequired,
  componentProps: PropTypes.object,
};

PrivateRoute.defaultProps = {
  componentProps: {},
};

export default PrivateRoute;
