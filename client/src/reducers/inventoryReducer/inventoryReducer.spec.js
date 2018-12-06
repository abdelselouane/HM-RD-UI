/* global beforeEach, describe, it, expect */
import { EDIT_ITEM, GET_INVENTORY } from '../../constants/actionTypes';
import inventoryReducer, { initialState } from './index';

describe('inventoryReducer', () => {
  let action;

  beforeEach(() => {
    action = {
      type: null
    };
  });

  it('properly returns a given state', () => {
    action.type = 'MOCK_ACTION';
    expect(inventoryReducer({ items: [] }, action)).toEqual({
      items: []
    });
  });

  it('properly returns initial state', () => {
    action.type = 'MOCK_ACTION';
    expect(inventoryReducer(undefined, action)).toEqual(initialState);
  });

  it('properly captures a dispatch for GET_INVENTORY', () => {
    action.type = GET_INVENTORY;
    action.payload = [
      {
        partNumber: 'QZS-12-A012',
        desc: 'THIS IS A TEST DESC 1',
        brand: 'a1234',
        location: 'A6',
        onHand: '3'
      },
      {
        partNumber: '1KJA-1A2-91',
        desc: 'THIS IS A TEST DESC 2',
        brand: 'xyz90',
        location: 'B7',
        onHand: '12'
      }
    ];

    const mockInitialState = { ...initialState };
    mockInitialState.items = [];

    expect(inventoryReducer(mockInitialState, action)).toEqual({
      items: [
        {
          partNumber: 'QZS-12-A012',
          desc: 'THIS IS A TEST DESC 1',
          brand: 'a1234',
          location: 'A6',
          onHand: '3'
        },
        {
          partNumber: '1KJA-1A2-91',
          desc: 'THIS IS A TEST DESC 2',
          brand: 'xyz90',
          location: 'B7',
          onHand: '12'
        }
      ]
    });
  });

  it('properly captures a dispatch for EDIT_ITEM', () => {
    action.type = EDIT_ITEM;
    action.index = 0;
    action.payload = {
      partNumber: '5KJA-1A2-91',
      desc: 'THIS IS A TEST DESC 10',
      brand: 'xyz90-1',
      location: 'B7',
      onHand: '12'
    };

    const mockInitialState = { items: [{
      partNumber: '5KJA-1A2-91',
      desc: 'THIS IS A TEST DESC 10',
      brand: 'xyz90-1',
      location: 'B8',
      onHand: '14'
    }] };

    expect(inventoryReducer(mockInitialState, action)).toEqual({
      items: [
        {
          partNumber: '5KJA-1A2-91',
          desc: 'THIS IS A TEST DESC 10',
          brand: 'xyz90-1',
          location: 'B7',
          onHand: '12'
        }
      ]
    });
  });

  it('properly captures a dispatch for ADD_ITEM_SUCCESS', () => {
    action.type = 'ADD_ITEM_SUCCESS';
    action.payload = {
      partNbr: 'mockNbr',
      brandNbr: '1001',
      storeNbr: '123',
      availableQuantity: 2,
      allocatedQuantity: 0,
      location: 'somewhere',
      partDescription: 'spark plug',
      brandName: 'mockmock'
    };

    const mockPart2 = {
      partNbr: 'abcd',
      brandNbr: '1002',
      storeNbr: '123',
      availableQuantity: 1,
      allocatedQuantity: 4,
      location: 'somewhere else',
      partDescription: 'frost plug',
      brandName: 'mockmock'
    };

    const mockInitialState = { items: [
      mockPart2
    ] };

    expect(inventoryReducer(mockInitialState, action)).toEqual({
      items: [
        {
          ...action.payload
        },
        mockPart2
      ]
    });
  });
});
