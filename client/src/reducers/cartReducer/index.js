import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  CLEAR_CART,
  ADJUST_QUANTITY
} from '../../constants/actionTypes';

export const initialState = {
  items: []
};

export default function partsSearchReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_TO_CART:
      return {
        ...state,
        items: state.items.concat([{ ...action.payload, quantity: 1 }])
      };
    case REMOVE_FROM_CART:
      return {
        ...state,
        items: state.items
          .map((item, index) => (index === action.index ? null : item))
          .filter(validItem => validItem)
      };
    case ADJUST_QUANTITY:
      return {
        ...state,
        items: state.items.map(
          (item, index) =>
            (index === action.index
              ? { ...item, quantity: action.payload }
              : item)
        )
      };
    case CLEAR_CART:
      return initialState;
    default:
      return state;
  }
}
