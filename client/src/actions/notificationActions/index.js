import {
  HIDE_MESSAGE,
  SHOW_MESSAGE,
  SHOW_INFO_MESSAGE,
  SHOW_SUCCESS_MESSAGE
} from '../../constants/actionTypes';

export const hideMessage = () => dispatch =>
  dispatch({
    type: HIDE_MESSAGE
  });

export const showMessage = (title, details = '') => dispatch =>
  dispatch({
    type: SHOW_MESSAGE,
    payload: { title, details }
  });

export const showSuccessMessage = (title, details = '') => dispatch =>
  dispatch({
    type: SHOW_SUCCESS_MESSAGE,
    payload: { title, details }
  });

export const showInfoMessage = (title, details = '') => dispatch =>
  dispatch({
    type: SHOW_INFO_MESSAGE,
    payload: { title, details }
  });
