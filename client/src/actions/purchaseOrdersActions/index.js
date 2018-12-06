import fetch from 'isomorphic-fetch';
import { partsOrdersUrl } from '../../utils/apiHelpers';

import {
  GET_PURCHASE_ORDERS_START,
  GET_PURCHASE_ORDERS_SUCCESS,
  GET_PURCHASE_ORDERS_FAILURE,
  UPDATE_RECEIVE_PART_ORDER,
  UPDATE_RECEIVE_PART_ORDER_FAILURE
} from '../../constants/actionTypes';
import { consolidateStreamedStyles } from 'styled-components';


export const getPurchaseOrders = () => async (dispatch, getState) => {
  dispatch({ type: GET_PURCHASE_ORDERS_START });
  const { storeNumber } = getState().login;
  try {
    const response = await fetch(`${partsOrdersUrl}/getPurchaseOrders?locationNbr=${storeNumber}`);
    if (response.status !== 200) {
      return dispatch({ type: GET_PURCHASE_ORDERS_FAILURE });
    }
    const payload = await response.json();
    return dispatch({ type: GET_PURCHASE_ORDERS_SUCCESS, payload });
  } catch (error) {
    console.log('inside error');
    return dispatch({ type: GET_PURCHASE_ORDERS_FAILURE });
  }
};

export const updateReceivePartOrder = payload => async (dispatch, getState) => {
  const { userProfile: { id } } = getState().login;
  const body = {
    ...payload,
    userId: id
  };
  try {
    const response = await fetch(`${partsOrdersUrl}/updateReceivePartOrder`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    if (response.status === 200) {
      dispatch({
        type: UPDATE_RECEIVE_PART_ORDER
      });
      return dispatch(getPurchaseOrders());
    } else {
      dispatch({
        type: UPDATE_RECEIVE_PART_ORDER_FAILURE
      });
    }
  } catch (error) {
    dispatch({ type: UPDATE_RECEIVE_PART_ORDER_FAILURE });
  }
};

export default { getPurchaseOrders, updateReceivePartOrder };
