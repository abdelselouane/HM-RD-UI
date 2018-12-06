/* global describe, beforeAll, it, expect */
import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { Inventory } from './inventory';
import Tabs from '../../components/tabs';
import * as Styles from './styles';

describe('<Inventory />', () => {
  let wrapper;
  let props;

  beforeAll(() => {
    wrapper = shallow(<Inventory {...props} />);
  });

  it('should render properly', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render styles properly', () => {
    Object.values(Styles).forEach(Component => {
      expect(toJson(shallow(<Component />))).toMatchSnapshot();
    });
  });

  it('should render receive orders tab', () => {
    expect(wrapper.find(Tabs).props().tabs[1].component.displayName).toBe('Connect(ReceiveOrders)');
  });
});
