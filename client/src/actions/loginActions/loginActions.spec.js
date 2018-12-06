/*  global btoa, describe, afterEach, it, expect */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import { ssoUrl } from '../../utils/apiHelpers';
import * as LoginActions from './';
import {
  USER_LOGIN,
  USER_LOGOUT,
  LOGIN_ERROR,
  USER_PROFILE_ERROR,
  REHYDRATE_USER
} from '../../constants/actionTypes';

import { initialState } from '../../reducers/loginReducer';

const loginInitialState = { login: initialState };
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Login Actions', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  describe('loginUser action', () => {
    it('should dispatch getUserProfile on success api response', () => {
      nock(ssoUrl)
        .post('/ssoLogin')
        .reply(200, {});
      const profileNock = nock(ssoUrl)
        .get('/getUserProfile?username=user')
        .reply(200, {});
      const store = mockStore({
        config: {
          appName: 'mockAppName'
        }
      });

      return store
        .dispatch(LoginActions.loginUser('1234', 'user', 'pass'))
        .then(() => {
          expect(profileNock.isDone()).toBeTruthy();
        });
    });

    it('should dispatch LOGIN_ERROR on error api response', () => {
      nock(ssoUrl)
        .post('/ssoLogin')
        .reply(500, {});
      const store = mockStore();

      return store
        .dispatch(LoginActions.loginUser('1234', 'user', 'pass'))
        .then(() => {
          expect(store.getActions()).toEqual([{ type: LOGIN_ERROR }]);
        });
    });

    it('should dispatch LOGIN_ERROR on error in request', () => {
      nock(ssoUrl)
        .post('/ssoLogin')
        .replyWithError(500, {});
      const store = mockStore();

      return store
        .dispatch(LoginActions.loginUser('1234', 'user', 'pass'))
        .then(() => {
          expect(store.getActions()).toEqual([{ type: LOGIN_ERROR }]);
        });
    });
  });

  describe('getUserProfile action', () => {
    it('should dispatch USER_LOGIN on successful api response', () => {
      const username = 'tester';
      const storeNumber = '9710';
      nock(ssoUrl)
        .get(`/getUserProfile?username=${username}`)
        .reply(200, {});
      const store = mockStore();

      return store
        .dispatch(LoginActions.getUserProfile(username, storeNumber))
        .then(() => {
          expect(store.getActions()).toEqual([
            { type: USER_LOGIN, payload: { user: {}, storeNumber } }
          ]);
        });
    });

    it('should not dispatch USER_LOGIN on failure api response', () => {
      const username = 'tester';
      const storeNumber = '9710';
      nock(ssoUrl)
        .get(`/getUserProfile?username=${username}`)
        .reply(500, { message: 'error message' });

      const store = mockStore();
      return store
        .dispatch(LoginActions.getUserProfile(username, storeNumber))
        .then(() => {
          expect(store.getActions()).toEqual([{ type: USER_PROFILE_ERROR }]);
        });
    });

    it('should not dispatch USER_LOGIN on failure api response', () => {
      const username = 'tester';
      const storeNumber = '9710';
      nock(ssoUrl)
        .get(`/getUserProfile?username=${username}`)
        .replyWithError('error message');
      const store = mockStore();

      return store
        .dispatch(LoginActions.getUserProfile(username, storeNumber))
        .then(() => {
          expect(store.getActions()).not.toEqual([
            { type: USER_LOGIN, user: {} }
          ]);
        });
    });
  });

  describe('logoutUser action', () => {
    it('should dispatch logoutUser', () => {
      const store = mockStore();

      store.dispatch(LoginActions.logoutUser());
      expect(store.getActions()).toEqual([{ type: USER_LOGOUT }]);
    });
  });

  describe('rehydrateUserProfile action', () => {
    it('should dispatch userProfile payload if userProfile in state is null and sessionProfie is set', () => {
      const store = mockStore(loginInitialState);
      const userProfile = {
        id: 'hello',
        first_name: 'test',
        last_name: 'case'
      };

      global.sessionStorage.setItem(
        'userProfile',
        btoa(JSON.stringify(userProfile))
      );

      store.dispatch(LoginActions.rehydrateUserProfile());
      expect(store.getActions()).toEqual([
        {
          type: REHYDRATE_USER,
          payload: { id: 'hello', first_name: 'test', last_name: 'case' }
        }
      ]);
    });

    it('should dispatch userProfile payload if userProfile in state is null and sessionProfie is set', () => {
      const store = mockStore(loginInitialState);
      const userProfile = null;

      global.sessionStorage.setItem(
        'userProfile',
        btoa(JSON.stringify(userProfile))
      );

      store.dispatch(LoginActions.rehydrateUserProfile());
      expect(store.getActions()).toEqual([]);
    });
  });
});
