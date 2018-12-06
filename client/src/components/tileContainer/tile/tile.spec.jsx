/* global describe, beforeAll, jest, it, expect */
import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import Tile from './tile';

describe('<Tile />', () => {
  let wrapper;
  let spy;
  let tile;

  beforeAll(() => {
    tile = {
      title: 'Mock Tile',
      className: 'mock-class',
      icon: 'mock-icon',
      index: 0,
      handleMouseEnter: jest.fn(),
      handleTileFunction: jest.fn(),
    };

    wrapper = shallow(<Tile {...tile} />);
  });

  it('should render the tableRow', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should call handleMouseEnter method on mouse enter of tile', () => {
    spy = jest.spyOn(tile, 'handleMouseEnter');
    wrapper.find('.mock-class').simulate('mouseEnter');
    expect(spy).toHaveBeenCalled();
    spy.mockReset();
    spy.mockRestore();
  });

  it('should call handleTileFunction method on click of tile', () => {
    spy = jest.spyOn(tile, 'handleTileFunction');
    wrapper.find('.mock-class').simulate('click');
    expect(spy).toHaveBeenCalled();
    spy.mockReset();
    spy.mockRestore();
  });
});
