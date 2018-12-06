import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withContext } from '../../contexts/history';

import Page from '../../components/page';
import DetailsCard from '../../components/detailsCard';

import { getFormattedDate } from '../../utils/formatHelper';

import { Container, CardTitle, PurchaseOrderList } from './styles';


export class OrderDetails extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        partsOrderId: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    orders: PropTypes.arrayOf(
      PropTypes.shape({
        partsOrderId: PropTypes.number.isRequired
      })
    ).isRequired
  };

  state = {
    order: null
  };

  componentWillMount() {
    const { partsOrderId } = this.props.match.params;
    const index = this.props.orders.findIndex(
      order => order.partsOrderId === Number.parseInt(partsOrderId, 10)
    );
    this.setState({ order: index > -1 ? this.props.orders[index] : null });
  }

  getDetailsCardsProps = partsDetails => {
    const mappedPoNbrs = [];
    const detailsCards = [];
    for (let i = 0; i < partsDetails.length; i += 1) {
      if (!mappedPoNbrs.includes(partsDetails[i].purchaseOrderNbr)) {
        const cardProps = {
          purchaseOrderNbr: partsDetails[i].purchaseOrderNbr,
          purchaseOrderStatDesc: partsDetails[i].purchaseOrderStatDesc,
          parts: []
        };
        for (let j = i; j < partsDetails.length; j += 1) {
          const { purchaseOrderNbr, purchaseOrderStatDesc, ...partInfo } = partsDetails[j];
          if (partsDetails[i].purchaseOrderNbr === purchaseOrderNbr) {
            cardProps.parts.push(partInfo);
          }
        }
        mappedPoNbrs.push(partsDetails[i].purchaseOrderNbr);
        detailsCards.push(cardProps);
      }
    }

    return detailsCards;
  }

  renderDetailsCards = order => {
    const { partsDetails } = order;
    if (!partsDetails) {
      return <div>Purchase Order details could not be loaded</div>;
    }
    return this.getDetailsCardsProps(partsDetails).map(props =>
      <DetailsCard key={props.purchaseOrderNbr} {...props} />
    );
  };

  render() {
    const { order } = this.state;
    return (
      <Page className="order-details" showReturn>
        <Container>
          {order ? (
            <React.Fragment>
              <CardTitle className="title">
                <h2>{`Order #${order.partsOrderId || 0} Details`}</h2>
                <span>{`Submitted ${getFormattedDate(order.orderCreatedDate)}`}</span>
              </CardTitle>
              <PurchaseOrderList>{this.renderDetailsCards(order)}</PurchaseOrderList>
            </React.Fragment>
          ) : (
            <div className="no-results">Order Request not found</div>
          )}
        </Container>
      </Page>
    );
  }
}

const mapStateToProps = state => ({
  orders: state.partsOrders.orders
});

const OrderDetailsWithHistory = withContext(OrderDetails);

export default connect(
  mapStateToProps,
  null
)(OrderDetailsWithHistory);
