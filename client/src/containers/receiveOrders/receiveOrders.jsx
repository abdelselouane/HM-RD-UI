/* globals document */
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import Counter from '../../components/counter';
import Table from '../../components/table';
import { InfoModal } from '../../components/modal';
import * as PoActions from '../../actions/purchaseOrdersActions';
import * as NotificationActions from '../../actions/notificationActions';
import { timingSafeEqual } from 'crypto';

export class ReceiveOrders extends React.Component {
  state = {
    selectedParts: [],
    showReceivePartModal: false,
    selectedPurchaseOrderNbr: '',
    sortedColumn: 'orderCreatedDate'
  };

  componentWillMount() {
    this.props.actions.getPurchaseOrders();
  }

  columns = [
    {
      name: 'Date Created',
      key: 'orderCreatedDate',
      sortable: true,
      orderBy: {
        key: 'orderCreatedDate',
        className: ''
      }
    }, {
      name: 'Purchase Order #',
      key: 'purchaseOrderNbr',
      sortable: true,
      orderBy: {
        key: 'purchaseOrderNbr',
        className: ''
      }
    }, {
      name: 'Work order #',
      key: 'workOrderNbr',
      sortable: true,
      orderBy: {
        key: 'workOrderNbr',
        className: ''
      }
    }, {
      name: 'Status',
      key: 'purchaseOrderStatDesc',
      sortable: true,
      orderBy: {
        key: 'purchaseOrderStatDesc',
        className: ''
      }
    }, {
      name: 'Receive',
      key: 'receive'
    }
  ];

  partsDetailsColumns = [
    {
      name: 'Part Number',
      key: 'partNbr'
    }, {
      name: 'Description',
      key: 'partDescription'
    }, {
      name: 'Location',
      key: 'location'
    }, {
      name: 'Received Quantity',
      key: 'receivedQuantity'
    }, {
      name: 'Receiving',
      key: 'receive'
    }
  ];

