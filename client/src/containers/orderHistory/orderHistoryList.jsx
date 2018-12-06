import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Container } from './styles';

import * as PartsOrdersActions from '../../actions/partsOrdersActions';

import Page from '../../components/page';
import Table from '../../components/table';

import { withContext } from '../../contexts/history';

import { getFormattedDate } from '../../utils/formatHelper';

export class OrderHistoryList extends Component {
  static propTypes = {
    actions: PropTypes.shape({
      getPartsOrders: PropTypes.func.isRequired
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired,
    orders: PropTypes.arrayOf(
      PropTypes.shape({
        orderCreatedDate: PropTypes.string.isRequired,
        partsOrderId: PropTypes.number.isRequired,
        workOrderNbr: PropTypes.string.isRequired,
        partsDetails: PropTypes.arrayOf(PropTypes.shape({})).isRequired
      })
    ).isRequired
  };

  componentWillMount() {
    this.props.actions.getPartsOrders();
  }

  getRows = orders =>
    orders.map(({ partsDetails, ...order }) => ({
      key: order.partsOrderId,
      orderCreatedDate: getFormattedDate(order.orderCreatedDate),
      partsOrderId: order.partsOrderId,
      workOrderNbr: order.workOrderNbr || <em>Not Provided</em>,
      orderDesc: partsDetails
        .reduce((acc, { partDescription }) => `${acc}, ${partDescription}`, '')
        .substring(2)
    }));

  handleRowClick = ({ partsOrderId }) => {
    if (partsOrderId) {
      this.props.history.push(`orderHistory/${partsOrderId}`);
    }
  };

  columns = [
    {
      key: 'orderCreatedDate',
      name: 'Date',
      thProps: {
        paddingLeft: '40px',
        width: '15%'
      },
      tdProps: {
        paddingLeft: '40px',
        width: '15%'
      }
    },
    {
      key: 'partsOrderId',
      name: 'Order Number',
      thProps: {
        width: '15%'
      },
      tdProps: {
        width: '15%'
      }
    },
    {
      key: 'orderDesc',
      name: 'Order Description',
      useTitle: true,
      tdProps: {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
      }
    },
    {
      key: 'workOrderNbr',
      name: 'Work Order Number',
      thProps: {
        width: '20%'
      },
      tdProps: {
        width: '20%'
      }
    }
  ];

  render() {
    return (
      <Page className="order-history" showHomeNav>
        <Container>
          <div className="title">
            <h2>Order History</h2>
          </div>
          <Table
            columns={this.columns}
            rows={this.getRows(this.props.orders)}
            showResults={this.props.orders.length > 0}
            handleRowClick={this.handleRowClick}
          />
        </Container>
      </Page>
    );
  }
}

const mapStateToProps = state => ({
  orders: state.partsOrders.orders
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(PartsOrdersActions, dispatch)
});

const OrderHistoryListWithContext = withContext(OrderHistoryList);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderHistoryListWithContext);
