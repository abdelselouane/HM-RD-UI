/* describe, it */
import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import Notification from './index';

describe('<Notification />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      title: 'mockTitle',
      className: 'mock-class',
      onClick: jest.fn(),
      isOpen: true
    };

    wrapper = shallow(<Notification {...props} />);
  });

  it('should render properly', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render message content if isOpen is true', () => {
    wrapper.setProps({ isOpen: true });
    expect(wrapper.find('.banner.open .message')).toHaveLength(1);
  });

  it('should not render message content if isOpen is false', () => {
    wrapper.setProps({ isOpen: false });
    expect(wrapper.find('.banner.open .message')).toHaveLength(0);
  });

  it('should call button function on click', () => {
    const spy = jest.spyOn(props, 'onClick');
    wrapper.setProps({ isOpen: true });
    wrapper.find('.close').simulate('click');
    expect(spy).toHaveBeenCalled();
  });
});
