import React from 'react';
import PropTypes from 'prop-types';

import Counter from '../../counter';
import { withContext } from '../../../contexts/orderParts';
import { decodeHtml } from '../../../utils/formatHelper';

export const CartItem = ({
  handleRemoveFromCart,
  handleAdjustQuantity,
  ...part
}) => (
  <div className="cart-item">
    <div className="part-info">
      <h3 className="part-desc">{decodeHtml(part.partDescription)}</h3>
      <span className="part-nbr">{part.partNbr}</span>
    </div>
    <div className="qty-counter counter-input sm">
      <span className="qty-label" htmlFor={`${part.partNbr}-qty`}>
        Qty
      </span>
      <Counter
        name={part.partNbr}
        value={part.quantity}
        handleChangeValue={handleAdjustQuantity}
        readOnly
      />
    </div>
    <div
      className="remove-btn"
      onClick={() => handleRemoveFromCart(part)}
    >
      <span>Remove</span>
      <i className="icon_trash" />
    </div>
  </div>
);

CartItem.propTypes = {
  handleAdjustQuantity: PropTypes.func.isRequired,
  handleRemoveFromCart: PropTypes.func.isRequired,
  partNbr: PropTypes.string.isRequired,
  partDescription: PropTypes.string.isRequired,
  quantity: PropTypes.number.isRequired
};

export default withContext(CartItem);
