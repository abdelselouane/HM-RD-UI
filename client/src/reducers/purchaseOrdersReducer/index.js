import { GET_PURCHASE_ORDERS_SUCCESS, GET_PURCHASE_ORDERS_FAILURE, UPDATE_RECEIVE_PART_ORDER, UPDATE_RECEIVE_PART_ORDER_FAILURE } from '../../constants/actionTypes';

export const initialState = {
  orders: [],
  error: false
};

export default function purchaseOrdersReducer(state = initialState, action) {
  switch (action.type) {
    case GET_PURCHASE_ORDERS_SUCCESS:
      return { ...state, error: false, orders: action.payload };
    case GET_PURCHASE_ORDERS_FAILURE:
      return { ...state, error: true };
    case UPDATE_RECEIVE_PART_ORDER:
      return { ...state, error: false };
    case UPDATE_RECEIVE_PART_ORDER_FAILURE:
      return { ...state, error: true };
    default:
      return { ...state };
  }
}
