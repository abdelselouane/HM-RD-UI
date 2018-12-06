import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

import OrderDetails from '../orderDetails';

import OrderHistoryList from './orderHistoryList';

const OrderHistory = ({ match }) => [
  <Route
    key="orderDetails"
    path={`${match.url}/:partsOrderId`}
    component={OrderDetails}
  />,
  <Route
    key="orderHistoryList"
    exact
    path={match.url}
    component={OrderHistoryList}
  />
];

OrderHistory.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string.isRequired
  }).isRequired
};

export default OrderHistory;
