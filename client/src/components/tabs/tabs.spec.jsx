/* global describe, beforeAll, it, expect, jest */
import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import Tabs from './tabs';

describe('<Tabs />', () => {
  let wrapper;
  let props;
  let mockTabs;

  beforeAll(() => {
    mockTabs = [
      {
        id: 'mock-tab-1',
        displayName: 'Mock Tab 1',
        component:
          (class extends React.Component {
            state = {};
            render() {
              return <div>Mock Tab 1</div>;
            }
          })
      },
      {
        id: 'mock-tab-2',
        displayName: 'Mock Tab 2',
        component: () => <div>Mock Tab 2</div>
      },
      {
        id: 'mock-tab-3',
        displayName: 'Mock Tab 3',
        component: null
      }
    ];

    props = {
      tabs: mockTabs,
      defaultTab: mockTabs[1].id,
      className: 'mock-tabs'
    };

    wrapper = shallow(<Tabs {...props} />);
  });

  it('should render properly', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should set prop hidden to undefined on the default tab & hidden to true on others', () => {
    wrapper.setProps({ defaultTab: mockTabs[1].id, });
    expect(wrapper.instance().state.currentTab).toBe(mockTabs[1].id);
    wrapper = shallow(<Tabs {...props} defaultTab="" />);
    expect(wrapper.instance().state.currentTab).toBe(mockTabs[0].id);
  });

  it('should change the state variable on calling handleTabChange', () => {
    wrapper.setState({
      currentTab: 'mock-tab-1'
    });

    const instance = wrapper.instance();
    instance.handleTabChange('mock-tab-2');
    expect(instance.state.currentTab).toBe('mock-tab-2');
  });

  it('should call handleTabChange method on tab click', () => {
    const instance = wrapper.instance();
    const spy = jest.spyOn(instance, 'handleTabChange');
    const tabOnHandInventory = wrapper.find('#mock-tab-1-tab');
    tabOnHandInventory.simulate('click');
    expect(spy).toHaveBeenCalledWith('mock-tab-1');
  });

  it('should set prop hidden to undefined on the selected tab & hidden to true on others', () => {
    wrapper.setState({
      currentTab: 'mock-tab-1'
    });
    expect(wrapper.find('.mock-tab-1.tabpanel').props().hidden).toBe(false);

    wrapper.setState({
      currentTab: 'mock-tab-3'
    });
    expect(wrapper.find('.mock-tab-3.tabpanel').props().hidden).toBe(false);
  });
});
