import React from 'react';
import kebabcase from 'lodash.kebabcase';
import styled from 'styled-components';

import Container from './styles';

import Tabs from '../../components/tabs';
import Page from '../../components/page';

import ReceiveOrders from '../receiveOrders';
import ManageInventory from '../manageInventory';

export const Content = styled.div`
  padding: 20px;
`;

export const Inventory = () => {
  const INVENTORY_TABS = ['On Hand Inventory', 'Receive Purchase Orders'];
  const tabs = [
    {
      displayName: INVENTORY_TABS[0],
      id: kebabcase(INVENTORY_TABS[0]),
      component: ManageInventory,
    },
    {
      displayName: INVENTORY_TABS[1],
      id: kebabcase(INVENTORY_TABS[1]),
      component: ReceiveOrders,
    }
  ];

  return (
    <Page className="inventory">
      <Container>
        <Tabs
          className="inventory-tabs"
          tabs={tabs}
          defaultTab={tabs[0].id}
        />
      </Container>
    </Page>
  );
};

export default Inventory;
