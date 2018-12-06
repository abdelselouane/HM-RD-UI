import { HIDE_MESSAGE, SHOW_MESSAGE, SHOW_INFO_MESSAGE, SHOW_SUCCESS_MESSAGE } from '../../constants/actionTypes';

export const initialState = {
  title: '',
  className: ''
};

export default function notificationReducer(state = initialState, action) {
  let newstate;
  switch (action.type) {
    case SHOW_MESSAGE:
      newstate = { ...state };
      newstate.className = 'error';
      return {
        ...newstate,
        ...action.payload
      };
    case SHOW_SUCCESS_MESSAGE:
      newstate = { ...state };
      newstate.className = 'success';
      return {
        ...newstate,
        ...action.payload
      };
    case SHOW_INFO_MESSAGE:
      newstate = { ...state };
      newstate.className = 'information';
      return {
        ...newstate,
        ...action.payload
      };
    case HIDE_MESSAGE:
      return initialState;
    default:
      return state;
  }
}
