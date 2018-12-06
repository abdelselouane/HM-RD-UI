import React from 'react';

const initialContext = {
  history: {
    goBack: null,
    push: null,
    location: {
      pathname: null
    }
  }
};

export const HistoryContext = React.createContext(initialContext);
export const withContext = (WrappedComponent) => {
  const AppWithContext = (props) => (
    <HistoryContext.Consumer>
      {context => <WrappedComponent {...props} {...context} />}
    </HistoryContext.Consumer>
  );

  AppWithContext.displayName = `withContext(${WrappedComponent.displayName || WrappedComponent.name})`;
  return AppWithContext;
};
