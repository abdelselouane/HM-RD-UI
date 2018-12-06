import fetch from 'isomorphic-fetch';

import { partsServiceUrl } from '../../utils/apiHelpers';
import {
  PARTS_SEARCH,
  PARTS_SEARCH_START,
  PARTS_SEARCH_ERROR,
  CLEAR_RESULTS
} from '../../constants/actionTypes';

export const searchParts = (searchInput, numOfRows = 0) => dispatch => {
  dispatch({ type: PARTS_SEARCH_START });
  let uri = `getParts?partNbr=${searchInput}`;
  if (numOfRows > 0) {
    uri += `&noOfRows=${numOfRows}`;
  }

  return fetch(`${partsServiceUrl}/${uri}`)
    .then(response => {
      if (response.status === 204) {
        return dispatch({
          type: PARTS_SEARCH,
          payload: []
        });
      }
      if (response.status === 200) {
        return response.json().then(data => dispatch({
          type: PARTS_SEARCH,
          payload: data
        }));
      }
      return dispatch({
        type: PARTS_SEARCH_ERROR
      });
    })
    .catch(() =>
      dispatch({
        type: PARTS_SEARCH_ERROR
      })
    );
};

export const clearResults = () => (dispatch, getState) =>
  getState().partsSearch.results.length > 0 &&
  dispatch({
    type: CLEAR_RESULTS
  });
