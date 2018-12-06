import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as notificationActions from './';
import {
  HIDE_MESSAGE,
  SHOW_MESSAGE,
  SHOW_SUCCESS_MESSAGE,
  SHOW_INFO_MESSAGE
} from '../../constants/actionTypes';
import { initialState } from '../../reducers/notificationReducer';

const cartInitialState = { cart: initialState };
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Notification Actions', () => {
  let store;
  beforeEach(() => {
    store = mockStore();
  });

  describe('hideMessage action', () => {
    it('should dispatch HIDE_MESSAGE', () => {
      store.dispatch(notificationActions.hideMessage());
      expect(store.getActions()).toEqual([
        { type: HIDE_MESSAGE }
      ]);
    });
  });

  describe('showMessage action', () => {
    it('should dispatch SHOW_MESSAGE when title is defined and details is not', () => {
      store.dispatch(notificationActions.showMessage('mockMessage'));
      expect(store.getActions()).toEqual([
        { type: SHOW_MESSAGE, payload: { title: 'mockMessage', details: '' } }
      ]);
    });

    it('should dispatch SHOW_MESSAGE when title and details are defined', () => {
      store.dispatch(notificationActions.showMessage('mockMessage', 'mockDetails'));
      expect(store.getActions()).toEqual([
        { type: SHOW_MESSAGE, payload: { title: 'mockMessage', details: 'mockDetails' } }
      ]);
    });
  });

  describe('showSuccessMessage', () =>{
    it('should dispatch SHOW_SUCCESS_MESSAGE when title is defined and details defined', () =>{
      store.dispatch(notificationActions.showSuccessMessage('mockMessage', 'mockDetails'));
      expect(store.getActions()).toEqual([
        { type: SHOW_SUCCESS_MESSAGE, payload: {title: 'mockMessage', details: 'mockDetails'}}
      ]);
    });

    it('should dispatch SHOW_SUCCESS_MESSAGE when title is defined and details is not defined', () =>{
      store.dispatch(notificationActions.showSuccessMessage('mockMessage'));
      expect(store.getActions()).toEqual([
        { type: SHOW_SUCCESS_MESSAGE, payload: {title: 'mockMessage', details: ''}}
      ]);
    });
  });

  describe('showInfoMessage', () =>{
    it('should dispatch SHOW_INFO_MESSAGE when title is defined and details defined', () =>{
      store.dispatch(notificationActions.showInfoMessage('mockMessage', 'mockDetails'));
      expect(store.getActions()).toEqual([
        {type: SHOW_INFO_MESSAGE, payload: {title: 'mockMessage', details: 'mockDetails'}}
      ])
    });

    it('should dispatch SHOW_INFO_MESSAGE when title is defined and details is not defined', () =>{
      store.dispatch(notificationActions.showInfoMessage('mockMessage'));
      expect(store.getActions()).toEqual([
        {type: SHOW_INFO_MESSAGE, payload: {title: 'mockMessage', details: ''}}
      ])
    });
  });
});
