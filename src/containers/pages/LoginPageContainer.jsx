import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import LoginPage from '../../components/pages/LoginPage';
import { resetLogin } from '../../actions/login';
import { getLoginContinuation } from '../../reducers';

class LoginPageContainer extends Component {
  componentWillMount() {
    const {
      onMount,
    } = this.props;

    if (onMount) {
      onMount();
    }
  }

  render() {
    return (
      <LoginPage {...this.props} />
    );
  }
}

LoginPageContainer.propTypes = {
  onMount: PropTypes.func,
};

const mapStateToProps = state => ({
  continuation: getLoginContinuation(state),
});

const mapDispatchToProps = {
  onMount: resetLogin,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginPageContainer);
