import React from 'react';

const initialContext = {
  handleRemoveFromCart: null,
  handleAdjustQuantity: null
};

export const OrderPartsContext = React.createContext(initialContext);
export const withContext = (WrappedComponent) => {
  const AppWithContext = (props) => (
    <OrderPartsContext.Consumer>
      {context => <WrappedComponent {...props} {...context} />}
    </OrderPartsContext.Consumer>
  );

  AppWithContext.displayName = `withContext(${WrappedComponent.displayName || WrappedComponent.name})`;
  return AppWithContext;
};
