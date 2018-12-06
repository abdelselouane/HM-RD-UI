import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

class LoginForm extends Component {
  static defaultProps = {
    error: false
  };

  static propTypes = {
    submitLogin: PropTypes.func.isRequired,
    error: PropTypes.bool
  };

  state = {
    storeNumber: '',
    username: '',
    password: ''
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.error) {
      this.clearInputs();
    }
  }

  handleOnChange = ({ id, event: { target: { value } } }) => {
    this.setState(prevState => ({
      [`${id}`]:
        id === 'storeNumber' && isNaN(value)
          ? prevState[`${id}`]
          : value
    }));
  };

  handleKeyPress = event => {
    if (event.key === 'Enter') {
      this.handleSubmitLogin();
    }
  };

  handleSubmitLogin = () => {
    const { passwordType, showError, ...credentials } = this.state;
    this.props.submitLogin(credentials);
  };

  clearInputs = () =>
    this.setState(() => ({
      storeNumber: '',
      username: '',
      password: ''
    }));

  disableLogin = () =>
    this.state.username === null ||
    this.state.username === '' ||
    (this.state.password === null || this.state.password === '') ||
    (this.state.storeNumber === null || this.state.storeNumber === '');

  renderInputField = fieldProps => {
    const { id, title } = fieldProps;
    const inputProps = { maxLength: 'false', type: 'text', ...fieldProps };
    const className = `text-input-container ${this.props.error && 'error'}`;

    return (
      <div className={className}>
        <input
          {...inputProps}
          value={this.state[id]}
          onChange={event => this.handleOnChange({ id, event })}
          onKeyPress={evt => this.handleKeyPress(evt)}
        />
        <label htmlFor={id}>{title}</label>
      </div>
    );
  };

  render() {
    const loginDisabled = this.disableLogin();
    return (
      <Fragment>
        <div className="card-content">
          {this.renderInputField({
            id: 'storeNumber',
            type: 'text',
            title: 'Store Number',
            placeholder: '#0000',
            maxLength: '4'
          })}
          {this.renderInputField({
            id: 'username',
            type: 'text',
            title: 'User ID',
            placeholder: 'Enter Your User ID'
          })}
          {this.renderInputField({
            id: 'password',
            type: 'password',
            title: 'Password',
            placeholder: 'Enter Your Password'
          })}
        </div>

        <div className="card-actions">
          <button
            className="loader-btn primary"
            id="loginBtn"
            disabled={loginDisabled}
            onClick={() => this.handleSubmitLogin()}
            indeterminate="true"
          >
            Login
          </button>
        </div>
      </Fragment>
    );
  }
}

export default LoginForm;
