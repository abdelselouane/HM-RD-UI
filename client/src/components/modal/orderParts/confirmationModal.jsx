import React from 'react';
import PropTypes from 'prop-types';

import Modal from '../modal';

const ConfirmationModal = ({ onSecondaryClick, onPrimaryClick, ...otherProps }) => (
  <Modal
    {...{
      title: {
        className: 'warning',
        text: 'Submit?',
        icon: 'warning-outlined'
      },
      content: {
        className: '',
        text: 'Are you sure you would like to submit this parts order?'
      },
      buttons: [
        {
          className: 'grey',
          text: 'No, Edit Order',
          onClick: () => onSecondaryClick()
        },
        {
          className: 'yellow-primary',
          text: 'Yes',
          onClick: () => onPrimaryClick()
        }
      ]
    }}
    {...otherProps}
  />
);

ConfirmationModal.propTypes = {
  onSecondaryClick: PropTypes.func.isRequired,
  onPrimaryClick: PropTypes.func.isRequired
};

export default ConfirmationModal;
