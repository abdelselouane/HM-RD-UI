import fetch from 'isomorphic-fetch';

import { EDIT_ITEM, GET_INVENTORY, ADD_ITEM_SUCCESS } from '../../constants/actionTypes';
import { partsOrdersUrl, partsInventoryUrl } from '../../utils/apiHelpers';

export const getInventory = () => async (dispatch, getState) => {
  const { storeNumber } = getState().login;
  const res = await fetch(`${partsOrdersUrl}/partsInventory?storeNbr=${storeNumber}`);
  dispatch({
    type: GET_INVENTORY,
    payload: await res.json()
  });
};

export const editItem = item => (dispatch, getState) => {
  const { userProfile: { id } } = getState().login;
  const body = {
    ...item
  };

  fetch(`${partsOrdersUrl}/partsInventory?userId=${id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  dispatch({
    type: EDIT_ITEM,
    index: getState().inventory.items.findIndex(
      ({ partNbr, brandNbr }) => partNbr === item.partNbr && brandNbr === item.brandNbr
    ),
    payload: item
  });
};

export const addItem = item => async (dispatch, getState) => {
  const { storeNumber: storeNbr, userProfile: { id } } = getState().login;

  const partInventoryItem = {
    storeNbr,
    partNbr: item.partNbr,
    brandNbr: item.brandNbr,
    brandName: item.brandName,
    partDescription: item.partDescription,
    availableQuantity: item.availableQuantity,
    allocatedQuantity: item.allocatedQuantity || 0,
    location: item.location || ''
  };

  const body = { partsInventoryDTOs: [partInventoryItem] };
  dispatch({ type: 'ADD_ITEM_START' });
  try {
    const response = await fetch(`${partsInventoryUrl}/partsInventory?userId=${id}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (response.status === 200) {
      dispatch({ type: ADD_ITEM_SUCCESS, payload: partInventoryItem });
    } else {
      dispatch({ type: 'ADD_ITEM_FAILURE' });
    }
  } catch (error) {
    dispatch({ type: 'ADD_ITEM_FAILURE' });
  }
};

export default { editItem, addItem };
