/* global beforeEach, describe, afterEach, it, expect */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import { partsOrdersUrl } from '../../utils/apiHelpers';
import * as purchaseOrdersActions from '.';

import {
  GET_PURCHASE_ORDERS_START,
  GET_PURCHASE_ORDERS_SUCCESS,
  GET_PURCHASE_ORDERS_FAILURE,
  UPDATE_RECEIVE_PART_ORDER,
  UPDATE_RECEIVE_PART_ORDER_FAILURE
} from '../../constants/actionTypes';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);


describe('Purchase Order Actions', () => {
  let store;

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

  const updateReceivePartOrderRequest = {
    locationNbr: 1234,
    partsDetails: [{
      brandName: 'Makita',
      brandNbr: 1001,
      currentQuantityReceived: 1,
      partDescription: 'Hammer',
      partLocation: 'BIN_1',
      partNbr: 'T8',
      previousQuantityReceived: 10,
      quantityOrdered: 20
    }],
    partsOrderId: 8,
    purchaseOrderNbr: 971000054
  };


  beforeEach(() => {
    store = mockStore({
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

  describe('getPurchaseOrders action', () => {
    it('should dispatch GET_PURCHASE_ORDERS_FAILURE on error during request', () => {
      const resultsNock = nock(partsOrdersUrl)
        .get('/getPurchaseOrders')
        .query(true)
        .replyWithError(500, 'Internal Server Error');

      return store
        .dispatch(purchaseOrdersActions.getPurchaseOrders())
        .then(() => {
          expect(resultsNock.isDone()).toBeTruthy();
          expect(store.getActions()).toMatchObject([
            { type: GET_PURCHASE_ORDERS_START },
            { type: GET_PURCHASE_ORDERS_FAILURE }
          ]);
        });
    });

    it('should dispatch GET_PURCHASE_ORDERS_FAILURE on bad api request', () => {
      const resultsNock = nock(partsOrdersUrl)
        .get('/getPurchaseOrders')
        .query({ locationNbr: '9710' })
        .reply(400);

      return store
        .dispatch(purchaseOrdersActions.getPurchaseOrders())
        .then(() => {
          expect(resultsNock.isDone()).toBeTruthy();
          expect(store.getActions()).toMatchObject([
            { type: GET_PURCHASE_ORDERS_START },
            { type: GET_PURCHASE_ORDERS_FAILURE }
          ]);
        });
    });

    it('should dispatch GET_PURCHASE_ORDERS_SUCCESS on success api response', () => {
      const resultsNock = nock(partsOrdersUrl)
        .get('/getPurchaseOrders')
        .query({ locationNbr: '9710' })
        .reply(200, mockPurchaseOrder);

      return store
        .dispatch(purchaseOrdersActions.getPurchaseOrders())
        .then(() => {
          expect(resultsNock.isDone()).toBeTruthy();
          expect(store.getActions()).toMatchObject([
            { type: GET_PURCHASE_ORDERS_START },
            { type: GET_PURCHASE_ORDERS_SUCCESS, payload: mockPurchaseOrder }
          ]);
        });
    });
  });
  describe('updateReceivePartOrder', () => {
  const body = {
      ...updateReceivePartOrderRequest,
      userId: 'mockId'    
  };
    it('should dispatch UPDATE_RECEIVE_PART_ORDER on success api response', () => {

      const resultsGetPurchaseOrdersNock = nock(partsOrdersUrl)
        .get('/getPurchaseOrders')
        .query({ locationNbr: '9710' })
        .reply(200, mockPurchaseOrder);

      const resultsUpdateReceiveParOrderNock = nock(partsOrdersUrl, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .post('/updateReceivePartOrder', body)
        .reply(200);

      return store.dispatch(purchaseOrdersActions.updateReceivePartOrder(updateReceivePartOrderRequest))
        .then(() => {
          expect(resultsUpdateReceiveParOrderNock.isDone()).toBeTruthy();
          expect(store.getActions()).toMatchObject([
            { type: UPDATE_RECEIVE_PART_ORDER },
            { type: GET_PURCHASE_ORDERS_START },   
            { type: GET_PURCHASE_ORDERS_SUCCESS, payload: mockPurchaseOrder }    
          ]);

        });  
    });

    it('should dispatch UPDATE_RECEIVE_PART_ORDER_FAILURE on exception', () => {
      const resultsNock = nock(partsOrdersUrl, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      })
      .post('/updateReceivePartOrder', body)
      .replyWithError(500, 'Internal Server Error');

      return store.dispatch(purchaseOrdersActions.updateReceivePartOrder(updateReceivePartOrderRequest))
        .then(() => {
            expect(store.getActions()).toMatchObject([
              { type: UPDATE_RECEIVE_PART_ORDER_FAILURE }
            ])
        });
      });

      it('should dispatch UPDATE_RECEIVE_PART_ORDER_FAILURE on failure api response', () => {
        const resultsNock = nock(partsOrdersUrl, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        })
        .post('/updateReceivePartOrder', body)
        .reply(400);
  
        return store.dispatch(purchaseOrdersActions.updateReceivePartOrder(updateReceivePartOrderRequest))
          .then(() => {
              expect(store.getActions()).toMatchObject([
                { type: UPDATE_RECEIVE_PART_ORDER_FAILURE }
              ])
          });
        });

      it('should displatch GET_PURCHASE_ORDERS_FAILURE on getPurchaseOrderAPI failure', () => {
          const resultsNock = nock(partsOrdersUrl, {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            }
          })
          .post('/updateReceivePartOrder', body)
          .reply(200);

          const getPurchaseOrdersNock = nock(partsOrdersUrl)
            .get('/getPurchaseOrders')
            .query({locationNbr:'9710'})
            .reply(400);

            store.dispatch(purchaseOrdersActions.updateReceivePartOrder(updateReceivePartOrderRequest))
            .then(() => {
              expect(store.getActions()).toMatchObject([
                {type : UPDATE_RECEIVE_PART_ORDER},
                {type : GET_PURCHASE_ORDERS_START},
                {type : GET_PURCHASE_ORDERS_FAILURE}
              ])
            })
      });
  });
});
