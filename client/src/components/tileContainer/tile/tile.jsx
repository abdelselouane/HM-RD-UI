import React from 'react';
import PropTypes from 'prop-types';

const Tile = ({
  index,
  className,
  title,
  icon,
  handleMouseEnter,
  handleTileFunction
}) => (
  <div
    tabIndex={index}
    className={`card repair-tile ${className}`}
    onClick={handleTileFunction}
    onMouseEnter={() => handleMouseEnter(index)}
  >
    <div className="card-toolbar">
      <span className="card-title">
        <h2>{title}</h2>
      </span>
    </div>
    <div className="card-content">
      <i className={`icon_${icon}`} />
    </div>
  </div>
);

Tile.propTypes = {
  index: PropTypes.number.isRequired,
  className: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  handleMouseEnter: PropTypes.func.isRequired,
  handleTileFunction: PropTypes.func.isRequired
};

export default Tile;
