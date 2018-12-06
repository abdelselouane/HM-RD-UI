/* globals describe, beforeAll, it, expect, afterEach */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import { partsOrdersUrl, partsInventoryUrl } from '../../utils/apiHelpers';
import * as inventoryActions from './';
import { EDIT_ITEM, GET_INVENTORY, ADD_ITEM_SUCCESS } from '../../constants/actionTypes';
import { initialState } from '../../reducers/inventoryReducer';

const inventoryInitialState = {
  login: {
    storeNumber: '9710',
    userProfile: {
      id: 'asm001'
    },
  },
  inventory: initialState
};
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Inventory Actions', () => {
  let mockItems;

  beforeAll(() => {
    mockItems = [
      {
        storeNbr: '9710',
        partNbr: '71352031',
        brandNbr: 1001,
        location: 'B5',
        availableQuantity: 45
      },
      {
        storeNbr: '9710',
        partNbr: 'abc-1234',
        brandNbr: 1099,
        location: 'Z0',
        availableQuantity: 1
      },
      {
        storeNbr: '9710',
        partNbr: 'QQ-0w0',
        brandNbr: 1201,
        location: 'X2',
        availableQuantity: 20
      }
    ];
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('editItem action', () => {
    it('should dispatch EDIT_ITEM', async () => {
      const partsNock = nock(partsOrdersUrl)
        .put('/partsInventory')
        .query(true)
        .reply(200);

      const mockUpdate = {
        ...mockItems[0],
        availableQuantity: 99
      };
      const mockInitialState = inventoryInitialState;
      mockInitialState.inventory.items = [...mockItems];
      const store = mockStore(inventoryInitialState);
      await store.dispatch(inventoryActions.editItem(mockUpdate));
      expect(partsNock.isDone()).toBe(true);
      expect(store.getActions()).toEqual([{ type: EDIT_ITEM, index: 0, payload: mockUpdate }]);
    });
  });

  describe('getInventory action', () => {
    it('should dispatch GET_INVENTORY', async () => {
      const mockResponse = [
        {
          storeNbr: '9710',
          partNbr: '71352031',
          partDescription: 'BLADE GAUGE',
          brandNbr: 1001,
          brandName: 'MAKITA',
          location: 'B5',
          availableQuantity: 45,
          allocatedQuantity: 4
        }
      ];
      const partsNock = nock(partsOrdersUrl)
        .get('/partsInventory')
        .query(true)
        .reply(200, mockResponse);

      const store = mockStore(inventoryInitialState);
      await store.dispatch(inventoryActions.getInventory());
      expect(partsNock.isDone()).toBe(true);
      expect(store.getActions()).toEqual([{ type: GET_INVENTORY, payload: mockResponse }]);
    });
  });

  describe('addItem', () => {
    it('should dispatch ADD_ITEM_SUCCESS on 200 response', async () => {
      const item = {
        partNbr: 'mockNbr',
        brandNbr: '1001',
        availableQuantity: 2,
        allocatedQuantity: 0,
        partDescription: 'spark plug',
        brandName: 'mockmock'
      };

      const expectedItem = {
        storeNbr: '9710',
        partNbr: 'mockNbr',
        brandNbr: '1001',
        availableQuantity: 2,
        allocatedQuantity: 0,
        location: '',
        partDescription: 'spark plug',
        brandName: 'mockmock'
      };

      const inventoryNock = nock(partsInventoryUrl, {
        reqheaders: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .post('/partsInventory', {
          partsInventoryDTOs: [expectedItem]
        })
        .query({ userId: 'asm001' })
        .reply(200);

      const store = mockStore(inventoryInitialState);
      await store.dispatch(inventoryActions.addItem(item));
      expect(inventoryNock.isDone()).toBe(true);
      expect(store.getActions()).toEqual([
        { type: 'ADD_ITEM_START' },
        { type: ADD_ITEM_SUCCESS, payload: expectedItem }
      ]);
    });

    it('should dispatch ADD_ITEM_FAILURE on non 200 response', async () => {
      const part = {
        partNbr: 'mockNbr',
        brandNbr: '1001',
        availableQuantity: 2,
        allocatedQuantity: 0,
        location: 'somewhere',
        partDescription: 'spark plug',
        brandName: 'mockmock'
      };

      const expectedItem = {
        storeNbr: '9710',
        partNbr: 'mockNbr',
        brandNbr: '1001',
        availableQuantity: 2,
        allocatedQuantity: 0,
        location: 'somewhere',
        partDescription: 'spark plug',
        brandName: 'mockmock'
      };

      const inventoryNock = nock(partsInventoryUrl, {
        reqheaders: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .post('/partsInventory', {
          partsInventoryDTOs: [expectedItem]
        })
        .query({ userId: 'asm001' })
        .reply(400);

      const store = mockStore(inventoryInitialState);
      await store.dispatch(inventoryActions.addItem(part));
      expect(inventoryNock.isDone()).toBe(true);
      expect(store.getActions()).toEqual([
        { type: 'ADD_ITEM_START' },
        { type: 'ADD_ITEM_FAILURE' }
      ]);
    });

    it('should dispatch ADD_ITEM_FAILURE on non 200 response', async () => {
      const part = {
        partNbr: 'mockNbr',
        brandNbr: '1001',
        availableQuantity: 2,
        allocatedQuantity: 0,
        location: 'somewhere',
        partDescription: 'spark plug',
        brandName: 'mockmock'
      };

      const expectedItem = {
        storeNbr: '9710',
        partNbr: 'mockNbr',
        brandNbr: '1001',
        availableQuantity: 2,
        allocatedQuantity: 0,
        location: 'somewhere',
        partDescription: 'spark plug',
        brandName: 'mockmock'
      };

      const inventoryNock = nock(partsInventoryUrl, {
        reqheaders: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .post('/partsInventory', {
          partsInventoryDTOs: [expectedItem]
        })
        .query({ userId: 'asm001' })
        .replyWithError('bad content, unauthorized, not found, forbiden');

      const store = mockStore(inventoryInitialState);
      await store.dispatch(inventoryActions.addItem(part));
      expect(inventoryNock.isDone()).toBe(true);
      expect(store.getActions()).toEqual([
        { type: 'ADD_ITEM_START' },
        { type: 'ADD_ITEM_FAILURE' }
      ]);
    });
  });
});
