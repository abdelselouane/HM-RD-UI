/* global beforeAll, describe, expect, jest, it */
import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { Page } from './page';
import Header from '../header';
import Notification from '../notification';
import * as Styles from './styles';
import { isRegExp } from 'util';

describe('<Page />', () => {
  let wrapper;
  let wrapperInstance;
  let pageProps;

  beforeAll(() => {
    global.sessionStorage.removeItem('userProfile');

    pageProps = {
      className: 'test',
      onCloseNotification: jest.fn(),
      empty: false,
      userProfile: { id: 'mockuser' },
      notify: {
        title: '',
        details: '',
        className: 'mockNotifyClass',
        icon: 'mockIcon'
      },
      actions: {
        logoutUser: jest.fn(),
        clearResults: jest.fn(),
        clearCart: jest.fn(),
        hideMessage: jest.fn(),
        loadConfig: jest.fn()
      },
      history: { goBack: jest.fn(), push: jest.fn() },
      router: { location: { pathname: '/' } }
    };

    wrapper = shallow(
      <Page {...pageProps}>
        <div />
      </Page>
    );

    wrapperInstance = wrapper.instance();
  });

  it('should render properly', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render styles properly', () => {
    Object.values(Styles).forEach(Component => {
      expect(toJson(shallow(<Component />))).toMatchSnapshot();
    });

    expect(toJson(shallow(<Styles.Container hideBoxShadow />))).toMatchSnapshot();
  });

  it('should call logoutUser action and push to login', () => {
    wrapper.setProps({
      ...pageProps,
      history: { ...pageProps.history },
      router: { location: { pathname: '/home' } }
    });

    const spy = jest.spyOn(pageProps.actions, 'logoutUser');
    const spy2 = jest.spyOn(pageProps.history, 'push');

    wrapperInstance.handleLogout();

    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalledWith('/');

    spy.mockReset();
    spy.mockRestore();
    spy2.mockReset();
    spy2.mockRestore();
  });

  describe('Notification', () => {
    it('should render Notification with isOpen true if notify.title has length > 0', () => {
      wrapper.setProps({ notify: { title: 'mockTitle' } });
      expect(wrapper.find(Notification).prop('isOpen')).toBe(true);
    });

    it('should render Notification with isOpen false if notify.title has length > 0', () => {
      wrapper.setProps({ notify: { title: '' } });
      expect(wrapper.find(Notification).prop('isOpen')).toBe(false);
    });

    it('should call closeNotification and hideMessage in Notification onClick function', () => {
      const spy = jest.spyOn(pageProps, 'onCloseNotification');
      const spy2 = jest.spyOn(pageProps.actions, 'hideMessage');
      wrapper.setProps({ notify: { title: 'mockTitle' } });
      wrapper.find(Notification).shallow().find('.close').simulate('click');

      expect(spy).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
      spy.mockReset();
      spy.mockRestore();
      spy2.mockReset();
      spy2.mockRestore();
    });
  });

  describe('logoutButton', () => {
    it('should not push "/" to history if handleLogout is called while userSession is defined and pathName is "/"', () => {
      global.sessionStorage.setItem('userProfile', {});
      const spy = jest.spyOn(pageProps.history, 'push');
      wrapper.find(Header).shallow().find('.logout-btn').simulate('click');
      expect(spy).not.toHaveBeenCalled();
      spy.mockReset();
      spy.mockRestore();
    });
  });

  describe('componentWillMount', () => {
    it('should call clearResults and clearCart actions if current location is "/"', () => {
      const spy = jest.spyOn(pageProps.actions, 'clearResults');
      const spy2 = jest.spyOn(pageProps.actions, 'clearCart');
      spy.mockReset();
      spy2.mockReset();

      wrapper.setProps({
        router: { location: { pathname: '/' } }
      });
      wrapper.instance().componentWillMount();

      expect(spy).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();

      spy.mockReset();
      spy.mockRestore();
      spy2.mockReset();
      spy2.mockRestore();
    });

    it('should call loadConfig actions when page loads', () => {
      const spy = jest.spyOn(pageProps.actions, 'loadConfig');
      spy.mockReset();

      wrapper.instance().componentWillMount();

      expect(spy).toHaveBeenCalled();
      spy.mockReset();
      spy.mockRestore();
    });

    it('should call clearResults and clearCart actions if current location is "/home"', () => {
      const spy = jest.spyOn(pageProps.actions, 'clearResults');
      const spy2 = jest.spyOn(pageProps.actions, 'clearCart');
      spy.mockReset();
      spy2.mockReset();

      wrapper.setProps({
        router: { location: { pathname: '/home' } }
      });
      wrapper.instance().componentWillMount();

      expect(spy).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();

      spy.mockReset();
      spy.mockRestore();
      spy2.mockReset();
      spy2.mockRestore();
    });

    it('should not call clearResults and clearCart actions if current location is not "/" or "/home"', () => {
      const spy = jest.spyOn(pageProps.actions, 'clearResults');
      const spy2 = jest.spyOn(pageProps.actions, 'clearCart');
      spy.mockReset();
      spy2.mockReset();

      wrapper.setProps({
        history: { ...pageProps.history },
        router: { location: { pathname: '/orderParts' } }
      });
      wrapper.instance().componentWillMount();

      expect(spy).not.toHaveBeenCalled();
      expect(spy2).not.toHaveBeenCalled();

      spy.mockReset();
      spy.mockRestore();
      spy2.mockReset();
      spy2.mockRestore();
    });
  });

  describe('handleLogoClick', () => {
    it('should push home to history on handleLogoClick call', () => {
      const spy = jest.spyOn(pageProps.history, 'push');
      wrapper.instance().handleLogoClick();
      expect(spy).toHaveBeenCalledWith('/home');
      spy.mockReset();
    });
  });
});
