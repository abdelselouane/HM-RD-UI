import React from 'react';
import PropTypes from 'prop-types';

import Modal from '../modal';

const FailureModal = ({ onSecondaryClick, onPrimaryClick, ...otherProps }) => (
  <Modal
    {...{
      title: {
        className: 'failure',
        text: 'Parts Order Submission Failed',
        icon: 'ban'
      },
      content: {
        className: 'failure',
        text: 'The system is currently down. We apologize for the inconvenience. Please try again later.'
      },
      buttons: [
        {
          className: 'red',
          text: 'Return to Parts Cart',
          onClick: () => onSecondaryClick()
        },
        {
          className: 'red-primary',
          text: 'Return to Homepage',
          onClick: () => onPrimaryClick()
        }
      ]
    }}
    {...otherProps}
  />
);

FailureModal.propTypes = {
  onSecondaryClick: PropTypes.func.isRequired,
  onPrimaryClick: PropTypes.func.isRequired
};

export default FailureModal;
