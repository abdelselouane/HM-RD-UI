/* global describe, beforeEach, it, expect */
import { HIDE_MESSAGE, SHOW_MESSAGE, SHOW_INFO_MESSAGE , SHOW_SUCCESS_MESSAGE} from '../../constants/actionTypes';
import notificationReducer, { initialState } from './index';

describe('notificationReducer', () => {
  const action = {
    type: null,
    payload: ''
  };

  beforeEach(() => {
    action.type = null;
  });

  it('should have default className and icon set in initialState', () => {
    expect(initialState).toMatchObject({
      className: ''
    });
  });

  it('should default state to initialState', () => {
    expect(notificationReducer(undefined, { type: '' })).toMatchObject({
      ...initialState
    });
  });

  it('should return given state on undefined action in switch-case', () => {
    expect(notificationReducer(initialState, { type: '' })).toMatchObject({
      ...initialState
    });
  });

  it('properly captures a dispatch for SHOW_MESSAGE', () => {
    action.type = SHOW_MESSAGE;
    action.payload = { title: 'Show this message', details: 'mockDetails' };
    expect(notificationReducer(initialState, action)).toMatchObject({
      ...initialState,
      title: 'Show this message',
      className: 'error'
    });
  });

  it('properly captures a dispatch for SHOW_INFO_MESSAGE', () => {
    action.type = SHOW_INFO_MESSAGE;
    action.payload = { title: 'Show info message', details: 'mockDetails' };
    expect(notificationReducer(initialState, action)).toMatchObject({
      ...initialState,
      title: 'Show info message',
      className: 'information'
    });
  });

  it('properly captures a dispatch for SHOW_SUCESS_MESSAGE', () =>{
    action.type = SHOW_SUCCESS_MESSAGE;
    action.payload = {title: 'Show success message', details: 'mockDetails'}
    const response = notificationReducer(initialState, action);
    expect(response).toMatchObject({
      title: 'Show success message',
      className: 'success',
      details: 'mockDetails'
    });
  });


  it('properly captures a dispatch for HIDE_MESSAGE', () => {
    action.type = HIDE_MESSAGE;
    expect(notificationReducer(initialState, action)).toEqual({
      ...initialState,
      title: '',
      className: ''
    });
  });
});
