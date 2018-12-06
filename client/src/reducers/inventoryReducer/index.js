import { EDIT_ITEM, GET_INVENTORY, ADD_ITEM_SUCCESS } from '../../constants/actionTypes';

export const initialState = {
  items: []
};

export default function inventoryReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_ITEM_SUCCESS:
      return {
        ...state,
        items: [action.payload, ...state.items]
      };
    case GET_INVENTORY:
      return {
        ...state,
        items: action.payload
      };
    case EDIT_ITEM:
      return {
        ...state,
        items: state.items.map((item, index) => (index === action.index ? action.payload : item))
      };
    default:
      return state;
  }
}
