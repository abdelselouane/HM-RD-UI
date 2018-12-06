/* global describe, beforeAll, it, expect, jest, afterEach */
import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { ManageInventory } from './manageInventory';

import Table from '../../components/table';

describe('<ManageInventory />', () => {
  let wrapper;
  let mockInventory;
  let props;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    mockInventory = [
      {
        partNbr: 'QZS-12-A012',
        partDescription: 'THIS IS A TEST DESC 1',
        brandName: 'a1234',
        brandNbr: '1111',
        location: 'A6',
        availableQuantity: 3,
        allocatedQuantity: 1
      },
      {
        partNbr: '1KJA-1A2-91',
        partDescription: 'THIS IS A TEST DESC 2',
        brandName: 'xyz90',
        location: 'B7',
        availableQuantity: 12,
        allocatedQuantity: 1
      },
      {
        partNbr: 'QZS-12-A013',
        partDescription: 'THIS IS A TEST DESC 3',
        brandName: 'a1234',
        location: 'A6',
        availableQuantity: 3,
        allocatedQuantity: 1
      },
      {
        partNbr: '2KJA-1A2-91',
        partDescription: 'THIS IS A TEST DESC 4',
        brandName: '1234',
        location: 'B7',
        availableQuantity: 12,
        allocatedQuantity: 1
      },
      {
        partNbr: 'QZS-12-A014',
        partDescription: 'THIS IS A TEST DESC 5',
        brandName: '1234',
        location: 'A6',
        availableQuantity: 3,
        allocatedQuantity: 1
      },
      {
        partNbr: '3KJA-1A2-91',
        partDescription: 'THIS IS A TEST DESC 6',
        brandName: '1234',
        location: 'B7',
        availableQuantity: 12,
        allocatedQuantity: 1
      },
      {
        partNbr: 'QZS-12-A015',
        partDescription: 'THIS IS A TEST DESC 7',
        brandName: 'xyz90',
        location: 'A6',
        availableQuantity: 3,
        allocatedQuantity: 1
      },
      {
        partNbr: '4KJA-1A2-91',
        partDescription: 'THIS IS A TEST DESC 8',
        brandName: 'xyz90',
        location: 'B7',
        availableQuantity: 12,
        allocatedQuantity: 1
      },
      {
        partNbr: 'QZS-12-A016',
        partDescription: 'THIS IS A TEST DESC 9',
        brandName: '1234-1',
        location: 'A6',
        availableQuantity: 3,
        allocatedQuantity: 1
      },
      {
        partNbr: '5KJA-1A2-91',
        partDescription: 'THIS IS A TEST DESC 10',
        brandName: 'xyz90-1',
        location: '',
        availableQuantity: 12,
        allocatedQuantity: 1
      }
    ];

    props = {
      inventory: mockInventory,
      actions: {
        addItem: jest.fn(),
        editItem: jest.fn(),
        getInventory: jest.fn(),
        searchParts: jest.fn()
      },
      partsSearchResults: []
    };

    wrapper = shallow(<ManageInventory {...props} />);
  });

  it('should render properly', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render properly when isAddingNewPart is true', () => {
    wrapper.setState({ isAddingNewPart: true });
    expect(toJson(wrapper)).toMatchSnapshot();
    wrapper.setState({ isAddingNewPart: false });
  });

  it('should call handleEditClick on Edit button press', () => {
    const instance = wrapper.instance();
    const spy = jest.spyOn(instance, 'handleEditClick');
    const editButton = shallow(wrapper.find(Table).props().rows[0].edit);
    editButton.simulate('click');

    const expectedArgs = {
      ...mockInventory[0],
      key: mockInventory[0].partNbr,
      totalQuantity: mockInventory[0].availableQuantity + mockInventory[0].allocatedQuantity
    };
    expect(spy).toHaveBeenCalledWith(expectedArgs);
  });

  it('should call handleSaveClick on Save button press', () => {
    const instance = wrapper.instance();
    const spy = jest.spyOn(instance, 'handleSaveClick');
    wrapper.setState({
      editable: {
        key: mockInventory[0].partNbr,
        availableQuantity: mockInventory[0].availableQuantity,
        location: mockInventory[0].location
      }
    });

    const saveButton = shallow(wrapper.find(Table).props().rows[0].edit);
    saveButton.simulate('click');

    const expectedArgs = {
      ...mockInventory[0],
      key: mockInventory[0].partNbr,
      totalQuantity: mockInventory[0].availableQuantity + mockInventory[0].allocatedQuantity
    };
    expect(spy).toHaveBeenCalledWith(expectedArgs);
  });

  it('should set state.editable and call actions.editItem on handleSaveClick', () => {
    const instance = wrapper.instance();
    const spy = jest.spyOn(props.actions, 'editItem');
    wrapper.setState({
      editable: {
        key: mockInventory[0].partNbr,
        availableQuantity: 20,
        location: 'A7'
      }
    });

    instance.handleSaveClick(mockInventory[0]);

    const expectedArgs = {
      ...mockInventory[0],
      availableQuantity: 20,
      location: 'A7'
    };
    expect(spy).toHaveBeenCalledWith(expectedArgs);
    expect(instance.state.editable).toMatchObject({
      key: '',
      availableQuantity: '',
      location: ''
    });
  });

  it('should set state.editable on handleEditClick', () => {
    const instance = wrapper.instance();
    wrapper.setState({
      editable: {
        key: '',
        availableQuantity: '',
        location: ''
      }
    });
    const row = {
      key: '1',
      availableQuantity: '1',
      location: '1'
    };

    instance.handleEditClick(row);

    expect(instance.state.editable).toMatchObject({
      key: '1',
      availableQuantity: '1',
      location: '1'
    });
  });

  describe('handleEditChange', () => {
    it('should handle edit on input field on given id/val pair', () => {
      const instance = wrapper.instance();
      wrapper.setState({
        editable: {
          key: '1',
          availableQuantity: 1,
          location: '1'
        },
        selectedPart: {
          availableQuantity: 1
        }
      });

      instance.handleEditChange('availableQuantity', '3');

      expect(instance.state.editable).toMatchObject({
        key: '1',
        availableQuantity: 3,
        location: '1'
      });

      instance.handleEditChange('location', '3');

      expect(instance.state.editable).toMatchObject({
        key: '1',
        availableQuantity: 3,
        location: '3'
      });

      instance.handleEditChange('key', '3');

      expect(instance.state.editable).toMatchObject({
        key: '1',
        availableQuantity: 3,
        location: '3'
      });

      instance.handleEditChange('selectedPartAvailableQuantity', '3');
      expect(instance.state.selectedPart).toMatchObject({
        availableQuantity: '3'
      });

      instance.handleEditChange('selectedPartLocation', 'C11');
      expect(instance.state.selectedPart).toMatchObject({
        location: 'C11'
      });
    });

    it('should only allow a max length of 2 to be set to editable.state.availableQuantity', () => {
      const instance = wrapper.instance();
      wrapper.setState({
        editable: {
          key: '1',
          availableQuantity: 99,
          location: '1'
        }
      });

      instance.handleEditChange('availableQuantity', '999');

      expect(instance.state.editable).toMatchObject({
        key: '1',
        availableQuantity: 99,
        location: '1'
      });
    });
  });

  it('should render a row as an editable row if key matches state.editable.key', () => {
    const mockHandleEditChange = jest.fn();
    wrapper.instance().handleEditChange = mockHandleEditChange;

    wrapper.setState({ rows: mockInventory });
    expect(wrapper.find(Table).props().rows[0]).toMatchObject({
      location: mockInventory[0].location,
      availableQuantity: mockInventory[0].availableQuantity
    });

    wrapper.setState({
      editable: {
        key: mockInventory[0].partNbr,
        availableQuantity: mockInventory[0].availableQuantity,
        location: mockInventory[0].location
      }
    });
    expect(wrapper.find(Table).props().rows[0].availableQuantity.props).toMatchObject({
      className: 'available-quantity input-field',
      value: 3,
      id: 'availableQuantity',
      onChange: mockHandleEditChange
    });
  });

  describe('table filter functionality', () => {
    it('should not filter inventory with initial state.filterInput and inventory is empty', () => {
      wrapper.setProps({ inventory: [] });
      const expectedLength = 0;
      const initialState = {
        filterInput: ''
      };
      wrapper.setState(initialState);
      const initialRows = wrapper.find(Table).props().rows;
      expect(initialRows).toHaveLength(expectedLength);
    });

    it('should not filter inventory with initial state.filterInput and inventory has items', () => {
      wrapper.setProps({ inventory: mockInventory });
      const expectedLength = mockInventory.length;
      const initialState = {
        filterInput: ''
      };
      wrapper.setState(initialState);
      const initialRows = wrapper.find(Table).props().rows;
      expect(initialRows).toHaveLength(expectedLength);
    });

    it('should filter inventory on partNbr with given state.filterInput', () => {
      wrapper.setProps({ inventory: mockInventory });
      const initialState = {
        filterInput: ''
      };
      wrapper.setState(initialState);
      const initialRows = wrapper.find(Table).props().rows;

      const mockSearchInput = 'QZS-12-A012';
      const mockFilteredRows = initialRows.filter(({ partNbr }) =>
        partNbr.includes(mockSearchInput)
      );
      const expectedLength = mockFilteredRows.length;

      wrapper.setState({ filterInput: mockSearchInput });
      const actualFiltedRows = wrapper.find(Table).props().rows;
      expect(actualFiltedRows).toHaveLength(expectedLength);
    });

    it('should filter inventory on Desc with given state.filterInput', () => {
      wrapper.setProps({ inventory: mockInventory });
      const initialState = {
        filterInput: ''
      };
      wrapper.setState(initialState);
      const initialRows = wrapper.find(Table).props().rows;

      const mockSearchInput = 'THIS IS A TEST DESC 1';
      const mockFilteredRows = initialRows.filter(({ partDescription }) =>
        partDescription.includes(mockSearchInput)
      );
      const expectedLength = mockFilteredRows.length;

      wrapper.setState({ filterInput: mockSearchInput });
      const actualFiltedRows = wrapper.find(Table).props().rows;
      expect(actualFiltedRows).toHaveLength(expectedLength);
    });

    it('should filter inventory on PartNum and Desc with given state.filterInput', () => {
      wrapper.setProps({ inventory: mockInventory });
      const initialState = {
        filterInput: ''
      };
      wrapper.setState(initialState);
      const initialRows = wrapper.find(Table).props().rows;

      const mockSearchInput = 'a1';
      const mockFilteredRows = initialRows.filter(
        ({ partNbr, partDescription }) =>
          partNbr.includes(mockSearchInput) || partDescription.includes(mockSearchInput)
      );
      const expectedLength = mockFilteredRows.length;

      wrapper.setState({ filterInput: mockSearchInput });
      const actualFiltedRows = wrapper.find(Table).props().rows;
      expect(actualFiltedRows).toHaveLength(expectedLength);
    });
  });

  it('should change state when calling handleFilterInventoryChange', () => {
    const instance = wrapper.instance();
    const initialState = {
      filterInput: ''
    };
    wrapper.setState(initialState);
    instance.handleFilterInventoryChange('filterInput', 'mock');

    expect(wrapper.state().filterInput).toBe('mock');
  });

  it('Should set state to enable false, remove primary styles and add cancel text', () => {
    wrapper.setState({ isAddingNewPart: false });
    const instance = wrapper.instance();

    instance.handleManualInventory();
    expect(instance.state.isAddingNewPart).toBe(true);
  });

  it('should not call actions.searchParts if value arg in handlePartSearchChange has length less than 2', () => {
    wrapper.setState({ searchInput: '' });
    const instance = wrapper.instance();
    const spy = jest.spyOn(props.actions, 'searchParts');

    instance.handlePartSearchChange(null, 'a');
    expect(spy).not.toHaveBeenCalledWith('a');
  });

  it('should call actions.searchParts if value arg in handlePartSearchChange has length greater than 1', () => {
    wrapper.setState({ searchInput: '' });
    const instance = wrapper.instance();
    instance.NUMBER_OF_ROWS = 7;
    const spy = jest.spyOn(props.actions, 'searchParts');

    instance.handlePartSearchChange(null, 'abc');
    expect(spy).toHaveBeenCalledWith('abc', 7);
  });

  describe('handlePartSearchClick', () => {
    it('should set isExistingPart to true if selected row contains equal partNbr & brandNbr', () => {
      const instance = wrapper.instance();
      const row = {
        key: 'QZS-12-A012',
        partNbr: 'QZS-12-A012',
        partDescription: 'THIS IS A TEST DESC 1',
        brandName: 'a1234',
        brandNbr: '1111',
        location: 'A6',
        availableQuantity: 3,
        allocatedQuantity: 1
      };
      expect(shallow(instance.createNewRow().edit).prop('disabled')).toBe(true);
      instance.handlePartSearchClick(row);
      expect(instance.state.selectedPart).toMatchObject({
        partNbr: 'QZS-12-A012',
        partDescription: 'THIS IS A TEST DESC 1',
        brandName: 'a1234',
        brandNbr: '1111',
        location: 'A6',
        availableQuantity: 3,
        allocatedQuantity: 1,
        isExistingPart: true
      });
      expect(shallow(instance.createNewRow().edit).prop('disabled')).toBe(false);
    });

    it('should set isExistingPart to true if selected row contains equal partNbr & brandNbr', () => {
      const instance = wrapper.instance();
      const row = {
        key: 'QZS-12-A012',
        partNbr: 'QZS-12-A012',
        partDescription: 'THIS IS A TEST DESC 1',
        brandName: 'a1234',
        brandNbr: '1111',
        location: 'A6',
        availableQuantity: 3,
        allocatedQuantity: 1
      };
      instance.handlePartSearchClick(row);
      expect(instance.state.selectedPart).toMatchObject({
        partNbr: 'QZS-12-A012',
        partDescription: 'THIS IS A TEST DESC 1',
        brandName: 'a1234',
        brandNbr: '1111',
        location: 'A6',
        availableQuantity: 3,
        allocatedQuantity: 1,
        isExistingPart: true
      });
    });

    it('should set isExistingPart to false if selected row contains not equal partNbr & brandNbr', () => {
      const instance = wrapper.instance();
      const row = {
        key: 'XZZS-12-A012',
        partNbr: 'XZZS-12-A012',
        partDescription: 'THIS IS A TEST DESC 1',
        brandName: 'a1234'
      };
      instance.handlePartSearchClick(row);
      expect(instance.state.selectedPart).toMatchObject({
        partNbr: 'XZZS-12-A012',
        partDescription: 'THIS IS A TEST DESC 1',
        brandName: 'a1234',
        isExistingPart: false
      });
    });
  });

  describe('handleSaveNewPart', () => {
    it('Should set the state isInValidAvaliableQtyInput as true when selectedPart availableQuantity equal to zero', () => {
      const selectedPart = {
        partNbr: 'XZZS-12-A012',
        partDescription: 'THIS IS A TEST DESC 1',
        brandName: 'a1234',
        location: '',
        availableQuantity: '',
        allocatedQuantity: '',
      };
      wrapper.setState({ selectedPart });
      const instance = wrapper.instance();
      instance.handleSaveNewPart();
      expect(instance.state.isInValidAvaliableQtyInput).toBe(true);
    });

    it('Should set the state isInValidAvaliableQtyInput as true when selectedPart totalQuantity less than intialTotalQuantity', () => {
      const selectedPart = {
        partNbr: 'XZZS-12-A012',
        partDescription: 'THIS IS A TEST DESC 1',
        brandName: 'a1234',
        location: '',
        availableQuantity: '',
        allocatedQuantity: 10,
      };
      wrapper.setState({ selectedPart });
      const instance = wrapper.instance();
      instance.handleSaveNewPart();
      expect(instance.state.isInValidAvaliableQtyInput).toBe(true);
    });

    it('Should set the state isInValidAvaliableQtyInput as false when selectedPart totalQuantity greater than intialTotalQuantity', () => {
      const selectedPart = {
        partNbr: 'XZZS-12-A012',
        partDescription: 'THIS IS A TEST DESC 1',
        brandName: 'a1234',
        location: '',
        availableQuantity: '',
        allocatedQuantity: 10,
      };
      wrapper.setState({ selectedPart });
      const instance = wrapper.instance();
      instance.handleSaveNewPart();
      expect(instance.state.isInValidAvaliableQtyInput).toBe(true);
    });

    it('Should call the editItem and handleManualInventory method for the existing part when selectedPart totalQuantity greater than intialTotalQuantity', () => {
      const selectedPart = {
        partNbr: 'XZZS-12-A012',
        partDescription: 'THIS IS A TEST DESC 1',
        brandName: 'a1234',
        location: '',
        availableQuantity: 12,
        allocatedQuantity: 10,
        intialTotalQuantity: 10,
        isExistingPart: true
      };
      wrapper.setState({ selectedPart });
      const instance = wrapper.instance();
      const actionSpy = jest.spyOn(props.actions, 'editItem');
      const spy = jest.spyOn(instance, 'handleManualInventory');
      instance.handleSaveNewPart();
      const expectedPart = {
        partNbr: 'XZZS-12-A012',
        partDescription: 'THIS IS A TEST DESC 1',
        brandName: 'a1234',
        location: '',
        availableQuantity: 12,
        allocatedQuantity: 10,
        intialTotalQuantity: 10,
        isExistingPart: true
      };
      expect(actionSpy).toHaveBeenCalledWith(expectedPart);
      expect(spy).toHaveBeenCalled();
    });

    it('Should call the addItem and handleManualInventory method for the new part when selectedPart totalQuantity greater than intialTotalQuantity', () => {
      const selectedPart = {
        partNbr: 'XZZS-12-A012',
        partDescription: 'THIS IS A TEST DESC 1',
        brandName: 'a1234',
        location: '',
        availableQuantity: 12,
        allocatedQuantity: 0,
        intialTotalQuantity: 0,
        isExistingPart: false
      };
      wrapper.setState({ selectedPart });
      const instance = wrapper.instance();
      const actionSpy = jest.spyOn(props.actions, 'addItem');
      const spy = jest.spyOn(instance, 'handleManualInventory');
      instance.handleSaveNewPart();

      const expectedPart = {
        partNbr: 'XZZS-12-A012',
        partDescription: 'THIS IS A TEST DESC 1',
        brandName: 'a1234',
        location: '',
        availableQuantity: 12,
        allocatedQuantity: 0,
        intialTotalQuantity: 0,
        isExistingPart: false
      };
      expect(actionSpy).toHaveBeenCalledWith(expectedPart);
      expect(spy).toHaveBeenCalled();
    });
  });
});
