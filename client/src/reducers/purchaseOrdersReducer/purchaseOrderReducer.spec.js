/* global describe, it, expect */
import {
  GET_PURCHASE_ORDERS_SUCCESS,
  GET_PURCHASE_ORDERS_FAILURE
} from '../../constants/actionTypes';
import purchaseOrdersReducer, { initialState } from './index';

describe('purchaseOrdersReducer', () => {
  const mockPurchaseOrder = [
    {
      orderCreatedDate: '2018-09-18',
      workOrderNbr: '',
      purchaseOrderNbr: '9710700070',
      purchaseOrderStatDesc: 'SUBMITTED',
      partsOrderId: 7,
      partsDetails: [
        {
          partNbr: '450067-2',
          partDescription: 'Base, Bo4556K',
          quantityOrdered: 1,
          brandName: 'Makita',
          quantityReceived: 0,
          brandNbr: 1001
        }
      ]
    }
  ];

  const action = {};

  it('properly captures a dispatch for GET_PURCHASE_ORDERS_SUCCESS', () => {
    action.type = GET_PURCHASE_ORDERS_SUCCESS;
    action.payload = [mockPurchaseOrder];
    expect(purchaseOrdersReducer(initialState, action)).toMatchObject({
      orders: [...action.payload],
      error: false
    });

    const state = {
      orders: [],
      error: true
    };
    expect(purchaseOrdersReducer(state, action)).toMatchObject({
      orders: [...action.payload],
      error: false
    });
  });

  it('properly returns state for GET_PURCHASE_ORDERS_FAILURE', () => {
    action.type = GET_PURCHASE_ORDERS_FAILURE;
    expect(purchaseOrdersReducer(initialState, action)).toMatchObject({
      orders: [],
      error: true
    });

    const state = { orders: [mockPurchaseOrder] };
    expect(purchaseOrdersReducer(state, action)).toMatchObject({
      orders: [mockPurchaseOrder],
      error: true
    });
  });

  it('properly return state for the undefined action type', () => {
    action.type = 'UNDEFINED_ACTION_TYPE';
    expect(purchaseOrdersReducer(undefined, action)).toEqual(initialState);

    const state = {
      orders: [mockPurchaseOrder]
    };
    expect(purchaseOrdersReducer(state, action)).toEqual(state);
  });

  it('properly captures displatch for UPDATE_RECEIVE_PART_ORDER', () => {
      action.type = 'UPDATE_RECEIVE_PART_ORDER';
      expect(purchaseOrdersReducer(undefined, action)).toMatchObject({
        ...initialState,
        error: false
      });
  });

  it('properly captures displatch for UPDATE_RECEIVE_PART_ORDER_FAILURE', () => {
    const state = {
      orders: [{test}],
      error: true
    };
      action.type = 'UPDATE_RECEIVE_PART_ORDER_FAILURE';
      expect(purchaseOrdersReducer(state, action)).toMatchObject({ ...state, error : true});
  });
});
