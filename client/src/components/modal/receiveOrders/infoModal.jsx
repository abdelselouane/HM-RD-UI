import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Table from '../../table';
import Modal from '../modal';

const ScrollableOverflowTableContent = styled.div`
  .scrollable-table {
    overflow-y: hidden !important;
  }
`;

const InfoModal = ({ onPrimaryClick, onSecondaryClick, rows, columns, selectedPurchaseOrderNbr, rowLegnth = rows.length }) => (
  <Modal {...{
    styles: {
      width: '50%'
    },
    scrollable: (rowLegnth > 4) ? true : false,
    title: {
      className: 'info',
      text: `PO #${selectedPurchaseOrderNbr} Please select the quantity you would like to receive!`,
      icon: 'information-outlined',
      closeModal: () => onSecondaryClick()
    },
    content: {
      className: '',
      text: '',
      body: (
        <ScrollableOverflowTableContent className="body">
          <Table
            rows={rows}
            columns={columns}
            showResults={!!rows.length}
            isAlternating={false}
          />
        </ScrollableOverflowTableContent>)
    },
    buttons: [{
      text: 'Cancel',
      className: 'md',
      onClick: () => onSecondaryClick()
    },
    {
      text: 'Receive Part',
      className: 'primary md',
      onClick: () => onPrimaryClick()
    }]
  }} />
);
export default InfoModal;