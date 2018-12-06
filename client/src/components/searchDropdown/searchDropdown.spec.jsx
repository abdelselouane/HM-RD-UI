/* global describe, document, beforeAll, it, expect, jest */
import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import 'jest-styled-components';

import SearchDropdown from './index';
import * as Styles from './styles';

import Table from '../table';

describe('<SearchDropdown />', () => {
  let wrapper;
  let props;
  let mockElement;

  beforeAll(() => {
    React.createRef = jest.fn(() => ({
      current: {
        focus: jest.fn(),
        contains: jest.fn()
          .mockReturnValueOnce(false)
          .mockReturnValueOnce(true)
      }
    }));

    ReactDOM.createPortal = jest.fn();

    mockElement = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      setAttribute: jest.fn()
    };

    document.querySelector = jest.fn(() => mockElement);

    props = {
      columns: [
        {
          key: 'mockData',
          name: 'Mock Data'
        }
      ],
      parentSelector: 'mockElementId',
      rows: [
        { mockData: 'mockValue' }
      ],
      searchKey: 'mockData',
      className: 'mock-classname',
      handleInputChange: jest.fn(),
      handleSelectClick: jest.fn()
    };

    wrapper = shallow(<SearchDropdown {...props} />);
  });

  it('should render properly', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
    const instance = wrapper.instance();
    expect(toJson(shallow(instance.renderDropdown()))).toMatchSnapshot();
  });

  it('should render styles properly', () => {
    Object.values(Styles).forEach(Component => {
      expect(toJson(shallow(<Component />))).toMatchSnapshot();
    });
  });

  it('should call addEventListener on componentWillMount', () => {
    const instance = wrapper.instance();
    const spy = jest.spyOn(mockElement, 'addEventListener');
    instance.componentWillMount();
    expect(spy).toHaveBeenCalledWith('mousedown', instance.handleCloseDropdown, false);
  });

  it('should call removeEventListener on componentWillUnmount', () => {
    const instance = wrapper.instance();
    const spy = jest.spyOn(mockElement, 'removeEventListener');
    instance.componentWillUnmount();
    expect(spy).toHaveBeenCalledWith('mousedown', instance.handleCloseDropdown, false);
  });

  it('should set showDropdown to false in handleCloseDropdown if dropdownRef.current.contains(target) is true', () => {
    // React.createRef().current.contains.mockReturnValueOnce(false);
    wrapper.setState({ showDropdown: true });
    const instance = wrapper.instance();
    instance.handleCloseDropdown({ target: 'mock target' });
    expect(instance.state.showDropdown).toBe(false);
  });

  it('should not change showDropdown in handleCloseDropdown if dropdownRef.current.contains(target) is false', () => {
    // React.createRef().current.contains.mockReturnValueOnce(true);
    wrapper.setState({ showDropdown: true });
    const instance = wrapper.instance();
    instance.handleCloseDropdown({ target: 'mock target' });
    expect(instance.state.showDropdown).toBe(true);
  });

  it('should set showDropdown to true in handleFocus', () => {
    wrapper.setState({ showDropdown: false });
    const instance = wrapper.instance();
    instance.handleFocus();
    expect(instance.state.showDropdown).toBe(true);
  });

  it('should set showDropdown to false in handleRowClick', () => {
    wrapper.setState({ showDropdown: true });
    const instance = wrapper.instance();
    const row = instance.getOptions()[0];
    instance.handleRowClick(row);
    expect(instance.state.showDropdown).toBe(false);
  });

  it('should set showDropdown to false and call props.handleSelectClick if defined in handleRowClick', () => {
    const newProps = {
      ...props,
      handleSelectClick: jest.fn()
    };
    wrapper.setProps(newProps);
    const spy = jest.spyOn(newProps, 'handleSelectClick');
    const instance = wrapper.instance();
    const row = instance.getOptions()[0];
    instance.handleRowClick(row);
    expect(spy).toHaveBeenCalledWith({ key: 'mockValue', mockData: 'mockValue' });
  });

  it('should set searchValue in handleInputChange', () => {
    wrapper.setState({ searchValue: '' });
    const instance = wrapper.instance();
    instance.handleInputChange('searchValue', 'a');
    expect(instance.state.searchValue).toBe('a');
  });

  it('should call props.handleInputChange if defined in handleInputChange', () => {
    const newProps = {
      ...props,
      handleInputChange: jest.fn()
    };
    wrapper.setProps(newProps);
    const spy = jest.spyOn(newProps, 'handleInputChange');
    const instance = wrapper.instance();
    instance.handleInputChange('mockId', 'mockValue');
    expect(spy).toHaveBeenCalledWith('mockId', 'mockValue');
    spy.mockReset();
    spy.mockRestore();
  });

  it('should set state.portalElement after componentDidMount', () => {
    wrapper.setState({ portalElement: null });
    const instance = wrapper.instance();
    ReactDOM.createPortal.mockReturnValueOnce(instance.renderDropdown());
    const portalSpy = jest.spyOn(ReactDOM, 'createPortal');
    const elementSpy = jest.spyOn(mockElement, 'setAttribute');

    instance.componentDidMount();

    expect(elementSpy).toHaveBeenCalledWith('style', 'position: relative');
    expect(instance.state.portalElement).toBe(mockElement);
    expect(portalSpy).toHaveBeenCalledWith(instance.renderDropdown(), mockElement);
  });

  describe('getOptions', () => {
    it('should only encapsulate matching characters from searchValue and row[searchKey] in a strong anchor', () => {
      wrapper.setState({ searchValue: 'mock' });
      const instance = wrapper.instance();
      let optionSearchElement = instance.getOptions()[0][instance.props.searchKey];
      expect(shallow(optionSearchElement).find('strong').text()).toBe('mock');

      wrapper.setState({ searchValue: '' });
      optionSearchElement = instance.getOptions()[0][instance.props.searchKey];
      expect(shallow(optionSearchElement).find('strong').text()).toHaveLength(0);
    });
  });

  describe('renderDropdown', () => {
    it('should give table no options if showDropdown is false', () => {
      wrapper.setState({ showDropdown: false });
      const instance = wrapper.instance();
      const DropdownWrapper = shallow(instance.renderDropdown());
      expect(DropdownWrapper.find(Table).props().rows).toHaveLength(0);
    });
  });
});
