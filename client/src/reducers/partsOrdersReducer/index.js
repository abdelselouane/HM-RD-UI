import { GET_PARTS_ORDERS_SUCCESS } from '../../constants/actionTypes';

export const initialState = {
  orders: [],
  isLoading: false,
  error: false
};

export default function partsOrdersReducer(state = initialState, action) {
  switch (action.type) {
    case GET_PARTS_ORDERS_SUCCESS:
      return {
        ...state,
        orders: action.payload
      };
    default:
      return state;
  }
}
