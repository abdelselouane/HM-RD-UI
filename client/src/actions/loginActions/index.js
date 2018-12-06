/* global atob, sessionStorage */
import fetch from 'isomorphic-fetch';

import { ssoUrl } from '../../utils/apiHelpers';
import {
  USER_LOGIN,
  USER_LOGOUT,
  LOGIN_ERROR,
  USER_PROFILE_ERROR,
  REHYDRATE_USER
} from '../../constants/actionTypes';

export const getUserProfile = (username, storeNumber) => async dispatch => {
  try {
    const response = await fetch(
      `${ssoUrl}/getUserProfile?username=${username}`,
      {
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.status === 200) {
      const json = await response.json();
      return dispatch({
        type: USER_LOGIN,
        payload: { user: json, storeNumber }
      });
    }
    return dispatch({
      type: USER_PROFILE_ERROR
    });
  } catch (error) {
    console.log('error in getUserProfile');
    return dispatch({
      type: USER_PROFILE_ERROR
    });
  }
};

export const loginUser = (storeNumber, username, password) => async (dispatch, getState) => {
  try {
    const response = await fetch(`${ssoUrl}/ssoLogin`, {
      credentials: 'include',
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        callingProgram: getState().config.appName,
        j_storenumber: storeNumber,
        j_username: username,
        j_password: password
      })
    });

    if (response.ok) {
      return dispatch(getUserProfile(username, storeNumber));
    }
    return dispatch({
      type: LOGIN_ERROR
    });
  } catch (error) {
    return dispatch({
      type: LOGIN_ERROR
    });
  }
};

export const logoutUser = () => dispatch => dispatch({ type: USER_LOGOUT });


export const rehydrateUserProfile = () => (dispatch, getState) => {
  const {
    login: { userProfile }
  } = getState();
  const sessionUserProfile = JSON.parse(
    atob(sessionStorage.getItem('userProfile'))
  );

  if (userProfile === null && sessionUserProfile && sessionUserProfile.id) {
    dispatch({
      type: REHYDRATE_USER,
      payload: sessionUserProfile
    });
  }
};
