/* global describe, beforeEach, it, expect */
import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import 'jest-styled-components';

import * as Styles from './styles';

import { OrderDetails } from './orderDetails';

describe('<OrderDetails />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      match: {
        params: {
          partsOrderId: '2'
        }
      },
      orders: [
        {
          orderCreatedDate: '1970-12-02',
          partsOrderId: 2,
          workOrderNbr: '',
          partsDetails: [
            {
              purchaseOrderNbr: '971070001',
              purchaseOrderStatDesc: 'SUBMITTED',
              partDescription: 'mockDescription3',
              partNbr: 'abc-123',
              brandName: 'mockbrand',
              quantity: 1
            },
            {
              purchaseOrderNbr: '971070001',
              purchaseOrderStatDesc: 'SUBMITTED',
              partDescription: 'mockDescription4',
              partNbr: 'cba-321',
              brandName: 'mockbrand',
              quantity: 2
            },
            {
              purchaseOrderNbr: '971070002',
              purchaseOrderStatDesc: 'SUBMITTED',
              partDescription: 'mockDescription1',
              partNbr: '01-23456',
              brandName: 'brandy',
              quantity: 4
            },
            {
              purchaseOrderNbr: '971070002',
              purchaseOrderStatDesc: 'SUBMITTED',
              partDescription: 'mockDescription2',
              partNbr: '01-09897',
              brandName: 'brandy',
              quantity: 2
            }
          ]
        },
        {
          orderCreatedDate: '1970-12-01',
          partsOrderId: 1,
          workOrderNbr: '123456789',
          partsDetails: [
            {
              purchaseOrderNbr: '971070002',
              purchaseOrderStatDesc: 'SUBMITTED',
              partDescription: 'mockDescription1',
              partNbr: '01-23456',
              brandName: 'brandy',
              quantity: 4
            },
            {
              purchaseOrderNbr: '971070002',
              purchaseOrderStatDesc: 'SUBMITTED',
              partDescription: 'mockDescription2',
              partNbr: '01-09897',
              brandName: 'brandy',
              quantity: 2
            }
          ]
        }
      ]
    };

    wrapper = shallow(<OrderDetails {...props} />);
  });

  it('should render properly for a single Purchase Order', () => {
    wrapper.setProps({ match: { params: { partsOrderId: '1' } } });
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render properly for 2 Purchase Orders', () => {
    wrapper.setProps({ match: { params: { partsOrderId: '2' } } });
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render properly when partsDetails is not defined', () => {
    wrapper.setState({ order: { ...props.orders[0], partsDetails: [] } });
    // console.log(wrapper.state().order);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render properly if partsOrderId is not in the order list', () => {
    wrapper.setProps({ match: { params: { partsOrderId: '8' } } });
    const instance = wrapper.instance();
    instance.componentWillMount();
    expect(instance.state.order).toBe(null);
  });

  it('should render properly if order is null', () => {
    wrapper.setState({ order: null });
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render styles properly', () => {
    Object.values(Styles).forEach(Component => {
      expect(toJson(shallow(<Component />))).toMatchSnapshot();
    });
  });
});
