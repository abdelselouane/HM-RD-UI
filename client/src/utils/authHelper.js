/* global atob, sessionStorage */
import Cookies from 'universal-cookie';
import fetch from 'isomorphic-fetch';

import apiUrl from './apiHelpers';

export default class Authentication {
  static isAuthenticated() {
    const cookies = new Cookies();
    const thdsso = cookies.get('THDSSO');

    if (thdsso) {
      return this.checkIsSessionValid().then(response => {
        const isValid = response.Valid;
        return isValid;
      });
    }
    this.clearSession();
    return Promise.resolve(false);
  }

  static checkIsSessionValid() {
    return fetch(`${apiUrl}/isSessionValid`, {
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(json => json)
      .catch(error => {
        console.log('isSessionValid error', error);
      });
  }

  static clearSession() {
    const cookies = new Cookies();
    cookies.remove('THDSSO', { domain: '.homedepot.com' });
    sessionStorage.removeItem('userProfile');
  }

  static getUserProfile(state) {
    let { userProfile = null } = state;
    if (userProfile === null && sessionStorage.getItem('userProfile')) {
      userProfile = JSON.parse(atob(sessionStorage.getItem('userProfile')));
    }
    return userProfile;
  }
}