  getSortedOrders = orders => {
    if (orders && orders.length > 0) {
      let sort = '';
      const column = this.state.sortedColumn;
      this.columns.map(col => {
        if (col.key === column) {
          if (col.orderBy.className === '' || col.orderBy.className === 'descending') {
            sort = 'ascending';
          } else {
            sort = 'descending';
          }
        }
      });

      orders.sort((a, b) => {
        if (sort === 'ascending') {
          const nameA = a[column].toUpperCase(); // ignore upper and lowercase
          const nameB = b[column].toUpperCase(); // ignore upper and lowercase

          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }

          return 0;
        }
        const nameA = a[column].toUpperCase(); // ignore upper and lowercase
        const nameB = b[column].toUpperCase(); // ignore upper and lowercase

        if (nameA > nameB) {
          return -1;
        }
        if (nameA < nameB) {
          return 1;
        }
        return 0;
      });
    }
    return orders;
  };

  handleSortClick = column => {
    this.columns.map(col => {
      if (col.key === column) {
        if (col.orderBy.className === '' || col.orderBy.className === 'descending') {
          col.orderBy.className = 'ascending';
        } else {
          col.orderBy.className = 'descending';
        }
      }
    });
    this.setState({
      sortedColumn: column
    });
  };

  handleCounterChange = (name, value) => {
    const { selectedParts } = this.state;
    selectedParts.map(part => {
      if (part.partNbr === name) {
        part.currentQuantityReceived = value;
      }
      if (part.currentQuantityReceived > 0) {
        part.invalidQuantity = false;
      }
    });
    this.setState({
      selectedParts
    });
  }

  handleLocationChange = (partNbr, event) => {
    const { selectedParts } = this.state;
    selectedParts.map(part => {
      if (part.partNbr === partNbr) {
        part.partLocation = event.target.value;
        return part;
      }
    });
    this.setState({
      selectedParts
    });
  }

  handleReceivePart = (purchaseOrderNbr) => {
    const { orders } = this.props;

    const selectedOrder = orders.filter((order) => purchaseOrderNbr === order.purchaseOrderNbr);

    const selectedParts = selectedOrder[0].partsDetails.map(part => ({
      ...part,
      invalidQuantity: false
    }));

    this.setState({
      selectedPurchaseOrderNbr: purchaseOrderNbr,
      selectedParts,
      showReceivePartModal: true
    });
  }

  handleCloseModal = () => {
    this.setState({
      showReceivePartModal: false,
      selectedParts: [],
      selectedPurchaseOrderNbr: ''
    });
  }

  handleSaveReceivePart = () => {
    const { selectedParts } = this.state;
    const validParts = [];
    selectedParts.map(part => {
      if (part.currentQuantityReceived > 0) {
        validParts.push(part);
      }
    });
    this.setState({
      selectedParts
    });

    if (validParts.length > 0) {
      const { selectedPurchaseOrderNbr } = this.state;
      const { orders } = this.props;
      const selectedOrder = orders.filter((order) => selectedPurchaseOrderNbr === order.purchaseOrderNbr);

      const payload = {
        locationNbr: selectedOrder[0].locationNbr,
        partsDetails: selectedParts.map(part => ({
          brandName: part.brandName,
          brandNbr: part.brandNbr,
          currentQuantityReceived: part.currentQuantityReceived,
          partDescription: part.partDescription,
          partLocation: part.partLocation,
          partNbr: part.partNbr,
          previousQuantityReceived: part.previousQuantityReceived,
          quantityOrdered: part.quantityOrdered
        })),
        partsOrderId: selectedOrder[0].partsOrderId,
        purchaseOrderNbr: selectedOrder[0].purchaseOrderNbr
      };

      this.handleUpdateReceivePartOrder(payload);
    } else {
      selectedParts.map(part => {
        if (part.currentQuantityReceived === 0) {
          part.invalidQuantity = true;
        }
      });
    }
  }

  handleUpdateReceivePartOrder = async (payload) => {
    await this.props.actions.updateReceivePartOrder(payload);
    if (this.props.updatePartOrdersError) {
      this.props.actions.showMessage(
        'System Failure: Unable to receive parts, please try again later'
      );
      setTimeout(() => this.props.actions.hideMessage(), 10000);
    } else {
      this.props.actions.showSuccessMessage(
        'Parts Received: The parts have been received in to your inventory'
      );
      setTimeout(() => this.props.actions.hideMessage(), 10000);
    }
    this.handleCloseModal();
  };

  render() {
    const { orders, inventory } = this.props;
    const {
      showReceivePartModal,
      selectedPurchaseOrderNbr,
      selectedParts
    } = this.state;

    let selectedInvPart = [];
    const partsDetailsRows = selectedParts.map((part) => {
      selectedInvPart = inventory.filter(inventoryPart => part.partNbr === inventoryPart.partNbr);
      let invLocation;
      if (selectedInvPart.length > 0 && selectedInvPart[0].location) {
        invLocation = selectedInvPart[0].location;
      } else {
        invLocation = (
          <div className="text-input-container" >
            <input
              id={`location${part.partNbr}`}
              type="text"
              value={part.partLocation}
              onChange={(event) => { this.handleLocationChange(part.partNbr, event); }}
              placeholder="Not Specified"
              style={{ marginTop: 0 }}
            />
          </div>);
      }
      return ({
        ...part,
        key: part.partNbr,
        location: invLocation,
        receivedQuantity: `${part.previousQuantityReceived} of ${part.quantityOrdered}`,
        receive: <div className="qty-counter counter-input sm" aria-invalid={part.invalidQuantity}>
          <Counter
            name={part.partNbr}
            value={part.currentQuantityReceived}
            min={0}
            max={part.quantityOrdered - part.previousQuantityReceived}
            handleChangeValue={this.handleCounterChange}
          />
        </div>
      });
    });

    const rows = this.getSortedOrders([...orders]).map(({ partDetails, ...order }, index) => ({
      ...order,
      key: order.purchaseOrderNbr,
      receive: <button
        id={`${index}-${order.purchaseOrderNbr}`}
        onClick={() => this.handleReceivePart(order.purchaseOrderNbr)}
        className="button md"
        style={{ margin: '10px 0px' }}
      >Receive Order
      </button>
    }));
    return (
      <React.Fragment>

        <Table
          rows={rows}
          columns={this.columns}
          showResults={!!rows.length}
          isExpandable
          isAlternating={false}
          handleSortClick={this.handleSortClick}
        />
        {showReceivePartModal &&
          ReactDOM.createPortal(
            <InfoModal
              onPrimaryClick={this.handleSaveReceivePart}
              onSecondaryClick={this.handleCloseModal}
              rows={partsDetailsRows}
              columns={this.partsDetailsColumns}
              selectedPurchaseOrderNbr={selectedPurchaseOrderNbr}
            />,
            document.querySelector('#modal')
          )}
      </React.Fragment>
    );
  }
}

ReceiveOrders.propTypes = {
  actions: PropTypes.shape({
    getPurchaseOrders: PropTypes.func.isRequired
  }).isRequired,
  orders: PropTypes.arrayOf(
    PropTypes.shape({
      orderCreatedDate: PropTypes.string,
      workOrderNbr: PropTypes.string,
      purchaseOrderStatDesc: PropTypes.string,
      purchaseOrderNbr: PropTypes.string,
      partsDetails: PropTypes.arrayOf(PropTypes.shape({
        quantityOrdered: PropTypes.number.isRequired,
        previousQuantityReceived: PropTypes.number.isRequired,
        partNbr: PropTypes.string.isRequired,
        partDescription: PropTypes.string.isRequired
      }))
    })
  ).isRequired
};

const mapStateToProps = state => ({
  orders: state.purchaseOrders.orders,
  updatePartOrdersError: state.purchaseOrders.error,
  inventory: state.inventory.items
});
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    ...PoActions,
    ...NotificationActions
  }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ReceiveOrders);
