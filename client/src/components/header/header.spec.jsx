/* global beforeAll, describe, it, expect, jest */
import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import 'jest-styled-components';

import Header from './index';

describe('<Header />', () => {
  let wrapper;
  let props;
  let userProfile;

  beforeAll(() => {
    userProfile = {
      full_name: 'test user',
      id: 'testLDAP',
      groups: [{
        cn: 'Repair Depot Admin',
        dn: 'cn=Repair Depot Admin, ou=st9100, o=homedepot.com, c=US'
      }]
    };
    props = {
      showActions: false,
      handleLogoutClick: jest.fn(),
      handleLogoClick: jest.fn(),
      handleAdminClick: jest.fn(),
      userProfile: null
    };
    wrapper = mount(<Header {...props} />);
  });

  it('should render properly', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
    wrapper.setProps({ ...props, userProfile, showActions: true });
    expect(toJson(wrapper)).toMatchSnapshot();
    wrapper.setProps({ showAdmin: true });
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render Home Depot Logo as button if userProfile showActions', () => {
    wrapper.setProps({ ...props });
    const headerIcon = wrapper.find('div.header-logo');
    expect(headerIcon).toHaveLength(1);
    expect(headerIcon.prop('onClick')).not.toBeDefined();
    expect(wrapper.find('i.icon_homedepot')).toHaveLength(1);
  });

  it('should render product info', () => {
    expect(wrapper.find('.product-info').text()).toBe('Repair Depot');
  });

  it('should render username and logout if prop showActions is false', () => {
    wrapper.setProps({ ...props, userProfile, showActions: true });
    expect(wrapper.find('.header-actions .username').text()).toBe('testLDAP');
    expect(wrapper.find('.header-actions .logout-btn')).toHaveLength(1);
  });

  it('should call handleLogoutClick on logout-btn click', () => {
    const spy = jest.spyOn(props, 'handleLogoutClick');
    wrapper.find('.logout-btn').simulate('click');
    expect(spy).toHaveBeenCalled();
    spy.mockReset();
    spy.mockRestore();
  });

  it('should not render username and logout if prop showActions is false', () => {
    wrapper.setProps({ ...props, userProfile, showActions: false });
    expect(wrapper.find('.header-actions .username')).toHaveLength(0);
    expect(wrapper.find('.header-actions .logout-btn')).toHaveLength(0);
  });

  it('it should not show admin button when userprofile is null', () => {
    wrapper.setProps({ ...props, userProfile: null, showActions: false });
    expect(wrapper.find('.admin-btn')).toHaveLength(0);
  });

  it('it should have an admin button', () => {
    const spy = jest.spyOn(props, 'handleAdminClick');
    wrapper.setProps({ ...props, userProfile });
    expect(wrapper.find('.admin-btn')).toHaveLength(1);
    wrapper.find('.admin-btn').simulate('click');
    expect(spy).toHaveBeenCalled();
  });

  it('it should not show admin button when userprofile group is does not match ', () => {
    userProfile.groups = [];
    wrapper.setProps({ ...props, userProfile, showActions: false });
    expect(wrapper.find('.admin-btn')).toHaveLength(0);
  });
});
