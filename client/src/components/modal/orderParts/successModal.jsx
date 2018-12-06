import React from 'react';
import PropTypes from 'prop-types';

import Modal from '../modal';

const SuccessModal = ({ onSecondaryClick, onPrimaryClick, ...otherProps }) => (
  <Modal
    {...{
      title: {
        className: 'success',
        text: 'Success!',
        icon: 'check-circle-filled'
      },
      content: {
        className: '',
        text: 'Parts Order has been successfully submitted'
      },
      buttons: [
        {
          className: 'green',
          text: 'View Order History',
          onClick: () => onSecondaryClick()
        },
        {
          className: 'green-primary',
          text: 'Return to Homepage',
          onClick: () => onPrimaryClick()
        }
      ]
    }}
    {...otherProps}
  />
);

SuccessModal.propTypes = {
  onSecondaryClick: PropTypes.func.isRequired,
  onPrimaryClick: PropTypes.func.isRequired
};

export default SuccessModal;
