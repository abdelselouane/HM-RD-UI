import React from 'react';
import PropTypes from 'prop-types';
import kebabCase from 'lodash.kebabcase';

import StyledTd from './styles';

import { decodeHtml } from '../../../utils/formatHelper';

const TableRow = props => {
  const { onClick, columns, row, showCheckbox } = props;
  return (
    <tr onClick={() => onClick(row)}>
      {showCheckbox && (
        <td className="checkbox-col">
          {row.selected !== null && (
            <div
              role="checkbox"
              aria-checked={row.selected ? 'true' : 'false'}
              aria-disabled={row.ediFlag === 'Y' ? 'false' : 'true'}
            />
          )}
        </td>
      )}
      {columns.map(col => {
        let displayData;
        const disableRow = showCheckbox && row.ediFlag === 'N';
        const cellData = row[col.key];
        if (typeof cellData === 'string') {
          displayData = decodeHtml(cellData);
        } else {
          displayData = cellData;
        }
        return (
          <StyledTd
            className={`${kebabCase(col.name ? col.name : col.key)}-col`}
            key={`${row.key}-${kebabCase(col.name)}`}
            tdProps={col.tdProps}
            disableRow={disableRow}
          >
            {col.useTitle ? (
              <span title={decodeHtml(row[col.key])}>
                {displayData}
              </span>
            ) : (
              displayData
            )}
          </StyledTd>
        );
      })}
    </tr>
  );
};

TableRow.defaultProps = {
  showCheckbox: false
};

TableRow.propTypes = {
  row: PropTypes.shape({
    key: PropTypes.any.isRequired,
    selected: PropTypes.bool
  }).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      tdProps: PropTypes.shape(),
      useTitle: PropTypes.bool
    })
  ).isRequired,
  onClick: PropTypes.func.isRequired,
  showCheckbox: PropTypes.bool
};

export default TableRow;
