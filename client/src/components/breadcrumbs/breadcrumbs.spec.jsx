/* global describe, beforeAll, it, expect, jest */
import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import 'jest-styled-components';

import { Link } from 'react-router-dom';

import * as Styles from './styles';

import ConnectedBreadcrumbs, { Breadcrumbs } from './breadcrumbs';

describe('<Breadcrumbs />', () => {
  let wrapper;
  let props;

  beforeAll(() => {
    props = {
      pathname: '/orderHistory'
    };

    wrapper = shallow(<Breadcrumbs {...props} />);
  });

  it('should render properly', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render styles properly', () => {
    Object.values(Styles).forEach(Component => {
      expect(toJson(shallow(<Component />))).toMatchSnapshot();
    });
  });

  it('should return null if pathname contains only / or /home', () => {
    wrapper.setProps({
      pathname: ''
    });
    expect(wrapper.html()).toBe(null);
    wrapper.setProps({
      pathname: '/'
    });
    expect(wrapper.html()).toBe(null);
    wrapper.setProps({
      pathname: '//'
    });
    expect(wrapper.html()).toBe(null);
    wrapper.setProps({
      pathname: '/home'
    });
    expect(wrapper.html()).toBe(null);
  });

  it('should have home as the initial breadcrumb', () => {
    wrapper.setProps({
      pathname: '/orderParts'
    });
    expect(wrapper.find(Link).at(0).props().to).toBe('/home');
  });

  it('should have the final breadcrumb as a span', () => {
    wrapper.setProps({
      pathname: '/inventory'
    });
    expect(wrapper.find('span')).toHaveLength(1);
  });

  it('should have use "Order #(\\d) Details" if orderHistory is first arg followed by a digit', () => {
    wrapper.setProps({
      pathname: '/orderHistory/2'
    });
    expect(wrapper.find('span').props().children).toBe('Order #2 Details');
  });
});

jest.mock('react-router-dom', () => ({
  Link: props => props.children
}));

describe('<ConnectedBreadcrumbs />', () => {
  let mockStore;
  beforeAll(() => {
    mockStore = configureMockStore();
  });

  it('should use router.location.pathname from redux state', () => {
    const store = mockStore({
      router: { location: { pathname: '/inventory' } }
    });
    const wrapper = mount(
      <Provider store={store}>
        <ConnectedBreadcrumbs />
      </Provider>
    );
    expect(wrapper.find('.breadcrumb').at(0).props().children).toBe('Home');
    expect(wrapper.find('.breadcrumb').at(1).props().children).toBe('Inventory');
  });
});
