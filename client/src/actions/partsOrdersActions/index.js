import fetch from 'isomorphic-fetch';
import { partsOrdersUrl } from '../../utils/apiHelpers';
import { getFormattedDate } from '../../utils/formatHelper';

import {
  GET_PARTS_ORDERS_SUCCESS,
  GET_PARTS_ORDERS_FAILURE,
  CREATE_PARTS_ORDER_START,
  CREATE_PARTS_ORDER_SUCCESS,
  CREATE_PARTS_ORDER_FAILURE
} from '../../constants/actionTypes';


export const getPartsOrders = () => async (dispatch, getState) => {
  const { storeNumber } = getState().login;
  if (!storeNumber) {
    return dispatch({ type: GET_PARTS_ORDERS_FAILURE });
  }

  const response = await fetch(`${partsOrdersUrl}/partsOrders?locationNbr=${storeNumber}`);
  if (response.status === 200) {
    const payload = await response.json();
    return dispatch({ type: GET_PARTS_ORDERS_SUCCESS, payload });
  }

  return dispatch({ type: GET_PARTS_ORDERS_FAILURE });
};

export const createPartsOrder = workOrderNumber => async (dispatch, getState) => {
  dispatch({ type: CREATE_PARTS_ORDER_START });

  const {
    cart: { items: cartItems },
    login: { storeNumber, userProfile: { id: userId } }
  } = getState();

  const body = {
    workOrderNbr: workOrderNumber,
    orderDate: getFormattedDate(null, 'yyyy-mm-dd'),
    orderSource: 'STORE',
    locationNbr: storeNumber,
    userId,
    parts: [
      ...cartItems.map(item => ({
        orderQuantity: item.quantity,
        partNbr: item.partNbr.trim(),
        partDescription: item.partDescription.trim(),
        brandNbr: item.brandNbr,
        brandName: item.brandName.trim()
      }))
    ]
  };

  const response = await fetch(`${partsOrdersUrl}/partsOrders`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  return dispatch({
    type: response.status === 200 ? CREATE_PARTS_ORDER_SUCCESS : CREATE_PARTS_ORDER_FAILURE
  });
};

export default getPartsOrders;
