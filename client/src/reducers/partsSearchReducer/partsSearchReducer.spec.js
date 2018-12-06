/* global describe, beforeEach, it, expect */
import {
  PARTS_SEARCH,
  PARTS_SEARCH_START,
  PARTS_SEARCH_ERROR,
  CLEAR_RESULTS
} from '../../constants/actionTypes';
import partsSearchReducer, { initialState } from './index';

describe('partsSearchReducer', () => {
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

  it('properly captures a dispatch for PARTS_SEARCH_START', () => {
    action.type = PARTS_SEARCH_START;
    expect(partsSearchReducer(initialState, action)).toMatchObject({
      results: [],
      error: false,
      isLoading: true
    });
  });

  it('properly captures a dispatch for PARTS_SEARCH', () => {
    action.type = PARTS_SEARCH;
    expect(partsSearchReducer(initialState, action)).toMatchObject({
      error: false,
      results: [
        {
          partNbr: 'mock123',
          partDescription: 'test',
          brandName: 'v123'
        }
      ]
    });
  });

  it('properly captures a dispatch for PARTS_SEARCH_ERROR', () => {
    action.type = PARTS_SEARCH_ERROR;
    expect(partsSearchReducer(initialState, action)).toEqual({
      error: true,
      results: [],
      isLoading: false
    });
  });

  it('properly captures a dispatch for CLEAR_RESULTS', () => {
    action.type = CLEAR_RESULTS;
    expect(partsSearchReducer(initialState, action)).toEqual({
      error: false,
      results: [],
      isLoading: false
    });
  });


  it('properly return state for the undefined action type', () => {
    action.type = 'UNDEFINED_ACTION_TYPE';

    expect(partsSearchReducer(undefined, action)).toEqual(initialState);
  });
});
