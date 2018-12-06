/* global document */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { OrderPartsContext } from '../../contexts/orderParts';
import { withContext } from '../../contexts/history';

import { CREATE_PARTS_ORDER_SUCCESS } from '../../constants/actionTypes';

import { createPartsOrder } from '../../actions/partsOrdersActions';
import * as PartsSearchActions from '../../actions/partsSearchActions';
import * as CartActions from '../../actions/cartActions';
import * as NotificationActions from '../../actions/notificationActions';

import { Container } from './styles';
import Page from '../../components/page';
import SearchResults from '../../components/searchResults';
import PartsOrderCart from '../../components/partsOrderCart';
import {
  ConfirmationModal,
  SuccessModal,
  FailureModal
} from '../../components/modal';


export class OrderParts extends Component {
  static propTypes = {
    actions: PropTypes.shape({
      searchParts: PropTypes.func.isRequired,
      clearResults: PropTypes.func.isRequired,
      addToCart: PropTypes.func.isRequired,
      removeFromCart: PropTypes.func.isRequired,
      adjustQuantity: PropTypes.func.isRequired,
      showMessage: PropTypes.func.isRequired,
      showInfoMessage: PropTypes.func.isRequired,
      hideMessage: PropTypes.func.isRequired,
      createPartsOrder: PropTypes.func.isRequired
    }).isRequired,
    results: PropTypes.arrayOf(
      PropTypes.shape({
        selected: PropTypes.bool,
        partNbr: PropTypes.string.isRequired,
        partDescription: PropTypes.string.isRequired,
        brandName: PropTypes.string.isRequired,
        ediFlag: PropTypes.string.isRequired
      })
    ),
    cart: PropTypes.arrayOf(
      PropTypes.shape({
        partNbr: PropTypes.string.isRequired,
        partDescription: PropTypes.string.isRequired,
        brandName: PropTypes.string.isRequired,
        quantity: PropTypes.number
      })
    ),
    isLoadingResults: PropTypes.bool,
    searchError: PropTypes.bool,
    notify: PropTypes.shape({
      title: PropTypes.string
    }),
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired
  };

  static defaultProps = {
    results: undefined,
    cart: [],
    notify: { title: '' },
    searchError: false,
    isLoadingResults: false
  };

  state = {
    disableSubmit: false,
    modal: null,
    workOrderNumber: ''
  };

  handleInputChange = async (id, input) => {
    if (id === 'searchInput') {
      if (input.length > 1) {
        await this.props.actions.searchParts(input);
        if (this.props.searchError) {
          this.props.actions.showMessage(
            'System Failure: Parts search is currently unavailable'
          );
        } else if (this.props.notify.title.length > 0) {
          this.props.actions.hideMessage();
        }
      } else {
        this.props.actions.clearResults();
      }
    } else if (id === 'workOrderNumber') {
      this.setState({ [id]: input });
    }
  };

  handleAdjustQuantity = (partNbr, newQuantity) => {
    const partIndex = this.props.cart.findIndex(
      (cartItem) =>
        cartItem.partNbr === partNbr
    );

    if (partIndex > -1) {
      this.props.actions.adjustQuantity(partIndex, newQuantity);
    }
  }

  handleSelectedPart = part => {
    if (part.ediFlag === 'Y') {
      const partIndex = this.props.cart.findIndex(
        ({ partNbr, brandName }) =>
          partNbr === part.partNbr
          && brandName === part.brandName
      );
      if (partIndex > -1) {
        this.props.actions.removeFromCart(partIndex);
      } else {
        this.props.actions.addToCart(part);
      }
    } else {
      this.props.actions.showInfoMessage(
        'Part Not Available. This part is currently unavailable to order. Please use Legacy Tool Rental to order this part.'
      );
      setTimeout(() => this.props.actions.hideMessage(), 10000);
    }
  };

  submitOrder = () => {
    this.setState({
      disableSubmit: true,
      modal: (
        <ConfirmationModal
          onPrimaryClick={this.confirmationModalPrimaryClick}
          onSecondaryClick={this.confirmationModalSecondaryClick}
        />
      )
    });
  };

  navTo = pathname => {
    this.setState({ modal: null, disableSubmit: false });
    if (pathname.length > 0) {
      this.props.history.push(pathname);
    }
  };

  confirmationModalSecondaryClick = () => {
    this.setState({ modal: null, disableSubmit: false });
  }

  successModalPrimaryClick = () => {
    this.navTo('home');
  }

  successModalSecondaryClick = () => {
    this.navTo('orderHistory');
  }

  failureModalPrimaryClick = () => {
    this.navTo('home');
  }

  failureModalSecondaryClick = () => {
    this.navTo('');
  }

  confirmationModalPrimaryClick = async () => {
    await this.setState({ modal: null });
    const status = await this.props.actions.createPartsOrder(
      this.state.workOrderNumber
    );
    this.setState({
      modal:
        status.type === CREATE_PARTS_ORDER_SUCCESS ? (
          <SuccessModal
            onPrimaryClick={this.successModalPrimaryClick}
            onSecondaryClick={this.successModalSecondaryClick}
          />
        ) : (
          <FailureModal
            onPrimaryClick={this.failureModalPrimaryClick}
            onSecondaryClick={this.failureModalSecondaryClick}
          />
        )
    });
  };

  render() {
    const { results, cart, isLoadingResults } = this.props;
    return (
      <React.Fragment>
        <Page className="order-parts" showHomeNav animateLayout>
          <Container>
            <SearchResults
              results={results}
              cart={cart}
              isLoading={isLoadingResults}
              handleInputChange={this.handleInputChange}
              handleSelectedPart={this.handleSelectedPart}
            />
            <OrderPartsContext.Provider
              value={{
                handleAdjustQuantity: this.handleAdjustQuantity,
                handleRemoveFromCart: this.handleSelectedPart
              }}
            >
              <PartsOrderCart
                cart={cart}
                submitOrder={this.submitOrder}
                disableSubmit={
                  this.state.disableSubmit || this.props.cart.length === 0
                }
              />
            </OrderPartsContext.Provider>
          </Container>
        </Page>
        {this.state.modal &&
          ReactDOM.createPortal(
            this.state.modal,
            document.querySelector('#modal')
          )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  results: state.partsSearch.results,
  isLoadingResults: state.partsSearch.isLoading,
  searchError: state.partsSearch.error,
  cart: state.cart.items,
  notification: state.notify
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      ...PartsSearchActions,
      ...CartActions,
      ...NotificationActions,
      createPartsOrder
    },
    dispatch
  )
});

const OrderPartsWithContext = withContext(OrderParts);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderPartsWithContext);
