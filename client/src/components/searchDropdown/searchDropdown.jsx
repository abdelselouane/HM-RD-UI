/* globals document  */
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import StyledDropdown from './styles';
import Table from '../table';
import TextInputField from '../textInputField';

export class SearchDropdown extends React.PureComponent {
  static propTypes = {
    columns: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
      })
    ).isRequired,
    parentSelector: PropTypes.string.isRequired,
    rows: PropTypes.arrayOf(
      PropTypes.shape({})
    ).isRequired,
    searchKey: PropTypes.string.isRequired,
    className: PropTypes.string,
    handleInputChange: PropTypes.func,
    handleSelectClick: PropTypes.func,
    showHeader: PropTypes.bool,
    showResults: PropTypes.bool
  };

  static defaultProps = {
    handleInputChange: () => {},
    handleSelectClick: () => {},
    className: '',
    showHeader: false,
    showResults: false
  };

  state = {
    searchValue: '',
    showDropdown: true,
    portalElement: null
  };

  componentWillMount() {
    const appElement = document.querySelector('#app');
    appElement.addEventListener('mousedown', this.handleCloseDropdown, false);
  }

  componentDidMount() {
    const portalElement = document.querySelector(this.props.parentSelector);
    if (portalElement) {
      portalElement.setAttribute('style', 'position: relative');
    }
    this.setState({ portalElement }); // eslint-disable-line
  }

  componentWillUnmount() {
    const appElement = document.querySelector('#app');
    appElement.removeEventListener('mousedown', this.handleCloseDropdown, false);
  }

  getOptions = () => {
    const {
      columns,
      rows,
      searchKey
    } = this.props;

    const { searchValue } = this.state;
    return rows.map(row => ({
      ...row,
      key: row[columns[0].key],
      [searchKey]: (
        <span title={row[searchKey]}>
          <strong>
            {row[searchKey].substr(0, searchValue.length)}
          </strong>
          {row[searchKey].substr(searchValue.length)}
        </span>
      )
    }));
  }

  dropdownRef = React.createRef();

  inputFieldRef = React.createRef();

  handleCloseDropdown = ({ target }) => {
    if (
      !this.dropdownRef.current.contains(target)
      && !this.inputFieldRef.current.contains(target)
    ) {
      this.setState({ showDropdown: false });
    }
  }

  handleRowClick = row => {
    this.setState({ showDropdown: false });
    const { searchKey } = this.props;
    const searchKeyValue = row[searchKey].props.title;
    this.props.handleSelectClick({
      ...row,
      [searchKey]: searchKeyValue
    });
  }

  handleFocus = () => {
    this.setState({ showDropdown: true });
  }

  handleInputChange = (id, value) => {
    this.setState({ searchValue: value });
    this.props.handleInputChange(id, value);
  }

  renderDropdown = () => {
    const {
      className,
      columns,
      parentSelector,
      rows,
      searchKey,
      ...tableProps
    } = this.props;

    const { showDropdown } = this.state;

    return (
      <StyledDropdown
        innerRef={this.dropdownRef}
      >
        <Table
          rows={showDropdown ? this.getOptions() : []}
          columns={columns}
          handleRowClick={this.handleRowClick}
          {...tableProps}
        />
      </StyledDropdown>
    );
  };

  render() {
    const {
      className,
      searchKey
    } = this.props;

    return (
      <React.Fragment>
        <TextInputField
          containerRef={this.inputFieldRef}
          className={`${className} dropdown input-field`}
          icon={{ className: 'icon_search' }}
          onChange={this.handleInputChange}
          onFocus={this.handleFocus}
          id={searchKey}
          setFocusOnMount
        />
        {this.state.portalElement &&
          ReactDOM.createPortal(this.renderDropdown(), this.state.portalElement)
        }
      </React.Fragment>
    );
  }
}

export default SearchDropdown;
