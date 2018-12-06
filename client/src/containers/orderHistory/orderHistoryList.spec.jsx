/* global describe, beforeAll, it, expect, jest */
import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import * as Styles from './styles';

import { OrderHistoryList } from './orderHistoryList';

describe('<OrderHistoryList />', () => {
  let wrapper;
  let props;

  beforeAll(() => {
    props = {
      actions: {
        getPartsOrders: jest.fn()
      },
      history: {
        push: jest.fn()
      },
      orders: [
        {
          orderCreatedDate: '1970-12-02',
          partsOrderId: 2,
          workOrderNbr: '',
          partsDetails: [
            {
              partDescription: 'mockDescription3'
            }
          ]
        },
        {
          orderCreatedDate: '1970-12-01',
          partsOrderId: 1,
          workOrderNbr: '123456789',
          partsDetails: [
            {
              partDescription: 'mockDescription1'
            },
            {
              partDescription: 'mockDescription2'
            }
          ]
        }
      ]
    };

    wrapper = shallow(<OrderHistoryList {...props} />);
  });

  it('should render properly', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should call getPartsOrder on componentWillMount', () => {
    const spy = jest.spyOn(props.actions, 'getPartsOrders');
    wrapper.instance().componentWillMount();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
    spy.mockReset();
  });

  it('should return rows in getRows call', () => {
    const rows = wrapper.instance().getRows(props.orders);
    expect(rows).toMatchObject([
      {
        key: 2,
        orderCreatedDate: 'Dec 02, 1970',
        partsOrderId: 2,
        workOrderNbr: <em>Not Provided</em>,
        orderDesc: 'mockDescription3'
      },
      {
        key: 1,
        orderCreatedDate: 'Dec 01, 1970',
        partsOrderId: 1,
        workOrderNbr: '123456789',
        orderDesc: 'mockDescription1, mockDescription2'
      }
    ]);
  });

  it('should call history.push to order details on handleRowClick', () => {
    const spy = jest.spyOn(props.history, 'push');
    const partsOrderId = 'mock';

    wrapper.instance().handleRowClick({});
    expect(spy).not.toHaveBeenCalled();

    wrapper.instance().handleRowClick({ partsOrderId });
    expect(spy).toHaveBeenCalledWith('orderHistory/mock');
    spy.mockRestore();
    spy.mockReset();
  });

  it('should render styles properly', () => {
    Object.values(Styles).forEach(Component => {
      expect(toJson(shallow(<Component />))).toMatchSnapshot();
    });
  });
});
