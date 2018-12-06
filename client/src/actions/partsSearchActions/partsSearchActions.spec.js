/* global describe, afterEach, it, expect */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import { partsServiceUrl } from '../../utils/apiHelpers';
import * as partsSearchAction from '.';
import {
  PARTS_SEARCH_START,
  PARTS_SEARCH_ERROR,
  CLEAR_RESULTS
} from '../../constants/actionTypes';
import { initialState } from '../../reducers/partsSearchReducer';

const partsSearchInitialState = { partsSearch: initialState };
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Parts Search Actions', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  describe('searchParts action', () => {
    it('should dispatch PARTS_SEARCH on success api response with result data', () => {
      const searchInput = 'B20';
      const resultsNock = nock(partsServiceUrl)
        .get('/getParts')
        .query({ partNbr: 'B20', noOfRows: 7 })
        .reply(200, [
          {
            partNbr: 'B2011',
            partDescription: 'Test',
            brandName: 'brandName'
          }
        ]);
      const store = mockStore();

      return store
        .dispatch(partsSearchAction.searchParts(searchInput, 7))
        .then(() => {
          expect(resultsNock.isDone()).toBeTruthy();
        });
    });

    it('should dispatch PARTS_SEARCH on success api response with out result data', () => {
      const searchInput = 'B20XYZ';
      const resultsNock = nock(partsServiceUrl)
        .get('/getParts')
        .query({ partNbr: 'B20XYZ' })
        .reply(204);
      const store = mockStore();

      return store
        .dispatch(partsSearchAction.searchParts(searchInput))
        .then(() => {
          expect(resultsNock.isDone()).toBeTruthy();
        });
    });


    it('should dispatch PARTS_SEARCH_ERROR on failure api response', () => {
      const searchInput = 'B20XYZ';
      nock(partsServiceUrl)
        .get('/getParts')
        .query({ partNbr: 'B20XYZ' })
        .reply(500, {});
      const store = mockStore();

      return store
        .dispatch(partsSearchAction.searchParts(searchInput))
        .then(() => {
          expect(store.getActions()).toEqual([
            { type: PARTS_SEARCH_START },
            { type: PARTS_SEARCH_ERROR }
          ]);
        });
    });

    it('should dispatch PARTS_SEARCH_ERROR on error api response', () => {
      const searchInput = 'B20XYZ';
      nock(partsServiceUrl)
        .get('/getParts')
        .query({ partNbr: 'B20XYZ' })
        .replyWithError('something awful happened');
      const store = mockStore();

      return store
        .dispatch(partsSearchAction.searchParts(searchInput))
        .then(() => {
          expect(store.getActions()).toEqual([
            { type: PARTS_SEARCH_START },
            { type: PARTS_SEARCH_ERROR }
          ]);
        });
    });
  });

  describe('clearResults action', () => {
    it('should dispatch CLEAR_RESULTS when results array is not empty', () => {
      const store = mockStore({
        partsSearch: { results: [{ partNbr: 'mockPartNumber' }] }
      });
      store.dispatch(partsSearchAction.clearResults());
      expect(store.getActions()).toEqual([{ type: CLEAR_RESULTS }]);
    });

    it('should not dispatch CLEAR_RESULTS when results array is empty', () => {
      const store = mockStore(partsSearchInitialState);
      store.dispatch(partsSearchAction.clearResults());
      expect(store.getActions()).not.toEqual([{ type: CLEAR_RESULTS }]);
    });
  });
});
