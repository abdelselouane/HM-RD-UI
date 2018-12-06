/* global beforeEach, describe, afterEach, it, expect */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import { getFormattedDate } from '../../utils/formatHelper';
import { partsOrdersUrl } from '../../utils/apiHelpers';
import * as partsOrdersActions from '.';
import {
  GET_PARTS_ORDERS_FAILURE,
  CREATE_PARTS_ORDER_START,
  CREATE_PARTS_ORDER_SUCCESS,
  CREATE_PARTS_ORDER_FAILURE,
  GET_PARTS_ORDERS_SUCCESS
} from '../../constants/actionTypes';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Parts Orders Actions', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      cart: {
        items: [
          {
            quantity: 1,
            partNbr: 'P123',
            partDescription: 'mock part desc',
            brandNbr: 123,
            brandName: 'B123'
          }
        ]
      },
      login: {
        storeNumber: '9710',
        userProfile: {
          id: 'mockId'
        }
      }
    });
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('createPartsOrders action', () => {
    it('should dispatch CREATE_PARTS_ORDER_SUCCESS on success api response with result data', () => {
      const mockBody = {
        workOrderNbr: '123456',
        orderDate: getFormattedDate(null, 'yyyy-mm-dd'),
        orderSource: 'STORE',
        locationNbr: '9710',
        userId: 'mockId',
        parts: [
          {
            orderQuantity: 1,
            partNbr: 'P123',
            partDescription: 'mock part desc',
            brandNbr: 123,
            brandName: 'B123'
          }
        ]
      };

      const resultsNock = nock(partsOrdersUrl)
        .post('/partsOrders', mockBody)
        .reply(200);

      return store
        .dispatch(partsOrdersActions.createPartsOrder('123456'))
        .then(() => {
          expect(resultsNock.isDone()).toBeTruthy();
          expect(store.getActions()).toMatchObject([
            { type: CREATE_PARTS_ORDER_START },
            { type: CREATE_PARTS_ORDER_SUCCESS }
          ]);
        });
    });

    it('should dispatch CREATE_PARTS_ORDER_FAILURE on failure api response', () => {
      const resultsNock = nock(partsOrdersUrl)
        .post('/partsOrders', {
          workOrderNbr: '123456',
          orderDate: getFormattedDate(null, 'yyyy-mm-dd'),
          orderSource: 'STORE',
          locationNbr: '9710',
          userId: 'mockId',
          parts: [
            {
              orderQuantity: 1,
              partNbr: 'P123',
              partDescription: 'mock part desc',
              brandNbr: 123,
              brandName: 'B123'
            }
          ]
        })
        .reply(500);

      return store
        .dispatch(partsOrdersActions.createPartsOrder('123456'))
        .then(() => {
          expect(resultsNock.isDone()).toBeTruthy();
          expect(store.getActions()).toMatchObject([
            { type: CREATE_PARTS_ORDER_START },
            { type: CREATE_PARTS_ORDER_FAILURE }
          ]);
        });
    });
  });

  describe('getPartsOrders action', () => {
    it('should dispatch GET_PARTS_ORDERS_SUCCESS on success api response with result data', () => {
      const resultsNock = nock(partsOrdersUrl)
        .get('/partsOrders')
        .query(true)
        .reply(200, [
          {
            orderCreatedDate: '1970-12-02',
            partsOrderId: 2,
            workOrderNbr: '',
            partsDetails: [
              {
                partDescription: 'mockDescription3'
              },
              {
                partDescription: 'mockDescription4'
              }
            ]
          }
        ]);

      return store.dispatch(partsOrdersActions.getPartsOrders()).then(() => {
        expect(resultsNock.isDone()).toBeTruthy();
        expect(store.getActions()).toMatchObject([
          {
            type: GET_PARTS_ORDERS_SUCCESS,
            payload: [
              {
                orderCreatedDate: '1970-12-02',
                partsOrderId: 2,
                workOrderNbr: '',
                partsDetails: [
                  {
                    partDescription: 'mockDescription3'
                  },
                  {
                    partDescription: 'mockDescription4'
                  }
                ]
              }
            ]
          }
        ]);
      });
    });

    it('should dispatch GET_PARTS_ORDERS_FAILURE on failure api', () => {
      const resultsNock = nock(partsOrdersUrl)
        .get('/partsOrders')
        .query(true)
        .reply(500);

      return store.dispatch(partsOrdersActions.getPartsOrders()).then(() => {
        expect(resultsNock.isDone()).toBeTruthy();
        expect(store.getActions()).toMatchObject([
          { type: GET_PARTS_ORDERS_FAILURE }
        ]);
      });
    });

    it('should dispatch GET_PARTS_ORDERS_FAILURE on storeNumber undefined', () => {
      store = mockStore({
        cart: {
          items: [
            {
              quantity: 1,
              partNumber: 'P123',
              partDescription: 'mock part desc',
              brandNumber: 123,
              brandName: 'B123'
            }
          ]
        },
        login: {
          storeNumber: null,
          userProfile: {
            id: 'mockId'
          }
        }
      });
      return store.dispatch(partsOrdersActions.getPartsOrders()).then(() => {
        expect(store.getActions()).toMatchObject([
          { type: GET_PARTS_ORDERS_FAILURE }
        ]);
      });
    });
  });
});
