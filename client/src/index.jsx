/* global document, PROD */
import React from 'react';
import { Helmet } from 'react-helmet';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';

import configureStore from './store';
import App from './containers/App';
import NewRelicBrowserScriptTag from './assets/newRelicBrowser';

import './assets/ux-styleguide-local.min.css';
import './global-styles/base.scss';
import './assets/images/favicon.ico';

const history = createBrowserHistory();
const store = configureStore();

const isProduction = PROD;

render(
  <Provider store={store}>
    <React.Fragment>
      <Helmet>
        {isProduction && NewRelicBrowserScriptTag}
      </Helmet>
      <App history={history} />
    </React.Fragment>
  </Provider>,
  document.querySelector('#app')
);
