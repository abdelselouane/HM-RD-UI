import React from 'react';
import { RepairWorkOrder } from 'repair-work-order';
import Page, { Container } from '../../components/page';

const WorkOrders = () => (
  <Page className="workOrders" showBreadcrumb enableScroll>
    <Container hideBoxShadow>
      <RepairWorkOrder />
    </Container>
  </Page>
  );

export default WorkOrders;


