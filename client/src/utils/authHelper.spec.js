/* global afterEach, beforeEach, btoa,describe, expect, it, jest */
import nock from 'nock';

import Authentication from './authHelper';
import apiUrl from './apiHelpers';

describe('Authentication', () => {
  let state;

  beforeEach(() => {
    state = {
      userProfile: {
        first_name: 'first',
        last_name: 'last'
      }
    };
    global.sessionStorage.setItem('userProfile', btoa(JSON.stringify(state.userProfile)));
  });

  afterEach(() => {
    global.sessionStorage.removeItem('userProfile');
  });

  it('should return userProfile details from getUserProfile when passed', () => {
    const userProfile = Authentication.getUserProfile(state);

    expect(userProfile.first_name).toBe('first');
    expect(userProfile.last_name).toBe('last');
  });

  it('should return userProfile details from getUserProfile with sessionStorage', () => {
    const userProfile = Authentication.getUserProfile({});

    expect(userProfile.first_name).toBe('first');
    expect(userProfile.last_name).toBe('last');
  });

  // it('should clear userProfile from sessionStorage from clearSession', () => {
  //   Authentication.clearSession();
  //   const userProfile = global.sessionStorage.getItem('userProfile');
  //   expect(userProfile).toBe(undefined);
  // });

  it('should return valid response when session is valid from checkIsSessionValid', async () => {
    nock(apiUrl)
      .get('/isSessionValid')
      .reply(200, { userProfile: state.userProfile });
    const response = Authentication.checkIsSessionValid();
    const { userProfile } = await response;
    expect(userProfile.first_name).toBe('first');
  });

  it('should return null when session is valid from checkIsSessionValid', async () => {
    nock(apiUrl)
      .get('/isSessionValid')
      .replyWithError('error message');
    const response = Authentication.checkIsSessionValid();
    const data = await response;
    expect(data).toBe(undefined);
  });

  it('should return false when no THDSSO cookie from isAuthenticated', () => {
    const spy = jest.spyOn(Authentication, 'clearSession');
    Authentication.isAuthenticated();
    expect(spy).toHaveBeenCalled();
  });
});
