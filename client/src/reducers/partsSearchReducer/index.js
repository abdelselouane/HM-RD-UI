import {
  PARTS_SEARCH,
  PARTS_SEARCH_START,
  PARTS_SEARCH_ERROR,
  CLEAR_RESULTS,
} from '../../constants/actionTypes';

export const initialState = {
  results: [],
  isLoading: false,
  error: false
};

export default function partsSearchReducer(state = initialState, action) {
  switch (action.type) {
    case PARTS_SEARCH_START:
      return {
        ...state,
        isLoading: true
      };
    case PARTS_SEARCH:
      return {
        ...state,
        error: false,
        isLoading: false,
        results: action.payload
      };
    case PARTS_SEARCH_ERROR:
      return {
        ...state,
        error: true,
        isLoading: false,
        results: []
      };
    case CLEAR_RESULTS:
      return {
        ...state,
        error: false,
        isLoading: false,
        results: []
      };
    default:
      return state;
  }
}
