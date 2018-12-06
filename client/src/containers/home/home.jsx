/* global window */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withContext } from '../../contexts/history';

import Page, { Container } from '../../components/page';
import TileContainer from '../../components/tileContainer';

export class Home extends PureComponent {
  static propTypes = {
    config: PropTypes.shape({
      partsFinderUrl: PropTypes.string.isRequired
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired
  }

  partsFinderTileFunction = () => {
    window.open(this.props.config.partsFinderUrl, '_blank');
  }

  orderPartsTileFunction = () => {
    this.props.history.push('/orderParts');
  }

  orderHistoryTileFunction = () => {
    this.props.history.push('/orderHistory');
  }

  inventoryFunction = () => {
    this.props.history.push('/inventory');
  }

  workOrdersTileFunction = () => {
    this.props.history.push('/workOrders');
  }

  tiles = [
    {
      title: 'Parts Finder',
      className: 'parts-search',
      icon: 'search',
      tileFunction: this.partsFinderTileFunction
    },
    {
      title: 'Work Orders',
      className: 'work-orders',
      icon: 'toolbox',
      tileFunction: this.workOrdersTileFunction
    },
    {
      title: 'Order Parts',
      className: 'order-parts',
      icon: 'tool-wrench',
      tileFunction: this.orderPartsTileFunction
    },
    {
      title: 'Order History',
      className: 'order-history',
      icon: 'assignment',
      tileFunction: this.orderHistoryTileFunction
    },
    {
      title: 'Inventory',
      className: 'inventory',
      icon: 'view-list',
      tileFunction: this.inventoryFunction
    }
  ];

  render() {
    return (
      <Page className="home">
        <Container hideBoxShadow>
          <TileContainer tiles={this.tiles} />
        </Container>
      </Page>
    );
  }
}

const connectedHome = connect(
  state => ({ config: state.config }),
  null
)(Home);

export default withContext(connectedHome);
