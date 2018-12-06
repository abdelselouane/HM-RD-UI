import React from 'react';
import Loadable from 'react-loadable';

import Page from '../components/page';

const Loading = () => <Page empty className="loading">Loading...</Page>;

export const Home = Loadable({
  loader: () => import('./home'),
  loading: Loading,
});

export const OrderParts = Loadable({
  loader: () => import('./orderParts'),
  loading: Loading,
});

export const OrderHistory = Loadable({
  loader: () => import('./orderHistory'),
  loading: Loading,
});

export const Login = Loadable({
  loader: () => import('./login'),
  loading: Loading,
});

export const Inventory = Loadable({
  loader: () => import('./inventory'),
  loading: Loading,
});

export const WorkOrders = Loadable({
  loader: () => import('./workOrders'),
  loading: Loading,
});

export const PartsAdmin = Loadable({
  loader: () => import('./partsAdmin'),
  loading: Loading,
});

export default {
  Home,
  OrderParts,
  OrderHistory,
  Login,
  Inventory,
  PartsAdmin,
  WorkOrders
};
