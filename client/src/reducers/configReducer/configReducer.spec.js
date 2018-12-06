/* globals describe, beforeEach, it, expect */
import {
  LOAD_CONFIG,
  LOAD_CONFIG_ERROR
} from '../../constants/actionTypes';
import configReducer from './index';

describe('configReducer', () => {
  let action;
  let initialState;
  let config;

  beforeEach(() => {
    action = {
      type: null
    };

    config = {
      projectInfo: {
        appName: 'mockAppName'
      },
      partsFinderUrl: 'mockPartsFinderUrl',
      partsServiceUrl: 'mockPartsServiceUrl'
    };

    initialState = {
      appName: '',
      partsFinderUrl: '',
      partsServiceUrl: '',
      error: false
    };
  });

  it('properly captures a dispatch for LOAD_CONFIG', () => {
    action.type = LOAD_CONFIG;
    action.payload = config;

    expect(configReducer(initialState, action)).toEqual({
      appName: 'mockAppName',
      partsFinderUrl: 'mockPartsFinderUrl',
      partsServiceUrl: 'mockPartsServiceUrl',
      error: false
    });
  });

  it('properly captures a dispatch for LOAD_CONFIG_ERROR', () => {
    action.type = LOAD_CONFIG_ERROR;

    expect(configReducer(initialState, action)).toEqual({
      appName: '',
      partsFinderUrl: '',
      partsServiceUrl: '',
      error: true
    });
  });
});
