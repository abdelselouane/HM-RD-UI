/* globals describe, beforeAll, it, expect */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as cartActions from './';
import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  CLEAR_CART,
  ADJUST_QUANTITY
} from '../../constants/actionTypes';
import { initialState } from '../../reducers/cartReducer';

const cartInitialState = { cart: initialState };
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Cart Actions', () => {
  let part;

  beforeAll(() => {
    part = {
      partNbr: 'mockPartNumber',
      partDescription: 'mockDescription',
      brandName: 'mockbrandName',
      quantity: 1
    };
  });

  describe('addToCart action', () => {
    it('should dispatch ADD_TO_CART', () => {
      const store = mockStore();
      store.dispatch(cartActions.addToCart(part));
      expect(store.getActions()).toEqual([
        { type: ADD_TO_CART, payload: part }
      ]);
    });
  });

  describe('removeFromCart action', () => {
    it('should dispatch REMOVE_FROM_CART', () => {
      const store = mockStore();
      store.dispatch(cartActions.removeFromCart(1));
      expect(store.getActions()).toEqual([
        { type: REMOVE_FROM_CART, index: 1 }
      ]);
    });
  });

  describe('clearCart action', () => {
    it('should dispatch CLEAR_CART when results array is not empty', () => {
      const store = mockStore({
        cart: { items: [part] }
      });
      store.dispatch(cartActions.clearCart());
      expect(store.getActions()).toEqual([{ type: CLEAR_CART }]);
    });

    it('should not dispatch CLEAR_CART when results array is empty', () => {
      const store = mockStore(cartInitialState);
      store.dispatch(cartActions.clearCart());
      expect(store.getActions()).not.toEqual([{ type: CLEAR_CART }]);
    });
  });

  describe('adjustQuantity action', () => {
    it('should dispatch ADJUST_QUANTITY with index of item and payload of the new quantity', () => {
      const store = mockStore({
        cart: { items: [part] }
      });
      store.dispatch(cartActions.adjustQuantity(0, 2));
      expect(store.getActions()).toEqual([
        { type: ADJUST_QUANTITY, index: 0, payload: 2 }
      ]);
    });
  });
});
