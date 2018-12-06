/* global sessionStorage, btoa */
import {
  USER_LOGIN,
  USER_LOGOUT,
  LOGIN_ERROR,
  REHYDRATE_USER
} from '../../constants/actionTypes';
import Authentication from '../../utils/authHelper';

export const initialState = {
  userProfile: null,
  storeNumber: '',
  error: false
};

export default function loginReducer(state = initialState, action) {
  let newState;

  switch (action.type) {
    case USER_LOGIN: {
      const { user, storeNumber } = action.payload;
      newState = { ...state };
      newState.userProfile = user;
      newState.storeNumber = storeNumber;
      newState.error = false;
      sessionStorage.setItem(
        'userProfile',
        btoa(JSON.stringify({ ...newState.userProfile, storeNumber }))
      );
      return newState;
    }
    case USER_LOGOUT:
      newState = { ...state };
      newState.userProfile = null;
      newState.error = false;
      Authentication.clearSession();
      return newState;
    case LOGIN_ERROR:
      newState = { ...state };
      newState.error = true;
      return newState;
    case REHYDRATE_USER: {
      const { storeNumber, ...payload } = action.payload;
      return {
        ...state,
        storeNumber,
        userProfile: { ...payload }
      };
    }
    default:
      return state;
  }
}
