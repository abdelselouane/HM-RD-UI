import React from 'react';
import PropTypes from 'prop-types';

import CartItem from './cartItem';

const PartsOrderCart = props => (
  <div className="order-parts-right parts-order-cart">
    <div className="cart-header-title">
      <h2>Parts Cart</h2>
    </div>
    <div className="cart-content">
      {props.cart.map(part => (
        <CartItem key={`${part.partNbr}-${part.brandName}`} {...part} />
      ))}
    </div>
    <button
      className="submit-order loader-btn primary"
      indeterminate="true"
      disabled={props.disableSubmit}
      onClick={props.submitOrder}
    >
      Place Order
    </button>
  </div>
);

PartsOrderCart.propTypes = {
  cart: PropTypes.arrayOf(
    PropTypes.shape({
      partNbr: PropTypes.string,
      partDescription: PropTypes.string
    })
  ).isRequired,
  submitOrder: PropTypes.func.isRequired,
  disableSubmit: PropTypes.bool.isRequired
};

export default PartsOrderCart;
