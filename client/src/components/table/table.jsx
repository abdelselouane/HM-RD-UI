import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import kebabCase from 'lodash.kebabcase';

import TableRow from './row';
import { StyledTable, StyledTh } from './styles';

const Table = props => {
  const {
    className,
    columns,
    rows,
    showResults,
    showHeader,
    showBody,
    showCheckbox,
    handleRowClick,
    isExpandable,
    isAlternating,
    clearOnHover,
    handleSortClick
  } = props;
  const style = showResults ? {} : { overflowY: 'hidden' };
  const tableProps = {
    numColumns: columns.length,
    isExpandable,
    isAlternating,
    clearOnHover
  };

  return (
    <Fragment>
      {showHeader && (
        <StyledTable className={`standard-table table-header ${className}`} {...tableProps}>
          <thead>
            <tr>
              {showCheckbox && <StyledTh className="checkbox-col" />}
              {columns.map(({ name, sortable, orderBy, key, thProps = {} }) => (
                <StyledTh
                  className={`${kebabCase(name)}-col ${sortable ? 'sortable' : ''} ${orderBy && orderBy.className ? orderBy.className : ''}`}
                  key={kebabCase(name)}
                  thProps={thProps}
                  onClick={() => (sortable && handleSortClick(key))}
                >
                  {name}
                </StyledTh>
              ))}
            </tr>
          </thead>
        </StyledTable>
      )}
      {showBody && (
        <div className="scrollable-table" style={style}>
          <StyledTable
            className={`standard-table table-body ${className} ${
              isAlternating ? 'alternating-rows' : ''
            }`}
            {...tableProps}
          >
            <tbody>
              {showResults ? (
                rows.map(
                  row =>
                    (isExpandable ? (
                      <React.Fragment key={`row ${row.key}`}>
                        <TableRow
                          row={row}
                          columns={columns}
                          onClick={handleRowClick}
                          showCheckbox={showCheckbox}
                        />
                        <tr id={`expandable-${row.key}`} />
                      </React.Fragment>
                    ) : (
                      <TableRow
                        key={`row ${row.key}`}
                        row={row}
                        columns={columns}
                        onClick={handleRowClick}
                        showCheckbox={showCheckbox}
                      />
                    ))
                )
              ) : (
                <tr>
                  <td className="no-results">No results found</td>
                </tr>
              )}
            </tbody>
          </StyledTable>
        </div>
      )}
    </Fragment>
  );
};

Table.defaultProps = {
  className: '',
  handleRowClick: () => {},
  handleSortClick: () => {},
  showCheckbox: false,
  showResults: true,
  showHeader: true,
  showBody: true,
  isExpandable: false,
  isAlternating: true,
  clearOnHover: false
};

Table.propTypes = {
  clearOnHover: PropTypes.bool,
  isAlternating: PropTypes.bool,
  isExpandable: PropTypes.bool,
  className: PropTypes.string,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
      thProps: PropTypes.object,
      tdProps: PropTypes.object,
      sortable: PropTypes.boolean,
      orderBy: PropTypes.shape({
        key: PropTypes.string.isRequired,
        className: PropTypes.string.isRequired
      })
    })
  ).isRequired,
  showResults: PropTypes.bool,
  showHeader: PropTypes.bool,
  showBody: PropTypes.bool,
  showCheckbox: PropTypes.bool,
  handleRowClick: PropTypes.func,
  handleSortClick: PropTypes.func
};

export default Table;
