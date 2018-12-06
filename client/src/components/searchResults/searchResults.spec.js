/* globals jest, describe, beforeAll, it, expect */
import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import SearchResults from './index';
import Table from '../table';

describe('<SearchResults />', () => {
  let wrapper;
  let wrapperInstance;
  let mountWrapper;
  let part;
  let props;

  beforeAll(() => {
    part = {
      partNbr: 'ab-1234',
      partDescription: 'mockDescription',
      brandName: 'mockbrandName'
    };

    props = {
      results: [],
      cart: [],
      handleInputChange: jest.fn()
    };

    wrapper = shallow(<SearchResults {...props} />);
    wrapperInstance = wrapper.instance();

    mountWrapper = mount(<SearchResults {...props} />);
  });

  it('should render properly', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should have label Work Order Number on the page', () => {
    expect(mountWrapper.find('.work-order-number-label').text()).toBe(
      'Work Order Number'
    );
  });

  it('should have input Work Order Number on the page', () => {
    expect(mountWrapper.find('.work-order-number-input')).toHaveLength(1);
  });

  it('should define handleInputChange method', () => {
    expect(wrapperInstance.handleInputChange).toBeDefined();
  });

  it('should call handleInputChange prop and set searchInput state when handleSearchChange class method is called', () => {
    const spy = jest.spyOn(props, 'handleInputChange');
    wrapper.setState({ searchInput: '' });
    wrapperInstance.handleInputChange('searchInput', 'ab');
    expect(spy).toHaveBeenCalled();
    expect(wrapper.state('searchInput')).toBe('ab');
    spy.mockReset();
    spy.mockRestore();
  });

  it('should define columns', () => {
    expect(wrapperInstance.columns).toMatchObject([
      {
        name: 'Part Number',
        key: 'partNbr'
      },
      {
        name: 'Description',
        key: 'partDescription'
      },
      {
        name: 'Brand',
        key: 'brandName'
      }
    ]);
  });

  it('should set key property in rows to partNbr', () => {
    wrapper.setProps({ results: [{ ...part }] });
    expect(wrapper.find(Table).prop('rows')[0].key).toBe(part.partNbr);
  });

  it('should set selected property in rows to true if result item is matched in the cart', () => {
    const mockResults = [
      {
        partNbr: '01-0123',
        partDescription: 'spark plug',
        brandName: 'echo'
      },
      { ...part }
    ];
    const mockCart = [
      { ...part }
    ];
    wrapper.setProps({ results: mockResults, cart: mockCart });
    expect(wrapper.find(Table).prop('rows')[1].selected).toBe(true);
  });

  it('should set selected property in rows to false if result item is not matched in the cart', () => {
    wrapper.setProps({ results: [{ ...part }], cart: [] });
    expect(wrapper.find(Table).prop('rows')[0].selected).toBe(false);
  });

  it('should set showResults prop in Table to false if results is empty and searchInput length is less than 2', () => {
    wrapper.setProps({ results: [] });
    wrapper.setState({ searchInput: '' });
    expect(wrapper.find(Table).prop('showResults')).toBe(false);

    wrapper.setProps({ results: [] });
    wrapper.setState({ searchInput: 'ab' });
    expect(wrapper.find(Table).prop('showResults')).toBe(false);

    wrapper.setProps({ results: [{ ...part }] });
    wrapper.setState({ searchInput: 'a' });
    expect(wrapper.find(Table).prop('showResults')).toBe(false);
  });

  it('should set showResults prop in Table to true if results is not empty and searchInput length is 2 or more', () => {
    wrapper.setProps({ results: [{ ...part }] });
    wrapper.setState({ searchInput: 'ab' });
    expect(wrapper.find(Table).prop('showResults')).toBe(true);
  });

  it('should set showHeader prop in Table to false if results is empty ', () => {
    wrapper.setProps({ results: [] });
    expect(wrapper.find(Table).prop('showHeader')).toBe(false);
  });

  it('should set showHeader prop in Table to true if results is not empty ', () => {
    wrapper.setProps({ results: [{ ...part }] });
    expect(wrapper.find(Table).prop('showHeader')).toBe(true);
  });

  it('should set showCheckbox prop in Table to true', () => {
    expect(wrapper.find(Table).prop('showCheckbox')).toBe(true);
  });

  it('should set showBody prop in Table to true if searchInput length greater than one ', () => {
    wrapper.setState({ searchInput: 'test' });
    expect(wrapper.find(Table).prop('showBody')).toBe(true);
  });

  it('should set showBody prop in Table to false if searchInput length less than two ', () => {
    wrapper.setState({ searchInput: 't' });
    expect(wrapper.find(Table).prop('showBody')).toBe(false);
  });
});
