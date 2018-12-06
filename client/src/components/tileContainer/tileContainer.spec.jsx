/* global describe, beforeAll, it, expect, jest */
import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import TileContainer from './tileContainer';

describe('<TileContainer />', () => {
  let wrapper;
  let wrapperInstance;
  let mountedWrapper;
  let mountedWrapperInstance;
  let tiles;

  beforeAll(() => {
    tiles = [
      {
        title: 'Order Parts',
        className: 'order-parts',
        icon: 'tool-wrench',
        tileFunction: jest.fn()
      },
      {
        title: 'Purchase Order History',
        className: 'order-history',
        icon: 'assignment',
        tileFunction: jest.fn()
      },
      {
        title: 'Parts Finder',
        className: 'parts-search',
        icon: 'search',
        tileFunction: jest.fn()
      },
      {
        title: 'Inventory',
        className: 'inventory',
        icon: 'note-list',
        tileFunction: jest.fn()
      }
    ];

    wrapper = shallow(<TileContainer tiles={tiles} />);
    wrapperInstance = wrapper.instance();

    mountedWrapper = mount(<TileContainer tiles={tiles} />);
    mountedWrapperInstance = mountedWrapper.instance();
  });

  it('should render properly', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should set containerRef and call focus in componentDidMount', () => {
    const instance = mountedWrapper.instance();
    instance.containerRef = {
      current: {
        focus: jest.fn()
      }
    };
    instance.render();
    const spy = jest.spyOn(instance.containerRef.current, 'focus');
    instance.componentDidMount();
    expect(spy).toHaveBeenCalled();
  });

  it('Should not change tileIndex on non left or right arrow press', () => {
    wrapperInstance.handleMouseEnter(0);
    expect(wrapperInstance.state.tileIndex).toBe(0);

    wrapper.find('.tile-container').simulate('keyDown', { keyCode: 50 });
    expect(wrapperInstance.state.tileIndex).toBe(0);
  });

  it('Should change tileIndex on left arrow press', () => {
    wrapperInstance.handleMouseEnter(1);
    expect(wrapperInstance.state.tileIndex).toBe(1);

    wrapper.find('.tile-container').simulate('keyDown', { keyCode: 37 });
    expect(wrapperInstance.state.tileIndex).toBe(0);
  });

  it('Should change tileIndex on right arrow press', () => {
    wrapperInstance.handleMouseEnter(0);
    expect(wrapperInstance.state.tileIndex).toBe(0);

    wrapper.find('.tile-container').simulate('keyDown', { keyCode: 39 });
    expect(wrapperInstance.state.tileIndex).toBe(1);
  });

  it('Should change tileIndex to Order parts when right arrow press from parts search tile', () => {
    wrapperInstance.handleMouseEnter(3);
    expect(wrapperInstance.state.tileIndex).toBe(3);

    wrapper.find('.tile-container').simulate('keyDown', { keyCode: 39 });
    expect(wrapperInstance.state.tileIndex).toBe(0);
  });

  it('Should change tileIndex to Parts Search when left arrow press from Order Parts tile', () => {
    wrapperInstance.handleMouseEnter(0);
    expect(wrapperInstance.state.tileIndex).toBe(0);
    wrapper.find('.tile-container').simulate('keyDown', { keyCode: 37 });
    expect(wrapperInstance.state.tileIndex).toBe(3);
  });

  it('Should call tile function when enter pressed', () => {
    wrapperInstance.handleMouseEnter(0);
    wrapperInstance.props.tiles[0].tileFunction = jest.fn();
    wrapper.find('.tile-container').simulate('keyPress', { key: 'Enter' });
    expect(wrapperInstance.props.tiles[0].tileFunction).toHaveBeenCalled();
  });

  it('Should not call tile function when non enter key pressed', () => {
    wrapperInstance.handleMouseEnter(0);
    wrapperInstance.props.tiles[0].tileFunction = jest.fn();
    wrapper.find('.tile-container').simulate('keyPress', { key: 'Delete' });
    expect(wrapperInstance.props.tiles[0].tileFunction).not.toHaveBeenCalled();
  });

  it('should change state of tileIndex when method handleMouseEnter called', () => {
    wrapperInstance.handleMouseEnter(0);
    expect(wrapperInstance.state.tileIndex).toBe(0);
    wrapperInstance.handleMouseEnter(1);
    expect(wrapperInstance.state.tileIndex).toBe(1);
  });

  it('should call handleMouseEnter method on mouse enter of tiles', () => {
    mountedWrapper.find('.repair-tile.order-parts').simulate('mouseEnter');
    expect(mountedWrapperInstance.state.tileIndex).toBe(0);

    mountedWrapper.find('.repair-tile.order-history').simulate('mouseEnter');
    expect(mountedWrapperInstance.state.tileIndex).toBe(1);

    mountedWrapper.find('.repair-tile.parts-search').simulate('mouseEnter');
    expect(mountedWrapperInstance.state.tileIndex).toBe(2);

    mountedWrapper.find('.repair-tile.inventory').simulate('mouseEnter');
    expect(mountedWrapperInstance.state.tileIndex).toBe(3);
  });
});
