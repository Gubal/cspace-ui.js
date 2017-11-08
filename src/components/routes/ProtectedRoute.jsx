import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router';
import Immutable from 'immutable';
import ProtectedPage from '../pages/ProtectedPage';

const propTypes = {
  component: PropTypes.func,
  decorated: PropTypes.bool,
  perms: PropTypes.instanceOf(Immutable.Map),
  screenName: PropTypes.string,
  username: PropTypes.string,
  redirectLogin: PropTypes.func,
};

export default function ProtectedRoute(props) {
  const {
    component: Component,
    decorated,
    perms,
    screenName,
    username,
    ...remainingProps
  } = props;

  return (
    <Route
      {...remainingProps}
      render={routeProps => (
        username ? (
          <ProtectedPage
            perms={perms}
            screenName={screenName}
            username={username}
            decorated={decorated}
            {...routeProps}
          >
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
