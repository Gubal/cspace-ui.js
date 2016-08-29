import React from 'react';
import { Router as ReactRouter } from 'react-router';
import routes from '../routes';

export default class Router extends React.Component {
  constructor(props) {
    super(props);
    
    this.routes = routes(this.enterProtected.bind(this));
  }
  
  enterProtected(nextState, replace) {
    const {
      username,
      redirectLogin,
    } = this.props;
    
    if (!username) {
      redirectLogin(replace, nextState.location.pathname);
    }
  }
  
  render() {
    const {
      history,
    } = this.props;
    
    return (
      <ReactRouter history={history}>
        {this.routes}
      </ReactRouter>
    );
  }
}

Router.propTypes = {
  history: React.PropTypes.object.isRequired,
  redirectLogin: React.PropTypes.func.isRequired,
  username: React.PropTypes.string,
};

