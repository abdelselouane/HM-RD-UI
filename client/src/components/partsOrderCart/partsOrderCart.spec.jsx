/* global beforeAll, describe, expect, it, jest */
import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import PartsOrderCart from './index';
import CartItem from './cartItem';

describe('<PartsOrderCart />', () => {
  let wrapper;
  let props;
  let part;

  beforeAll(() => {
    part = {
      partNbr: 'mockPartNumber',
      partDescription: 'mockDescription',
      brandName: 'mockBrandName',
      brandNbr: 123
    };

    props = {
      cart: [],
      disableSubmit: false,
      submitOrder: jest.fn()
    };

    wrapper = shallow(<PartsOrderCart {...props} />);
  });

  it('should render properly', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should have cart content div on the page', () => {
    expect(wrapper.find('.cart-content')).toHaveLength(1);
  });

  it('should have submitOrder button on the page', () => {
    expect(wrapper.find('.submit-order').text()).toBe('Place Order');
  });

  it('should have submitOrder button with disbaled state on the page', () => {
    expect(wrapper.find('.submit-order').prop('indeterminate')).toBe('true');
  });

  it('should render CartItem components when cart has items', () => {
    wrapper.setProps({ cart: [part] });
    expect(wrapper.find(CartItem)).toHaveLength(1);
  });

  it('should not render CartItem components when cart is empty', () => {
    wrapper.setProps({ cart: [] });
    expect(wrapper.find(CartItem)).toHaveLength(0);
  });

  it('should call submitOrder on button click', () => {
    const spy = jest.spyOn(props, 'submitOrder');
    wrapper.find('.submit-order').simulate('click');
    expect(spy).toHaveBeenCalled();
  });
});
