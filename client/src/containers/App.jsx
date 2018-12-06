import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ConnectedRouter as Router } from 'connected-react-router';
import { Route, Switch } from 'react-router';
import { ThemeProvider, injectGlobal } from 'styled-components';


import ROUTE_MAP from '../constants/routeMap';
import { HistoryContext } from '../contexts/history';
import Authentication from '../utils/authHelper';
import { rehydrateUserProfile } from '../actions/loginActions';
import {
  Login,
  Home,
  OrderParts,
  OrderHistory,
  Inventory,
  PartsAdmin,
  WorkOrders
} from './routes';
import theme from '../constants/theme';

/* eslint-disable-next-line no-unused-expressions */
injectGlobal`
  html,
  body,
  div[data-reactroot]#app {
      height: 100%;
      padding: 0;
      margin: 0;
      box-sizing: border-box;
  }
`;

class App extends Component {
  constructor(props, context) {
    super(props, context);

    const { store } = context;
    const { login: loginState } = store.getState();
    const userProfile = Authentication.getUserProfile(loginState);
    Authentication.isAuthenticated().then(authenticated => {
      if (authenticated && userProfile !== null) {
        store.dispatch(rehydrateUserProfile());
        props.history.push('/home');
      } else {
        props.history.push('/');
      }
    });
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <HistoryContext.Provider
          value={{
            history: {
              goBack: this.props.history.goBack,
              push: this.props.history.push
            }
          }}
        >
          <Router history={this.props.history}>
            <Switch>
              <Route exact path={ROUTE_MAP.login.path} component={Login} />
              <Route path={ROUTE_MAP.home.path} component={Home} />
              <Route path={ROUTE_MAP.orderParts.path} component={OrderParts} />
              <Route path={ROUTE_MAP.orderHistory.path} component={OrderHistory} />
              <Route path={ROUTE_MAP.inventory.path} component={Inventory} />
              <Route path={ROUTE_MAP.admin.path} component={PartsAdmin} />
              <Route path={ROUTE_MAP.workOrders.path} component={WorkOrders} />
            </Switch>
          </Router>
        </HistoryContext.Provider>
      </ThemeProvider>
    );
  }
}

App.contextTypes = {
  store: PropTypes.object
};

App.propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired
  }).isRequired
};

export default App;
