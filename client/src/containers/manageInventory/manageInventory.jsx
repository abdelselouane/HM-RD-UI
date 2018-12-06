import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { searchParts } from '../../actions/partsSearchActions';
import * as InventoryActions from '../../actions/inventoryActions';
import Table from '../../components/table';
import TextInputField from '../../components/textInputField';
import SearchDropdown from '../../components/searchDropdown';

export class ManageInventory extends Component {
  static propTypes = {
    actions: PropTypes.shape({
      editItem: PropTypes.func.isRequired,
      addItem: PropTypes.func.isRequired,
      getInventory: PropTypes.func.isRequired,
      searchParts: PropTypes.func.isRequired
    }).isRequired,
    inventory: PropTypes.arrayOf(
      PropTypes.shape({
        partNbr: PropTypes.string,
        partDescription: PropTypes.string,
        brandName: PropTypes.string,
        location: PropTypes.string,
        allocatedQuantity: PropTypes.number,
        availableQuantity: PropTypes.number
      })
    ).isRequired,
    partsSearchResults: PropTypes.arrayOf(
      PropTypes.shape({
        partNbr: PropTypes.string,
        partDescription: PropTypes.string,
        brandName: PropTypes.string
      })
    ).isRequired
  };

  state = {
    editable: {
      key: '',
      availableQuantity: '',
      location: ''
    },
    searchInput: '',
    filterInput: '',
    isAddingNewPart: false,
    selectedPart: {
      partNbr: '',
      brandNbr: '',
      brandName: '',
      partDescription: '',
      totalQuantity: '',
      allocatedQuantity: '',
      availableQuantity: '',
      location: ''
    },
    isInValidAvaliableQtyInput: false
  };

  componentWillMount() {
    this.props.actions.getInventory();
  }

  columns = [
    {
      key: 'partNbr',
      name: 'Part Number',
      thProps: {
        paddingLeft: '20px !important'
      },
      tdProps: {
        paddingLeft: '20px !important'
      }
    },
    {
      key: 'partDescription',
      name: 'Description',
      useTitle: true,
      thProps: {
        width: '30%'
      },
      tdProps: {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        width: '30%'
      }
    },
    {
      key: 'brandName',
      name: 'Brand'
    },
    {
      key: 'totalQuantity',
      name: 'Total'
    },
    {
      key: 'allocatedQuantity',
      name: 'Allocated'
    },
    {
      key: 'availableQuantity',
      name: 'Available'
    },
    {
      key: 'location',
      name: 'Location'
    },
    {
      key: 'edit',
      name: 'Edit'
    }
  ];

  dropdownColumns = [
    {
      key: 'partNbr',
      name: 'Part Number'
    },
    {
      key: 'partDescription',
      name: 'Description',
      useTitle: true,
      tdProps: {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        width: '40%'
      }
    },
    {
      key: 'brandName',
      name: 'Brand'
    }
  ];

  editableFields = ['availableQuantity', 'location'];

  editableSelectedPartFields = ['selectedPartAvailableQuantity', 'selectedPartLocation'];

  partsSearchDropdownElementId = 'parts-search-dropdown';

  NUMBER_OF_ROWS = 7;

  handleFilterInventoryChange = (id, value) => this.setState({ [id]: value });

  handlePartSearchChange = (id, value) => {
    this.setState({ searchInput: value });
    if (value.length > 1) {
      this.props.actions.searchParts(value, this.NUMBER_OF_ROWS);
    }
  };

  handleEditChange = (id, value) => {
    if (this.editableFields.includes(id)) {
      this.setState(prevState => ({
        editable: {
          ...prevState.editable,
          [id]: id === 'availableQuantity' ? parseInt(value.substr(0, 2), 10) : value
        }
      }));
    }

    if (this.editableSelectedPartFields.includes(id)) {
      if (id === 'selectedPartAvailableQuantity') {
        this.setState(prevState => ({
          selectedPart: {
            ...prevState.selectedPart,
            availableQuantity: value
          }
        }));
      }

      if (id === 'selectedPartLocation') {
        this.setState(prevState => ({
          selectedPart: {
            ...prevState.selectedPart,
            location: value
          }
        }));
      }
    }
  };

  handleEditClick = ({ key, availableQuantity, location }) => {
    this.setState({
      isAddingNewPart: false,
      editable: { key, availableQuantity, location }
    });
  };

  handleSaveClick = ({ key, ...item }) => {
    const { availableQuantity, location } = this.state.editable;
    this.props.actions.editItem({
      ...item,
      availableQuantity,
      location
    });
    this.setState({
      editable: {
        key: '',
        availableQuantity: '',
        location: ''
      }
    });
  };

  partApiObject = (selectedPart) => {
    const availableQuantity =
       !Number.isFinite(selectedPart.availableQuantity)
         ? parseInt(selectedPart.availableQuantity || 0, 10)
         : selectedPart.availableQuantity;

    const allocatedQuantity =
      !Number.isFinite(selectedPart.allocatedQuantity)
        ? parseInt(selectedPart.allocatedQuantity || 0, 10)
        : selectedPart.allocatedQuantity;

    return {
      ...selectedPart,
      allocatedQuantity,
      availableQuantity
    };
  }

  handleSaveNewPart = () => {
    const { selectedPart } = this.state;
    const part = this.partApiObject(selectedPart);
    const {
      availableQuantity,
      allocatedQuantity,
      intialTotalQuantity,
      isExistingPart } = part;
    const newTotalQuantity = availableQuantity + allocatedQuantity;


    if (availableQuantity === 0 || newTotalQuantity < intialTotalQuantity) {
      this.setState({ isInValidAvaliableQtyInput: true });
    } else {
      if (isExistingPart) {
        this.props.actions.editItem(part);
      } else {
        this.props.actions.addItem(part);
      }
      this.handleManualInventory();
    }
  };

