/* global btoa, describe, jest, beforeAll, expect, it */
import React from 'react';
import { shallow } from 'enzyme';

import { Login } from './index';
import LoginForm from './loginForm';
import { LOGIN_ERROR, USER_LOGIN } from '../../constants/actionTypes';

describe('<Login />', () => {
  let props;
  let wrapper;
  let wrapperInstance;

  describe('Login Failure', () => {
    beforeAll(() => {
      props = {
        actions: {
          loginUser: () => Promise.resolve({ type: LOGIN_ERROR }),
          showMessage: jest.fn(),
          hideMessage: jest.fn()
        },
        userProfile: {},
        history: { push: () => {}, location: { pathname: '' } }
      };

      wrapper = shallow(<Login {...props} />);
      wrapperInstance = wrapper.instance();
    });

    it("should call showMessage if actionType returns 'LoginError'", async () => {
      const spy = jest.spyOn(props.actions, 'showMessage');
      await wrapperInstance.submitLogin({
        storeNumber: '1111',
        username: 'tester',
        password: 'abcd'
      });

      expect(spy).toHaveBeenCalledWith(
        'Invalid credentials: The information you provided did not match. Please try again.'
      );
      spy.mockReset();
      spy.mockRestore();
    });

    it('should set showFormError to be true  when loginError happened ', async () => {
      wrapper.setState({ showFormError: false });
      await wrapperInstance.submitLogin({
        storeNumber: '1111',
        username: 'tester',
        password: 'abcd'
      });
      expect(wrapper.state('showFormError')).toBe(true);
    });
  });

  describe('Login Success', () => {
    beforeAll(() => {
      props = {
        actions: {
          loginUser: () => Promise.resolve({ type: USER_LOGIN }),
          showMessage: jest.fn(),
          hideMessage: jest.fn()
        },
        userProfile: {},
        history: { push: () => {}, location: { pathname: '' } }
      };

      wrapper = shallow(<Login {...props} />);
      wrapperInstance = wrapper.instance();
    });

    it('should call hideMessage if actionType not equal LOGIN_ERROR', async () => {
      const spy = jest.spyOn(props.actions, 'hideMessage');
      wrapper.setProps({ loginError: false });
      await wrapperInstance.submitLogin({
        storeNumber: '1111',
        username: 'tester',
        password: 'abcd'
      });
      expect(spy).toHaveBeenCalled();
      spy.mockReset();
      spy.mockRestore();
    });

    it('should set showFormError to false on handleCloseNotification call ', () => {
      wrapper.setState({ showFormError: true });
      wrapper.instance().handleCloseNotification();
      expect(wrapper.state('showFormError')).toBe(false);
    });

    it('should set showFormError to be false  when loginError not happened ', async () => {
      wrapper.setState({ showFormError: false });
      await wrapperInstance.submitLogin({
        storeNumber: '1111',
        username: 'tester',
        password: 'abcd'
      });
      expect(wrapper.state('showFormError')).toBe(false);
    });

    it('should call loginUser when calling submitLogin function', () => {
      const spy = jest.spyOn(props.actions, 'loginUser');

      wrapperInstance.submitLogin({
        storeNumber: '1111',
        username: 'tester',
        password: 'abcd'
      });

      expect(spy).toHaveBeenCalledWith('1111', 'tester', btoa('abcd'));
      spy.mockReset();
      spy.mockRestore();
    });

    it("should push 'home' into history when props.userprofile is not null", () => {
      const spy = jest.spyOn(props.history, 'push');
      wrapper.setProps({ userProfile: { first_name: 'tester' } });
      expect(spy).toHaveBeenCalledWith('/home');
      spy.mockReset();
      spy.mockRestore();
    });

    it("should push 'home' into history when props.userprofile is not null", () => {
      const spy = jest.spyOn(props.history, 'push');
      wrapper.setProps({ userProfile: null });
      expect(spy).not.toHaveBeenCalled();
      spy.mockReset();
      spy.mockRestore();
    });

    describe('<LoginForm/>', () => {
      let lfWrapper;
      let lfWrapperInstance;

      beforeAll(() => {
        lfWrapper = shallow(<LoginForm submitLogin={() => {}} />);
        lfWrapperInstance = lfWrapper.instance();
      });

      it('should have default values in LoginForm component state', () => {
        expect(lfWrapper.state('storeNumber')).toBe('');
        expect(lfWrapper.state('username')).toBe('');
        expect(lfWrapper.state('password')).toBe('');
      });

      it('should have store number field', () => {
        expect(lfWrapper.find('#storeNumber').length).toBe(1);
        expect(lfWrapper.find('#storeNumber').text()).toBe('');
        expect(lfWrapper.find('#storeNumber').prop('placeholder')).toBe(
          '#0000'
        );
        expect(lfWrapper.find('#storeNumber').prop('maxLength')).toBe('4');
        expect(lfWrapper.find('label[htmlFor="storeNumber"]').text()).toBe(
          'Store Number'
        );
      });

      it('should have username field', () => {
        expect(lfWrapper.find('#username').length).toBe(1);
        expect(lfWrapper.find('#username').text()).toBe('');
        expect(lfWrapper.find('#username').prop('placeholder')).toBe(
          'Enter Your User ID'
        );
        expect(lfWrapper.find('label[htmlFor="username"]').text()).toBe(
          'User ID'
        );
      });

      it('should have password field', () => {
        expect(lfWrapper.find('#password').length).toBe(1);
        expect(lfWrapper.find('#password').text()).toBe('');
        expect(lfWrapper.find('#password').prop('placeholder')).toBe(
          'Enter Your Password'
        );
        expect(lfWrapper.find('label[htmlFor="password"]').text()).toBe(
          'Password'
        );
      });

      it('should set storeNumber state variable for the storeNumber Field change event', () => {
        expect(lfWrapperInstance.state.storeNumber).toBe('');
        lfWrapper
          .find('#storeNumber')
          .simulate('change', { target: { value: '123' } });
        expect(lfWrapperInstance.state.storeNumber).toBe('123');
      });

      it('should not allow storeNumber to contain non numbers', () => {
        lfWrapper.setState({ storeNumber: '' });
        lfWrapper
          .find('#storeNumber')
          .simulate('change', { target: { value: 'aaa' } });
        expect(lfWrapperInstance.state.storeNumber).toBe('');
      });

      it('should set username state variable for the username Field change event', () => {
        expect(lfWrapperInstance.state.username).toBe('');
        lfWrapper
          .find('#username')
          .simulate('change', { target: { value: 'tester' } });
        expect(lfWrapperInstance.state.username).toBe('tester');
      });

      it('should set password state variable for the password Field change event', () => {
        expect(lfWrapperInstance.state.password).toBe('');
        lfWrapper
          .find('#password')
          .simulate('change', { target: { value: 'qatester' } });
        expect(lfWrapperInstance.state.password).toBe('qatester');
      });

      it('should render login button', () => {
        expect(lfWrapper.find('.card-actions #loginBtn').length).toBe(1);
        expect(lfWrapper.find('.card-actions #loginBtn').text()).toBe('Login');
      });

      it('should call login method when Enter key event happens in handleKeyPress method', () => {
        const spy = jest.spyOn(lfWrapperInstance, 'handleSubmitLogin');
        lfWrapperInstance.handleKeyPress({ key: 'Enter' });
        expect(spy).toHaveBeenCalled();
        spy.mockReset();
        spy.mockRestore();
      });

      it('should not call login method when Enter key event not happens in handleKeyPress method', () => {
        const spy = jest.spyOn(lfWrapperInstance, 'handleSubmitLogin');
        lfWrapperInstance.handleKeyPress({ key: 'Tab' });
        expect(spy).not.toHaveBeenCalled();
        spy.mockReset();
        spy.mockRestore();
      });

      it('should set state to defaults on clearInput call', () => {
        lfWrapperInstance.handleOnChange({
          id: 'storeNumber',
          event: { target: { value: '1111' } }
        });
        expect(lfWrapperInstance.state.storeNumber).toBe('1111');

        lfWrapperInstance.handleOnChange({
          id: 'username',
          event: { target: { value: 'tester' } }
        });
        expect(lfWrapperInstance.state.username).toBe('tester');

        lfWrapperInstance.handleOnChange({
          id: 'password',
          event: { target: { value: 'abc' } }
        });
        expect(lfWrapperInstance.state.password).toBe('abc');

        lfWrapperInstance.clearInputs();
        expect(lfWrapperInstance.state.storeNumber).toBe('');
        expect(lfWrapperInstance.state.username).toBe('');
        expect(lfWrapperInstance.state.password).toBe('');
      });

      it('should call clearInputs on receiving error=true prop', () => {
        const spy = jest.spyOn(lfWrapperInstance, 'clearInputs');
        lfWrapper.setProps({ error: true });
        expect(spy).toHaveBeenCalled();
        spy.mockReset();
        spy.mockRestore();
      });

      it('should not call clearInputs on receiving error=true prop', () => {
        const spy = jest.spyOn(lfWrapperInstance, 'clearInputs');
        lfWrapper.setProps({ error: false });
        expect(spy).not.toHaveBeenCalled();
        spy.mockReset();
        spy.mockRestore();
      });

      it('should call handleKeyPress on keyPress', () => {
        const spy = jest.spyOn(lfWrapperInstance, 'handleKeyPress');
        lfWrapper.find('#password').simulate('keyPress', { key: 'Enter' });
        expect(spy).toHaveBeenCalled();
        spy.mockReset();
        spy.mockRestore();
      });

      it('should call handleKeyPress on keyPress', () => {
        const spy = jest.spyOn(lfWrapperInstance, 'handleSubmitLogin');
        lfWrapper.find('#loginBtn').simulate('click');
        expect(spy).toHaveBeenCalled();
        spy.mockReset();
        spy.mockRestore();
      });
    });
  });
});
