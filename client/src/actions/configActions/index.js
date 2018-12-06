import fetch from 'isomorphic-fetch';
import { LOAD_CONFIG, LOAD_CONFIG_ERROR } from '../../constants/actionTypes';
import apiUrl from '../../utils/apiHelpers';

export const loadConfig = () => async dispatch => {
  const response = await fetch(`${apiUrl}/config`);
  if (response.status === 200) {
    const data = await response.json();
    return dispatch({ type: LOAD_CONFIG, payload: data });
  }
  return dispatch({ type: LOAD_CONFIG_ERROR });
};

export default loadConfig;
