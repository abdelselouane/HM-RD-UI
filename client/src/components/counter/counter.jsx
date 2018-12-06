import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Counter = ({ name, handleChangeValue, value, readOnly, min, max }) => (
  <div className="counter-wrapper">
    <button
      id={`${name.toLowerCase()}-dec`}
      className="counter-decrement"
      disabled={value <= min}
      onClick={() => handleChangeValue(name, value - 1)}
    />
    <input
      id={`${name.toLowerCase()}-qty`}
      className="counter-value"
      type="number"
      value={`${value < 10 ? 0 : ''}${value}`}
      onChange={() => {}}
      readOnly={readOnly}
    />
    <button
      id={`${name.toLowerCase()}-inc`}
      className="counter-increment"
      disabled={value >= max}
      onClick={() => handleChangeValue(name, value + 1)}
    />
  </div>
);

Counter.defaultProps = {
  value: 1,
  min: 1,
  max: 10,
  readOnly: undefined
};

Counter.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  readOnly: PropTypes.bool,
  handleChangeValue: PropTypes.func.isRequired
};

const StyledCounter = styled(Counter)`
  width: 100px;

  .counter-decrement,
  .counter-increment {
    width: 30px;
  }
`;

export default StyledCounter;
