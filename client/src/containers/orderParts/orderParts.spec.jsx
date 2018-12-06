/* global describe, beforeAll, beforeEach, it, expect, jest */
import React from 'react';
import ReactDOM from 'react-dom';
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import * as Styles from './styles';
import { OrderParts } from './index';

import {
  CREATE_PARTS_ORDER_SUCCESS,
  CREATE_PARTS_ORDER_FAILURE
} from '../../constants/actionTypes';
import { ConfirmationModal } from '../../components/modal';

describe('<OrderParts />', () => {
  let wrapper;
  let wrapperInstance;
  let spy;
  let props;
  let part;

  beforeAll(() => {
    ReactDOM.createPortal = jest.fn();

    part = {
      partNbr: 'mockPartNumber',
      partDescription: 'mockDescription',
      brandName: 'mockbrandName',
      quanitity: 1,
      ediFlag: 'Y'
    };

    props = {
      actions: {
        searchParts: jest.fn(),
        clearResults: jest.fn(),
        addToCart: jest.fn(),
        removeFromCart: jest.fn(),
        adjustQuantity: jest.fn(),
        hideMessage: jest.fn(),
        showMessage: jest.fn(),
        showInfoMessage: jest.fn(),
        createPartsOrder: jest.fn(() => ({ type: CREATE_PARTS_ORDER_SUCCESS }))
      },
      cart: [],
      results: [],
      history: { push: jest.fn() }
    };

    spy = null;

    global.setTimeout = jest.fn();
  });

  beforeEach(() => {
    wrapper = shallow(<OrderParts {...props} />);
    wrapperInstance = wrapper.instance();
  });

  it('should render properly', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render styles properly', () => {
    Object.values(Styles).forEach(Component => {
      expect(toJson(shallow(<Component />))).toMatchSnapshot();
    });
  });

  it('should call clearResults action when input text length is less than 1', () => {
    spy = jest.spyOn(props.actions, 'clearResults');
    wrapperInstance.handleInputChange('searchInput', 'a');
    expect(spy).toHaveBeenCalled();
    spy.mockReset();
    spy.mockRestore();
  });

  it('should call showMessage with error message searchParts action returns error', async () => {
    spy = jest.spyOn(props.actions, 'showMessage');
    wrapper.setProps({ searchError: true });
    await wrapperInstance.handleInputChange('searchInput', 'ab');
    expect(spy).toHaveBeenCalledWith(
      'System Failure: Parts search is currently unavailable'
    );
    spy.mockReset();
    spy.mockRestore();
  });

  it('should call hideMessage if searchError is false and hasErrorMessage is true', async () => {
    spy = jest.spyOn(props.actions, 'hideMessage');
    wrapper.setProps({
      searchError: false,
      notify: { title: 'System Failure: Parts search is currently unavailable' }
    });
    await wrapperInstance.handleInputChange('searchInput', 'ab');
    expect(spy).toHaveBeenCalledWith();
    spy.mockReset();
    spy.mockRestore();
  });

  it('should call searchParts action when input text length is greater than 1', () => {
    spy = jest.spyOn(props.actions, 'searchParts');
    wrapperInstance.handleInputChange('searchInput', 'ab');
    expect(spy).toHaveBeenCalled();
    spy.mockReset();
    spy.mockRestore();
  });

  it('should set workOrderNumber on id workOrderNumber when handleInputChange is called', () => {
    wrapper.setState({ workOrderNumber: '123' });
    wrapperInstance.handleInputChange('workOrderNumber', 'ab');
    expect(wrapper.state().workOrderNumber).toBe('ab');
  });

  it('should do nothing when undefined id is called with handleInputChange', () => {
    wrapper.setState({ workOrderNumber: 'value' });
    wrapperInstance.handleInputChange('mockId', 'test');
    expect(wrapper.state().workOrderNumber).toBe('value');
  });

  it('should call adjustQuantity action in handleAdjustQuantity is called', () => {
    spy = jest.spyOn(props.actions, 'adjustQuantity');
    wrapper.setProps({ cart: [part] });
    wrapperInstance.handleAdjustQuantity('mockPartNumber', 2);
    expect(spy).toHaveBeenCalledWith(0, 2);
    spy.mockReset();
    spy.mockRestore();
  });

  it('should not call adjustQuantity action in handleAdjustQuantity if cart doesn\'t contain the partNbr', () => {
    spy = jest.spyOn(props.actions, 'adjustQuantity');
    wrapper.setProps({ cart: [] });
    wrapperInstance.handleAdjustQuantity('mockPartNumber', 2);
    expect(spy).not.toHaveBeenCalledWith();
    spy.mockReset();
    spy.mockRestore();
  });

  it('should call addToCart when adding a new part to cart when handleSelectedPart called', () => {
    spy = jest.spyOn(props.actions, 'addToCart');
    wrapperInstance.handleSelectedPart(part);
    expect(spy).toHaveBeenCalledWith(part);
    spy.mockReset();
    spy.mockRestore();
  });

  it('should not call addToCart and show info message when ediFlag is N', () => {
    const partWithNonEdi = {
      partNbr: 'mockPartNumber',
      partDescription: 'mockDescription',
      brandName: 'mockbrandName',
      quanitity: 1,
      ediFlag: 'N'
    };

    const addToCartSpy = jest.spyOn(props.actions, 'addToCart');
    const showInfoMsgSpy = jest.spyOn(props.actions, 'showInfoMessage');
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
    wrapperInstance.handleSelectedPart(partWithNonEdi);
    expect(addToCartSpy).not.toHaveBeenCalledWith(part);
    expect(showInfoMsgSpy).toHaveBeenCalledWith('Part Not Available. This part is currently unavailable to order. Please use Legacy Tool Rental to order this part.');
    expect(setTimeoutSpy).toHaveBeenCalled();
  });

  it('should call removeFromCart when removing existing part in cart when handleSelectedPart called', () => {
    spy = jest.spyOn(props.actions, 'removeFromCart');
    props.cart = [
      {
        ...part,
        partDescription: 'anotherPart',
        partNbr: '01-0123'
      },
      part
    ];

    shallow(<OrderParts {...props} />)
      .instance()
      .handleSelectedPart(part);
    expect(spy).toHaveBeenCalledWith(1);
    spy.mockReset();
    spy.mockRestore();
  });

  it('should set modal and disableSubmit on submitOrder call', () => {
    wrapper.setState({
      disableSubmit: false,
      modal: null
    });
    wrapperInstance.submitOrder();
    expect(wrapper.state().disableSubmit).toBe(true);
    expect(wrapper.state().modal.type.name).toBe('ConfirmationModal');
  });

  it('should set modal to null and disableSubmit to false on secondary click of confirmationModal', () => {
    wrapper.setState({
      workOrderNumber: '',
      disableSubmit: false,
      modal: null
    });
    wrapperInstance.submitOrder();
    expect(wrapper.state()).toMatchObject({
      disableSubmit: true,
      modal: (
        <ConfirmationModal
          onPrimaryClick={wrapperInstance.confirmationModalPrimaryClick}
          onSecondaryClick={wrapperInstance.confirmationModalSecondaryClick}
        />
      )
    });
    wrapperInstance.confirmationModalSecondaryClick();
    expect(wrapper.state()).toMatchObject({
      workOrderNumber: '',
      disableSubmit: false,
      modal: null
    });
  });

  it('should set SuccesModal on confirmationModalPrimaryClick call on successful post', async () => {
    wrapper.setProps({
      actions: {
        ...props.actions,
        createPartsOrder: jest.fn(() => ({ type: CREATE_PARTS_ORDER_SUCCESS }))
      }
    });
    wrapper.setState({
      disableSubmit: false,
      modal: null
    });

    await wrapperInstance.confirmationModalPrimaryClick();
    expect(wrapper.state().modal.type.name).toBe('SuccessModal');
  });

  it('should set the state modal to null and disableSubmit to false on SuccessModalClick', async () => {
    wrapper.setProps({
      actions: {
        ...props.actions,
        createPartsOrder: jest.fn(() => ({ type: CREATE_PARTS_ORDER_SUCCESS }))
      }
    });
    wrapper.setState({
      disableSubmit: false,
      modal: null
    });

    const historySpy = jest.spyOn(props.history, 'push');

    // PrimaryClick
    await wrapperInstance.confirmationModalPrimaryClick();
    wrapperInstance.successModalPrimaryClick();

    expect(wrapper.state()).toMatchObject({
      disableSubmit: false,
      modal: null,
      workOrderNumber: ''
    });

    expect(historySpy).toHaveBeenCalledWith('home');

    // secondary click
    await wrapperInstance.confirmationModalPrimaryClick();
    wrapperInstance.successModalSecondaryClick();

    expect(wrapper.state()).toMatchObject({
      disableSubmit: false,
      modal: null,
      workOrderNumber: ''
    });

    expect(historySpy).toHaveBeenCalledWith('orderHistory');
  });

  it('should set the state modal to null and disableSubmit to false on FailureModalClick', async () => {
    wrapper.setProps({
      actions: {
        ...props.actions,
        createPartsOrder: jest.fn(() => ({ type: CREATE_PARTS_ORDER_FAILURE }))
      }
    });
    wrapper.setState({
      disableSubmit: false,
      modal: null
    });

    const historySpy = jest.spyOn(props.history, 'push');

    // PrimaryClick
    await wrapperInstance.confirmationModalPrimaryClick();
    wrapperInstance.failureModalPrimaryClick();

    expect(wrapper.state()).toMatchObject({
      disableSubmit: false,
      modal: null,
      workOrderNumber: ''
    });

    expect(historySpy).toHaveBeenCalledWith('home');

    // secondary click
    await wrapperInstance.confirmationModalPrimaryClick();
    wrapperInstance.failureModalSecondaryClick();

    expect(wrapper.state()).toMatchObject({
      disableSubmit: false,
      modal: null,
      workOrderNumber: ''
    });

    expect(historySpy).not.toHaveBeenCalledWith('');
  });

  it('should set SuccesModal on confirmationModalPrimaryClick call on successful post', async () => {
    wrapper.setProps({
      actions: {
        ...props.actions,
        createPartsOrder: jest.fn(() => ({ type: CREATE_PARTS_ORDER_FAILURE }))
      }
    });
    wrapper.setState({
      disableSubmit: false,
      modal: null
    });

    await wrapperInstance.confirmationModalPrimaryClick();
    expect(wrapper.state().modal.type.name).toBe('FailureModal');
  });
});
