/* global describe, beforeEach, it, expect */
import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  CLEAR_CART,
  ADJUST_QUANTITY
} from '../../constants/actionTypes';
import cartReducer from './index';

describe('cartReducer', () => {
  let action;
  let initialState;
  let part;

  beforeEach(() => {
    initialState = { items: [] };
    part = {
      partNbr: 'mock123',
      partDescription: 'test',
      brandName: 'v123'
    };
    action = {
      type: null
    };
  });

  it('should default state to initialState', () => {
    expect(cartReducer(undefined, { type: '' })).toMatchObject({
      ...initialState
    });
  });

  it('should return given state on undefined action in switch-case', () => {
    expect(cartReducer(initialState, { type: '' })).toMatchObject({
      ...initialState
    });
  });

  it('properly captures a dispatch for ADD_TO_CART', () => {
    action.type = ADD_TO_CART;
    action.payload = {
      partNbr: 'mock123',
      partDescription: 'test',
      brandName: 'v123'
    };

    expect(cartReducer(initialState, action)).toEqual({
      items: [
        {
          partNbr: 'mock123',
          partDescription: 'test',
          brandName: 'v123',
          quantity: 1
        }
      ]
    });
  });

  describe('REMOVE_FROM_CART', () => {
    it('properly captures a dispatch for REMOVE_FROM_CART if index is non negative', () => {
      action.type = REMOVE_FROM_CART;
      action.index = 0;
      action.payload = [part];

      const state = { items: [action.payload] };

      expect(cartReducer(state, action)).toEqual(initialState);
    });

    it('properly captures a dispatch for REMOVE_FROM_CART if index is negative', () => {
      action.type = REMOVE_FROM_CART;
      action.index = -1;
      action.payload = [part];

      const state = { items: [action.payload] };

      expect(cartReducer(state, action)).toEqual({
        items: [action.payload]
      });
    });
  });

  it('properly captures a dispatch for CLEAR_CART', () => {
    action.type = CLEAR_CART;

    const state = {
      items: [
        {
          partNbr: 'mock123',
          partDescription: 'test',
          brandName: 'v123',
          quantity: 1
        }
      ]
    };

    expect(cartReducer(state, action)).toEqual({
      items: []
    });
  });

  describe('ADJUST_QUANTITY', () => {
    it('properly captures a dispatch for ADJUST_QUANTITY if index is not negative', () => {
      action = {
        type: ADJUST_QUANTITY,
        index: 0,
        payload: 2
      };

      const state = {
        items: [
          {
            partNbr: 'mock123',
            partDescription: 'test',
            brandName: 'v123',
            quantity: 1
          }
        ]
      };

      expect(cartReducer(state, action)).toEqual({
        items: [
          {
            partNbr: 'mock123',
            partDescription: 'test',
            brandName: 'v123',
            quantity: 2
          }
        ]
      });
    });

    it('properly captures a dispatch for ADJUST_QUANTITY if index is negative', () => {
      action = {
        type: ADJUST_QUANTITY,
        index: -1,
        payload: 2
      };

      const state = {
        items: [
          {
            partNbr: 'mock123',
            partDescription: 'test',
            brandName: 'v123',
            quantity: 1
          }
        ]
      };

      expect(cartReducer(state, action)).toEqual({
        items: [
          {
            partNbr: 'mock123',
            partDescription: 'test',
            brandName: 'v123',
            quantity: 1
          }
        ]
      });
    });
  });
});