  handleManualInventory = () => {
    this.setState(prevState => ({
      searchInput: '',
      editable: {
        key: '',
        availableQuantity: '',
        location: ''
      },
      selectedPart: {
        partNbr: '',
        brandNbr: '',
        brandName: '',
        partDescription: '',
        allocatedQuantity: '',
        availableQuantity: '',
        intialTotalQuantity: 0,
        location: '',
        isExistingPart: false
      },
      isAddingNewPart: !prevState.isAddingNewPart,
      isInValidAvaliableQtyInput: false
    }));
  };

  handlePartSearchClick = row => {
    const { key, ...partInfo } = row;
    const part = {
      ...partInfo
    };
    const { inventory } = this.props;
    const matchingPart = inventory.filter(
      item => item.partNbr === part.partNbr && item.brandNbr === part.brandNbr
    );
    if (matchingPart[0]) {
      const { availableQuantity, allocatedQuantity } = this.partApiObject(matchingPart[0]);
      const intialTotalQuantity = availableQuantity + allocatedQuantity;
      this.setState({
        selectedPart: {
          ...matchingPart[0],
          totalQuantity: intialTotalQuantity,
          intialTotalQuantity,
          isExistingPart: true,
        }
      });
    } else {
      this.setState({
        selectedPart: {
          ...part,
          isExistingPart: false,
        }
      });
    }
  };

  createNewRow = () => ({
    partNbr:
      this.state.selectedPart.partNbr === '' ? (
        <SearchDropdown
          className="search"
          searchKey="partNbr"
          parentSelector="tr:first-child td.part-number-col"
          columns={this.dropdownColumns}
          rows={this.state.searchInput.length > 1 ? this.props.partsSearchResults.slice(0, this.NUMBER_OF_ROWS) : []}
          // portalId={this.partsSearchDropdownElementId}
          handleInputChange={this.handlePartSearchChange}
          handleSelectClick={this.handlePartSearchClick}
          showHeader={false}
          showResults
        />
      ) : (
        this.state.selectedPart.partNbr
      ),
    partDescription: this.state.selectedPart.partDescription,
    brandName: this.state.selectedPart.brandName,
    allocatedQuantity: this.state.selectedPart.allocatedQuantity,
    totalQuantity: this.state.selectedPart.totalQuantity,
    key: 'Auto Complete',
    availableQuantity: (
      <TextInputField
        className={`available-quantity input-field ${this.state.isInValidAvaliableQtyInput ? 'error' : ''} `}
        id="selectedPartAvailableQuantity"
        onChange={this.handleEditChange}
        value={parseInt(this.state.selectedPart.availableQuantity, 10) || ''}
        type="number"
        min="1"
        max="99"
      />
    ),
    location: (
      <TextInputField
        className="location input-field"
        id="selectedPartLocation"
        onChange={this.handleEditChange}
        value={this.state.selectedPart.location || ''}
        maxLength={10}
      />
    ),
    edit: (
      <button
        className="button tertiary sm"
        onClick={this.handleSaveNewPart}
        disabled={!this.state.selectedPart.brandNbr}
      >
        Save
      </button>
    )
  });

  render() {
    const { inventory } = this.props;
    const { filterInput, isAddingNewPart } = this.state;
    const rows = inventory
      .filter(
        ({ partNbr, partDescription }) =>
          partNbr.toLowerCase().includes(filterInput.toLowerCase()) ||
          partDescription.toLowerCase().includes(filterInput.toLowerCase())
      )
      .map(item => {
        const row = {
          ...item,
          totalQuantity: item.availableQuantity + item.allocatedQuantity,
          key: item.partNbr
        };
        if (this.state.editable.key === row.key) {
          return {
            ...row,
            availableQuantity: (
              <TextInputField
                className="available-quantity input-field"
                id="availableQuantity"
                onChange={this.handleEditChange}
                value={this.state.editable.availableQuantity}
                type="number"
                min="0"
                max="99"
              />
            ),
            location: (
              <TextInputField
                className="location input-field"
                id="location"
                onChange={this.handleEditChange}
                value={this.state.editable.location}
                maxLength={10}
                setFocusOnMount
              />
            ),
            edit: (
              <button className="button tertiary sm" onClick={() => this.handleSaveClick(row)}>
                Save
              </button>
            )
          };
        }
        return {
          ...row,
          location: row.location.length === 0 ? '--' : row.location,
          edit: (
            <button className="button tertiary sm" onClick={() => this.handleEditClick(row)}>
              <i className="icon_pencil" />
            </button>
          )
        };
      });

    if (isAddingNewPart) {
      rows.unshift(this.createNewRow());
    }

    return (
      <React.Fragment>
        <div className="search-container">
          <TextInputField
            className="search"
            icon={{ className: 'icon_search' }}
            id="filterInput"
            onChange={this.handleFilterInventoryChange}
            placeholder="Type to search for a part in inventory"
          />
          <button
            className={`manage-inv ${!isAddingNewPart ? 'primary' : ''} loader-btn`}
            onClick={this.handleManualInventory}
          >
            {isAddingNewPart ? 'Cancel' : 'Manually Add Inventory'}
          </button>
        </div>
        {/* <div className="text-input-container error">
          <input type="text" id="error" name="error" title="Error" />
          <p className="error-msg">Sample Error Message</p>
        </div> */}
        <Table columns={this.columns} rows={rows} showResults={rows.length > 0} />
        <div id={this.partsSearchDropdownElementId} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  inventory: state.inventory.items,
  partsSearchResults: state.partsSearch.results
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...InventoryActions, searchParts }, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageInventory);
