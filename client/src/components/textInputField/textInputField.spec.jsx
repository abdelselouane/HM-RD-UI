/* global describe, beforeAll, it, expect, jest */
import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import TextInputField from './index';

describe('<TextInputField />', () => {
  let wrapper;
  let props;

  beforeAll(() => {
    React.createRef = jest.fn(() => ({ current: { focus: jest.fn() } }));

    props = {
      className: 'mock-class-name',
      id: 'mockTextInputField',
      onChange: jest.fn(),
      setFocusOnMount: false
    };

    wrapper = shallow(<TextInputField {...props} />);
  });

  it('should render properly', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
    wrapper.setProps({
      icon: {
        className: 'mock_icon'
      }
    });
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('it should call focus on inputRef.current if setFocusOnMount is true', () => {
    wrapper.setProps({
      setFocusOnMount: true
    });
    const instance = wrapper.instance();
    const spy = jest.spyOn(instance.inputRef.current, 'focus');
    instance.componentDidMount();
    expect(spy).toHaveBeenCalled();
  });

  it('should call onChange function on input change', () => {
    const spy = jest.spyOn(props, 'onChange');
    wrapper
      .find('input.mock-class-name')
      .simulate('change', { target: { value: '123' } });

    expect(spy).toHaveBeenCalledWith('mockTextInputField', '123');
    spy.mockReset();
    spy.mockRestore();
  });
});
