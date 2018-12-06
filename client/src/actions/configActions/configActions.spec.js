/* global beforeEach, describe, afterEach, it, expect */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
/* globals beforeAll, describe, it, expect */
import nock from 'nock';
import apiUrl from '../../utils/apiHelpers';
import * as configActions from '.';
import {
  LOAD_CONFIG,
  LOAD_CONFIG_ERROR
} from '../../constants/actionTypes';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Config Actions', () => {
  let store;

  beforeEach(() => {
    store = mockStore();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('config action', () => {
    it('should dispatch LOAD_CONFIG on success api response with result data', () => {      
      const resultsNock = nock(apiUrl)
        .get('/config')
        .reply(200, {});

      return store
        .dispatch(configActions.loadConfig())
        .then(() => {
          expect(resultsNock.isDone()).toBeTruthy();
          expect(store.getActions()).toMatchObject([
            { type: LOAD_CONFIG, payload: {} }
          ]);
        });
    });

    it('should not dispatch LOAD_CONFIG on failure api response', () =>{
      const resultsNock = nock(apiUrl)
        .get('/config')
        .reply(500, {});

      return store
        .dispatch(configActions.loadConfig())
        .then(() => {
          expect(resultsNock.isDone()).toBeTruthy();
          expect(store.getActions()).toMatchObject([
            { type: LOAD_CONFIG_ERROR }
          ]);
        });
    });

  });
});
