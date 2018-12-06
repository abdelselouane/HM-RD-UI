import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Table from '../table';
import TextInputField from '../textInputField';

const WorkOrderInput = ({ onChange }) => (
  <div className="work-order-number-container">
    <label
      className="work-order-number-label"
      htmlFor="work-order-number-input-value"
    >
      Work Order Number
    </label>
    <input
      className="work-order-number-input"
      id="work-order-number-input-value"
      type="text"
      onChange={({ target: { value } }) => onChange('workOrderNumber', value)}
    />
  </div>
);

WorkOrderInput.propTypes = {
  onChange: PropTypes.func.isRequired
};

const Loader = ({ className = '', size = 'lg' }) => (
  <div className={`loading-container ${className}`}>
    <div className={`progress-circular indeterminate ${size}`}>
      <div className="stroke">
        <div className="stroke-left" />
        <div className="stroke-right" />
      </div>
    </div>
  </div>
);

Loader.propTypes = {
  className: PropTypes.string,
  size: PropTypes.string
};

class SearchResults extends PureComponent {
  static propTypes = {
    results: PropTypes.arrayOf(
      PropTypes.shape({
        selected: PropTypes.bool,
        partNbr: PropTypes.string,
        partDescription: PropTypes.string,
        brandName: PropTypes.string,
        ediFlag: PropTypes.string
      }).isRequired
    ).isRequired,
    cart: PropTypes.arrayOf(
      PropTypes.shape({
        partNbr: PropTypes.string,
        partDescription: PropTypes.string,
        brandName: PropTypes.string,
        quantity: PropTypes.number
      }).isRequired
    ).isRequired,
    handleInputChange: PropTypes.func.isRequired,
    isLoading: PropTypes.bool
  };

  static defaultProps = {
    isLoading: false
  };

  state = {
    searchInput: ''
  };

  columns = [
    {
      name: 'Part Number',
      key: 'partNbr'
    },
    {
      name: 'Description',
      key: 'partDescription',
      thProps: {
        width: '50%'
      },
      tdProps: {
        width: '50%'
      }
    },
    {
      name: 'Brand',
      key: 'brandName'
    }
  ];

  handleInputChange = (id, input) => {
    if (id === 'searchInput') {
      this.setState({ [id]: input });
    }
    this.props.handleInputChange(id, input);
  };

  render() {
    const { results, cart, handleSelectedPart, isLoading } = this.props;
    const { searchInput } = this.state;
    const showResults = results.length > 0 && searchInput.length > 1;
    const rows = results.map(row => {
      const selected =
        cart.findIndex(
          item =>
            item.partNbr === row.partNbr &&
            item.brandName === row.brandName
        ) > -1;
      return {
        ...row,
        selected,
        key: row.partNbr
      };
    });
    return (
      <div className="order-parts-left search-results">
        <WorkOrderInput onChange={this.handleInputChange} />
        <TextInputField
          id="searchInput"
          className="part-search"
          icon={{ className: 'icon_search part-search-icon' }}
          onChange={this.handleInputChange}
        />
        {isLoading ? (
          <Loader />
        ) : (
          <Table
            columns={this.columns}
            rows={rows}
            handleRowClick={handleSelectedPart}
            showHeader={showResults}
            showResults={showResults}
            showBody={searchInput.length > 1}
            showCheckbox
          />
        )}
      </div>
    );
  }
}

export default SearchResults;
