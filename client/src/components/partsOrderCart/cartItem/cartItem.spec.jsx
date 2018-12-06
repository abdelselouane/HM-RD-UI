/* global beforeAll, beforeEach, describe, expect, it, jest */
import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { CartItem } from './cartItem';
import Counter from '../../counter';

describe('<CartItem />', () => {
  let wrapper;
  let spy;
  let props;
  let part;

  beforeAll(() => {
    part = {
      partNbr: 'mockPartNumber',
      partDescription: '&amp; mockDescription',
      brandName: 'mockbrandName',
      quantity: 1
    };

    spy = null;
  });

  beforeEach(() => {
    props = {
      ...part,
      handleAdjustQuantity: jest.fn(),
      handleRemoveFromCart: jest.fn()
    };

    wrapper = shallow(<CartItem {...props} />);
  });

  it('should render properly', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render escaped part partDescription', () => {
    expect(wrapper.find('.part-desc').text()).toBe('& mockDescription');
  });

  it('should render part number', () => {
    expect(wrapper.find('.part-nbr').text()).toBe('mockPartNumber');
  });

  it('should render qty label', () => {
    expect(wrapper.find('.qty-label').text()).toBe('Qty');
  });

  it('should render Counter', () => {
    expect(wrapper.find(Counter)).toHaveLength(1);
  });

  it('should render remove button with label', () => {
    expect(wrapper.find('.remove-btn').text()).toBe('Remove');
    expect(wrapper.find('.remove-btn .icon_trash')).toHaveLength(1);
  });

  it('should call handleRemoveFromCart when remove-btn is clicked', () => {
    spy = jest.spyOn(props, 'handleRemoveFromCart');
    wrapper.find('.remove-btn').simulate('click');
    expect(spy).toHaveBeenCalledWith(part);
  });
});
