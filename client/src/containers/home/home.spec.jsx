/* global describe, beforeAll, jest, it, expect */
import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { Home } from './home';

import Page from '../../components/page';

describe('<Home />', () => {
  let spy;
  let wrapper;
  let wrapperInstance;
  let history;
  let props;

  beforeAll(() => {
    history = { push: () => {}, location: { pathname: '' } };
    props = {
      config: {
        partsFinderUrl: 'mockUrl'
      },
      history
    };

    wrapper = shallow(<Home {...props} />);
    wrapperInstance = wrapper.instance();
  });

  it('should render properly', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render <Page/> component', () => {
    expect(wrapper.find(Page)).toHaveLength(1);
  });

  it('should push workOrders to history on Work Orders tileFunction call', () => {
    spy = jest.spyOn(history, 'push');
    wrapperInstance.tiles[1].tileFunction();
    expect(spy).toHaveBeenCalledWith('/workOrders');
    spy.mockReset();
    spy.mockRestore();
  });

  it('should push orderParts to history on Order Parts tileFunction call', () => {
    spy = jest.spyOn(history, 'push');
    wrapperInstance.tiles[2].tileFunction();
    expect(spy).toHaveBeenCalledWith('/orderParts');
    spy.mockReset();
    spy.mockRestore();
  });

  it('should push orderHistory to history on Order History tileFunction call', () => {
    spy = jest.spyOn(history, 'push');
    wrapperInstance.tiles[3].tileFunction();
    expect(spy).toHaveBeenCalledWith('/orderHistory');
    spy.mockReset();
    spy.mockRestore();
  });

  it('should push inventory to history on Inventory tileFunction call', () => {
    spy = jest.spyOn(history, 'push');
    wrapperInstance.tiles[4].tileFunction();
    expect(spy).toHaveBeenCalledWith('/inventory');
    spy.mockReset();
    spy.mockRestore();
  });

  it('should call open new tab with partsFinderUrl on Parts Finder tileFunction call', () => {
    global.open = jest.fn();
    wrapperInstance.tiles[0].tileFunction();
    expect(global.open).toHaveBeenCalledWith(props.config.partsFinderUrl, '_blank');
  });
});
