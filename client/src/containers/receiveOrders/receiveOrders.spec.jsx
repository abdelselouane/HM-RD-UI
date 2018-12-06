/* global describe, beforeAll, it, expect, jest */
import React from 'react';
import ReactDOM from 'react-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { ReceiveOrders } from './receiveOrders';

import Table from '../../components/table';
import { consolidateStreamedStyles } from 'styled-components';

jest.mock('../../actions/purchaseOrdersActions', () => ({
  getPurchaseOrders: () => dispatch => dispatch({ type: 'MOCK' })
}));

describe('<ReceiveOrders />', () => {
  let wrapper;
  let props;
  let mockOrder1;
  let mockOrder2;
  let mockInventory;

  const mockPart1 = {
    partNbr: '310-0101',
    brandNbr: 1001,
    brandName: 'MAKITA',
    partLocation: '',
    quantityOrdered: 1,
    partDescription: 'GASKET, TRANSMISSION',
    partsOrderDetailId: 1,
    previousQuantityReceived: 1,
    currentQuantityReceived: 0
  };

  const mockPart2 = {
    partNbr: '310-0102',
    brandNbr: 1001,
    brandName: 'MAKITA',
    partLocation: '',
    quantityOrdered: 10,
    partDescription: 'GASKET, TRANSMISSION-2',
    partsOrderDetailId: 2,
    previousQuantityReceived: 1,
    currentQuantityReceived: 0
  };

  const payLoad = {
    locationNbr: '9710',
    partsDetails:
      [{
        brandName: 'MAKITA',
        brandNbr: 1001,
        currentQuantityReceived: 1,
        partDescription: 'GASKET, TRANSMISSION-2',
        partLocation: '',
        partNbr: '310-0103',
        previousQuantityReceived: 1,
        quantityOrdered: 10
      }],
    partsOrderId: 1,
    purchaseOrderNbr: '971072952'
  };

  const updatedPayLoad = {
    locationNbr: '9710',
    partsDetails:
      [{
        partNbr: '310-0101',
        brandNbr: 1001,
        brandName: 'MAKITA',
        partLocation: '',
        quantityOrdered: 1,
        partDescription: 'GASKET, TRANSMISSION',
        previousQuantityReceived: 1,
        currentQuantityReceived: 0
      },
      {
        brandName: 'MAKITA',
        brandNbr: 1001,
        currentQuantityReceived: 1,
        partDescription: 'GASKET, TRANSMISSION-2',
        partLocation: '',
        partNbr: '310-0103',
        previousQuantityReceived: 1,
        quantityOrdered: 10
      }
      ],
    partsOrderId: 1,
    purchaseOrderNbr: '971072952'
  };

  beforeAll(() => {
    ReactDOM.createPortal = jest.fn();
    mockOrder1 = {
      locationNbr: '9710',
      orderCreatedDate: '2018-06-04',
      workOrderNbr: 'mock#',
      purchaseOrderStatDesc: 'SUBMITTED',
      purchaseOrderNbr: '971072952',
      partsOrderId: 1,
      partsDetails: [mockPart1, mockPart2]
    };
    mockOrder2 = {
      locationNbr: '9710',
      orderCreatedDate: '2018-06-04',
      workOrderNbr: 'mock#',
      purchaseOrderStatDesc: 'SUBMITTED',
      purchaseOrderNbr: '871072952',
      partsOrderId: 1,
      partsDetails: [mockPart1, mockPart2]
    };

    mockInventory = {
      allocatedQuantity: 0,
      availableQuantity: 10,
      brandName: 'Eddy Floor Scraper',
      brandNbr: 1028,
      location: 'A4',
      partDescription: 'GASKET, TRANSMISSION',
      partNbr: '310-0101',
      storeNbr: '9710'
    };

    props = {
      actions: {
        getPurchaseOrders: async () => ({ payload: [mockOrder1] }),
        updateReceivePartOrder: jest.fn(),
        showSuccessMessage: jest.fn(),
        showMessage: jest.fn()
      },
      orders: [mockOrder1],
      inventory: [mockInventory],
      updatePartOrdersError: false
    };


    wrapper = shallow(<ReceiveOrders {...props} />);
  });

  it('should render properly', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render page with open order table', () => {
    expect(wrapper.find(Table)).toHaveLength(1);
  });

  it('should call handleReceivePart when Receive Part button is clicked', () => {
    const wrapperInstance = wrapper.instance();
    wrapper.find(Table).shallow().find('.receive-col').first()
      .simulate('click');
    wrapperInstance.handleReceivePart('971072952');
    const mockPart1Ar = [mockPart1, mockPart2];
    expect(wrapperInstance.state.selectedPurchaseOrderNbr).toBe('971072952');
    expect(wrapperInstance.state.selectedParts).toMatchObject(mockPart1Ar);
    expect(wrapperInstance.state.showReceivePartModal).toBe(true);
  });

  it('should open modal when receive order button is clicked', () => {
    const wrapperInstance = wrapper.instance();
    wrapperInstance.handleReceivePart('971072952');
    expect(wrapperInstance.state.showReceivePartModal).toBe(true);
  });

  it('should close modal when handleCloseModal is called', () => {
    const wrapperInstance = wrapper.instance();
    wrapperInstance.handleCloseModal();
    expect(wrapperInstance.state.showReceivePartModal).toBe(false);
  });

  it('should set the currentQuantityReceived on handleCounterChange', () => {
    const wrapperInstance = wrapper.instance();
    wrapperInstance.handleReceivePart('971072952');
    expect(wrapperInstance.state.showReceivePartModal).toBe(true);
    wrapperInstance.handleCounterChange('310-0102', 5);
    expect(wrapperInstance.state.selectedParts[0].currentQuantityReceived).toEqual(0);
    expect(wrapperInstance.state.selectedParts[1].currentQuantityReceived).toEqual(5);
  });

  it('should set the sortedColumn on handleSortClick', () => {
    const column = 'purchaseOrderNbr';
    const wrapperInstance = wrapper.instance();
    wrapperInstance.handleSortClick(column);
    expect(wrapperInstance.columns[1].orderBy.className).toEqual('ascending');
    expect(wrapperInstance.state.sortedColumn).toEqual(column);
    wrapperInstance.handleSortClick(column);
    expect(wrapperInstance.state.sortedColumn).toEqual(column);
    expect(wrapperInstance.columns[1].orderBy.className).toEqual('descending');
  });

  it('should sort the orders on getSortedOrders with orderCreatedDate', () => {
    const wrapperInstance = wrapper.instance();
    const order1 = {
      locationNbr: '9710',
      orderCreatedDate: '2018-06-04',
      workOrderNbr: 'mock#',
      purchaseOrderStatDesc: 'SUBMITTED',
      purchaseOrderNbr: '971072952',
      partsOrderId: 1,
      partsDetails: [mockPart1, mockPart2]
    };
    const order2 = {
      locationNbr: '9710',
      orderCreatedDate: '2018-06-04',
      workOrderNbr: 'mock#',
      purchaseOrderStatDesc: 'SUBMITTED',
      purchaseOrderNbr: '871072952',
      partsOrderId: 1,
      partsDetails: [mockPart1, mockPart2]
    };
    const order3 = {
      locationNbr: '9710',
      orderCreatedDate: '2017-06-04',
      workOrderNbr: 'mock#',
      purchaseOrderStatDesc: 'SUBMITTED',
      purchaseOrderNbr: '971072952',
      partsOrderId: 1,
      partsDetails: [mockPart1, mockPart2]
    };

    wrapperInstance.setState({ sortedColumn: 'orderCreatedDate' });
    wrapperInstance.columns[0].orderBy.className = 'descending';
    const sortedOrders1 = wrapperInstance.getSortedOrders([order1, order2]);
    expect(sortedOrders1[0]).toMatchObject(order1);

    wrapperInstance.columns[0].orderBy.className = 'descending';
    const sortedOrders2 = wrapperInstance.getSortedOrders([order1, order3]);
    expect(sortedOrders2[0]).toMatchObject(order3);

    wrapperInstance.columns[0].orderBy.className = 'descending';
    const sortedOrders3 = wrapperInstance.getSortedOrders([order3, order1]);
    expect(sortedOrders3[0]).toMatchObject(order3);

    wrapperInstance.columns[0].orderBy.className = 'ascending';
    const sortedOrders4 = wrapperInstance.getSortedOrders([order1, order2]);
    expect(sortedOrders4[0]).toMatchObject(order1);

    wrapperInstance.columns[0].orderBy.className = 'ascending';
    const sortedOrders5 = wrapperInstance.getSortedOrders([order1, order3]);
    expect(sortedOrders5[0]).toMatchObject(order1);

    wrapperInstance.columns[0].orderBy.className = 'ascending';
    const sortedOrders6 = wrapperInstance.getSortedOrders([order3, order1]);
    expect(sortedOrders6[0]).toMatchObject(order1);
  });

  it('should handle partLocation change on handleCounterChange', () => {
    const wrapperInstance = wrapper.instance();
    wrapperInstance.handleReceivePart('971072952');
    expect(wrapperInstance.state.showReceivePartModal).toBe(true);
    const mockEvent = {
      target: {
        value: 'A12',
      }
    };
    wrapperInstance.handleLocationChange('310-0101', mockEvent);
    expect(wrapperInstance.state.selectedParts[0].partLocation).toEqual('A12');
  });

  it('should handle save receive part', () => {
    const mockHandleUpdateReceivePartOrder = jest.fn();

    const mockPart = {
      partNbr: '310-0103',
      brandNbr: 1001,
      brandName: 'MAKITA',
      partLocation: '',
      quantityOrdered: 10,
      partDescription: 'GASKET, TRANSMISSION-2',
      partsOrderDetailId: 2,
      previousQuantityReceived: 1,
      currentQuantityReceived: 1
    };

    const mockPart1Ar = [mockPart1, mockPart];

    const wrapperInstance = wrapper.instance();
    wrapperInstance.handleUpdateReceivePartOrder = mockHandleUpdateReceivePartOrder;
    wrapper.instance().forceUpdate();
    wrapperInstance.state.selectedParts = mockPart1Ar;
    wrapperInstance.state.selectedPurchaseOrderNbr = '971072952';
    wrapperInstance.handleSaveReceivePart();
    expect(wrapperInstance.state.selectedParts[0].invalidQuantity).toBe(undefined);
    expect(wrapperInstance.state.selectedParts[1].invalidQuantity).toBe(undefined);
    expect(mockHandleUpdateReceivePartOrder).toBeCalledWith(updatedPayLoad);
  });

  it('should highlight receiving text box when saving with no quantity', () => {
    const mockHandleUpdateReceivePartOrder = jest.fn();

    const mockPart = {
      partNbr: '310-0103',
      brandNbr: 1001,
      brandName: 'MAKITA',
      partLocation: '',
      quantityOrdered: 10,
      partDescription: 'GASKET, TRANSMISSION-2',
      partsOrderDetailId: 2,
      previousQuantityReceived: 1,
      currentQuantityReceived: 0
    };

    const mockPart1Ar = [mockPart];

    const wrapperInstance = wrapper.instance();
    wrapperInstance.handleUpdateReceivePartOrder = mockHandleUpdateReceivePartOrder;
    wrapper.instance().forceUpdate();
    wrapperInstance.state.selectedParts = mockPart1Ar;
    wrapperInstance.state.selectedPurchaseOrderNbr = '971072952';
    wrapperInstance.handleSaveReceivePart();
    expect(wrapperInstance.state.selectedParts[0].invalidQuantity).toBe(true);
  });

  it('should handle UpdateReceivePartOrder for showSuccessMessage', async () => {
    wrapper = shallow(<ReceiveOrders {...props} />);
    const wrapperInstance = wrapper.instance();
    const spy = jest.spyOn(props.actions, 'updateReceivePartOrder');
    const showSuccessMessageSpy = jest.spyOn(props.actions, 'showSuccessMessage');
    wrapper.setProps({ updatePartOrdersError: false });
    await wrapperInstance.handleUpdateReceivePartOrder(payLoad);
    expect(spy).toBeCalledWith(payLoad);
    expect(showSuccessMessageSpy).toBeCalledWith('Parts Received: The parts have been received in to your inventory');
    spy.mockReset();
    spy.mockRestore();
    showSuccessMessageSpy.mockReset();
    showSuccessMessageSpy.mockRestore();
  });

  it('should handle UpdateReceivePartOrder for showMessage', async () => {
    const wrapperInstance = wrapper.instance();
    const showMessageSpy = jest.spyOn(props.actions, 'showMessage');
    wrapper.setProps({ updatePartOrdersError: true });
    await wrapperInstance.handleUpdateReceivePartOrder(payLoad);
    expect(showMessageSpy).toBeCalledWith('System Failure: Unable to receive parts, please try again later');
    showMessageSpy.mockReset();
    showMessageSpy.mockRestore();
  });

  it('should call getPurchaseOrders action on componentWillMount', () => {
    const spy = jest.spyOn(props.actions, 'getPurchaseOrders');
    const wrapperInstance = wrapper.instance();
    wrapperInstance.componentWillMount();
    expect(spy).toHaveBeenCalled();
  });

  it('should render properly with selectedParts in state ', () => {
    const mockPart = {
      partNbr: '310-0103',
      brandNbr: 1001,
      brandName: 'MAKITA',
      partLocation: '',
      quantityOrdered: 10,
      partDescription: 'GASKET, TRANSMISSION-2',
      partsOrderDetailId: 2,
      previousQuantityReceived: 1,
      currentQuantityReceived: 1
    };

    const inventoryWithNoLocation = {
      allocatedQuantity: 0,
      availableQuantity: 10,
      brandName: 'Eddy Floor Scraper',
      brandNbr: 1028,
      location: '',
      partDescription: 'GASKET, TRANSMISSION',
      partNbr: '310-0101',
      storeNbr: '9710'
    };

    const mockSelectedParts = [mockPart];
    wrapper.setState({ selectedParts: mockSelectedParts });
    wrapper.setProps({ inventory: [inventoryWithNoLocation] });
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
