/* global btoa */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { withContext } from '../../contexts/history';

import Page, { Container } from '../../components/page';
import * as LoginActions from '../../actions/loginActions';
import * as NotifyActions from '../../actions/notificationActions';
import LoginForm from './loginForm';

export class Login extends Component {
  static propTypes = {
    actions: PropTypes.shape({
      loginUser: PropTypes.func.isRequired,
      showMessage: PropTypes.func.isRequired,
      hideMessage: PropTypes.func.isRequired
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired,
    userProfile: PropTypes.shape({})
  };

  static defaultProps = {
    userProfile: null
  };

  state = {
    showFormError: false
  };

  componentDidUpdate() {
    if (this.props.userProfile) {
      this.props.history.push('/home');
    }
  }

  submitLogin = async ({ storeNumber, username, password }) => {
    const { loginUser } = this.props.actions;
    const { type: actionType } = await loginUser(
      storeNumber,
      username,
      btoa(password)
    );

    if (actionType === 'LOGIN_ERROR') {
      this.setState({ showFormError: true });
      this.props.actions.showMessage(
        'Invalid credentials: The information you provided did not match. Please try again.'
      );
    } else {
      this.props.actions.hideMessage();
    }
  };

  handleCloseNotification = () => this.setState({ showFormError: false });

  render() {
    return (
      <Page
        className="login"
        onCloseNotification={this.handleCloseNotification}
        empty
      >
        <Container hideBoxShadow>
          <div className="card login-card">
            <div className="card-toolbar">
              <span className="card-title">
                <h2>Login</h2>
              </span>
            </div>
            <span className="card-subtitle">
              Provide your login credentials below.
            </span>
            <LoginForm
              submitLogin={this.submitLogin}
              error={this.state.showFormError}
            />
          </div>
        </Container>
      </Page>
    );
  }
}

const mapStateToProps = state => ({
  userProfile: state.login.userProfile,
  loginError: state.login.error
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...LoginActions, ...NotifyActions }, dispatch)
});

const LoginWithContext = withContext(Login);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginWithContext);
