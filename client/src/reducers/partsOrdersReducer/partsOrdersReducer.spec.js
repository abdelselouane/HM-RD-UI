/* global describe, beforeEach, it, expect */
import {
  GET_PARTS_ORDERS_SUCCESS
} from '../../constants/actionTypes';
import partsOrdersReducer, { initialState } from './index';

describe('partsOrdersReducer', () => {
  const action = {
    type: null,
    payload: [
      {
        partNbr: 'mock123',
        partDescription: 'test',
        brandName: 'v123'
      }
    ],
    error: false,
    isLoading: false
  };

  beforeEach(() => {
    action.type = null;
  });

  it('properly captures a dispatch for GET_PARTS_ORDERS_SUCCESS', () => {
    action.type = GET_PARTS_ORDERS_SUCCESS;
    expect(partsOrdersReducer(initialState, action)).toMatchObject({
      orders: [
        {
          partNbr: 'mock123',
          partDescription: 'test',
          brandName: 'v123'
        }
      ],
      error: false,
      isLoading: false
    });
  });


  it('properly return state for the undefined action type', () => {
    action.type = 'UNDEFINED_ACTION_TYPE';

    expect(partsOrdersReducer(undefined, action)).toEqual(initialState);
  });
});
