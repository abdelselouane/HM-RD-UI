/* global describe, beforeAll, jest, it, expect */
import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import 'jest-styled-components';

import Counter from './index';

describe('<Counter />', () => {
  let wrapper;
  let props;
  let spy;

  spy = null;

  beforeAll(() => {
    props = {
      name: 'mockCounter',
      handleChangeValue: jest.fn()
    };

    wrapper = mount(<Counter {...props} />);
  });

  it('should render properly', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should call handleChangeValue on increment button click', () => {
    spy = jest.spyOn(props, 'handleChangeValue');
    wrapper.setProps({ value: 1 });
    wrapper.find('button.counter-increment').simulate('click');
    expect(spy).toHaveBeenCalledWith(props.name, 2);
    spy.mockReset();
    spy.mockRestore();
  });

  it('should call handleChangeValue on decrement button click', () => {
    spy = jest.spyOn(props, 'handleChangeValue');
    wrapper.setProps({ value: 2 });
    wrapper.find('button.counter-decrement').simulate('click');
    expect(spy).toHaveBeenCalledWith(props.name, 1);
    spy.mockReset();
    spy.mockRestore();
  });

  it('should not change value on input changes', () => {
    wrapper.setProps({ value: 1 });
    wrapper
      .find('.counter-value')
      .simulate('change', { target: { value: 100 } });
    expect(wrapper.prop('value')).toBe(1);
  });

  it('should have quantity with floating zero', () => {
    wrapper.setProps({ value: 1 });
    expect(wrapper.find('#mockcounter-qty').prop('value')).toBe('01');
  });

  it('should not have floating zero when the quantity is greater than 9', () => {
    wrapper.setProps({ value: 10 });
    expect(wrapper.find('#mockcounter-qty').prop('value')).toBe('10');
  });
});
