import React from 'react';
import PropTypes from 'prop-types';

const Notification = ({ title, className, onClick, isOpen }) => (
  <div className={`banner ${className} ${isOpen ? 'open' : 'closed'}`}>
    <span className="message">{title}</span>
    <span className="close" onClick={() => onClick()} />
  </div>
);

Notification.defaultProps = {
  title: '',
  className: '',
  isOpen: false
};

Notification.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string,
  isOpen: PropTypes.bool
};

export default Notification;
