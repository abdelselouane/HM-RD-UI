import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  CLEAR_CART,
  ADJUST_QUANTITY
} from '../../constants/actionTypes';

export const addToCart = part => dispatch =>
  dispatch({
    type: ADD_TO_CART,
    payload: part
  });

export const removeFromCart = index => dispatch =>
  dispatch({ type: REMOVE_FROM_CART, index });

export const clearCart = () => (dispatch, getState) =>
  getState().cart.items.length > 0 &&
    dispatch({
      type: CLEAR_CART
    });

export const adjustQuantity = (index, newQuantity) => dispatch =>
  dispatch({ type: ADJUST_QUANTITY, index, payload: newQuantity });
