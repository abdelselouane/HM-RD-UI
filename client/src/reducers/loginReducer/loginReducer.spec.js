/* global describe, beforeEach, it, jest, expect , btoa */
import {
  USER_LOGIN,
  USER_LOGOUT,
  LOGIN_ERROR,
  REHYDRATE_USER
} from '../../constants/actionTypes';
import loginReducer, { initialState } from './index';
import Authentication from '../../utils/authHelper';

describe('LoginReducer', () => {
  const action = {
    type: null,
    payload: {
      user: {
        first_name: 'first',
        last_name: 'last'
      },
      storeNumber: '9710'
    }
  };

  beforeEach(() => {
    action.type = null;
  });

  it('properly captures a dispatch for User Login', () => {
    action.type = USER_LOGIN;
    expect(loginReducer(initialState, action)).toMatchObject({
      error: false,
      userProfile: {
        ...action.payload.user
      },
      storeNumber: '9710'
    });
  });

  it('properly captures a dispatch for User Logout', () => {
    const spy = jest.spyOn(Authentication, 'clearSession');
    action.type = USER_LOGOUT;
    expect(loginReducer(initialState, action)).toEqual({
      error: false,
      userProfile: null,
      storeNumber: ''
    });

    expect(spy).toHaveBeenCalled();
    spy.mockReset();
    spy.mockRestore();
  });

  it('properly captures a dispatch for a Logout Error', () => {
    action.type = LOGIN_ERROR;
    expect(loginReducer(initialState, action)).toEqual({
      error: true,
      userProfile: null,
      storeNumber: ''
    });
  });

  it('properly captures a dispatch for a Rehydrate', () => {
    action.type = REHYDRATE_USER;
    action.payload = {
      first_name: 'test',
      last_name: 'case',
      storeNumber: '9710'
    };
    expect(loginReducer(initialState, action)).toEqual({
      userProfile: {
        first_name: 'test',
        last_name: 'case'
      },
      error: false,
      storeNumber: '9710'
    });
  });

  it('properly return state for the undefined action type', () => {
    action.type = 'UNDEFINED_ACTION_TYPE';

    expect(loginReducer(undefined, action)).toEqual(initialState);
  });
});
