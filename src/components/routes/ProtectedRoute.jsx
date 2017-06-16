import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router';
import ProtectedPage from '../pages/ProtectedPage';

const propTypes = {
  component: PropTypes.func,
  username: PropTypes.string,
  redirectLogin: PropTypes.func,
};

export default function ProtectedRoute(props) {
  const {
    component: Component,
    username,
    ...remainingProps
  } = props;

  return (
    <Route
      {...remainingProps}
      render={routeProps => (
        username ? (
          <ProtectedPage username={username} {...routeProps} >
            <Component {...routeProps} />
          </ProtectedPage>
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: {
                continuation: routeProps.location,
              },
            }}
          />
        )
      )}
    />
  );
}

ProtectedRoute.propTypes = propTypes;
