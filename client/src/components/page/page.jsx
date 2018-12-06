/* global sessionStorage */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { GridLayout } from './styles';

import Header from '../header';
import Notification from '../notification';
import Breadcrumbs from '../breadcrumbs';

import { withContext } from '../../contexts/history';

import * as LoginActions from '../../actions/loginActions';
import * as NotifyActions from '../../actions/notificationActions';
import { loadConfig } from '../../actions/configActions';
import { clearResults } from '../../actions/partsSearchActions';
import { clearCart } from '../../actions/cartActions';

export class Page extends Component {
  static propTypes = {
    actions: PropTypes.shape({
      clearCart: PropTypes.func.isRequired,
      clearResults: PropTypes.func.isRequired,
      logoutUser: PropTypes.func.isRequired,
      hideMessage: PropTypes.func.isRequired,
      loadConfig: PropTypes.func.isRequired
    }).isRequired,
    enableScroll: PropTypes.bool,
    children: PropTypes.node.isRequired,
    className: PropTypes.string.isRequired,
    empty: PropTypes.bool,
    notify: PropTypes.shape(),
    onCloseNotification: PropTypes.func,
    showHomeNav: PropTypes.bool,
    showReturn: PropTypes.bool,
    userProfile: PropTypes.shape(),
    router: PropTypes.shape({
      location: PropTypes.shape({
        pathname: PropTypes.string.isRequired
      })
    }).isRequired,
    history: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
      push: PropTypes.func.isRequired
    }).isRequired,
    showBreadcrumb: PropTypes.bool
  };

  static defaultProps = {
    empty: false,
    enableScroll: false,
    notify: null,
    onCloseNotification: null,
    showBreadcrumb: true,
    showHomeNav: false,
    showReturn: false,
    userProfile: null
  };

  componentWillMount() {
    this.clearData();
    this.props.actions.loadConfig();
  }

  clearData = () => {
    const { pathname: nextLocation } = this.props.router.location;
    const clearRoutes = ['/', '/home'];
    if (clearRoutes.includes(nextLocation)) {
      this.props.actions.clearResults();
      this.props.actions.clearCart();
      this.props.actions.hideMessage();
    }
  };

  handleLogout = () => {
    this.props.actions.logoutUser();
    const userSession = sessionStorage.getItem('userProfile');
    if (!userSession && this.props.router.location.pathname !== '/') {
      this.props.history.push('/');
      this.props.actions.hideMessage();
    }
  };

  handleCloseNotification = () => {
    if (this.props.onCloseNotification) {
      this.props.onCloseNotification();
    }
    this.props.actions.hideMessage();
  };

  handleLogoClick = () => {
    this.props.history.push('/home');
  }


  handleAdminClick = () => {
    this.props.history.push('/admin');
  }

  render() {
    const { className, notify, enableScroll } = this.props;
    return (
      <GridLayout
        className={`${className}-page`}
        enableScroll={enableScroll}
      >
        <Header
          showActions={!this.props.empty}
          userProfile={this.props.userProfile}
          handleLogoutClick={this.handleLogout}
          handleLogoClick={this.handleLogoClick}
          handleAdminClick={this.handleAdminClick}
        />
        <Notification
          {...notify}
          onClick={() => this.handleCloseNotification()}
          isOpen={notify.title.length > 0}
        />
        { this.props.showBreadcrumb && <Breadcrumbs /> }
        {this.props.children}
      </GridLayout>
    );
  }
}

const mapStateToProps = state => ({
  userProfile: state.login.userProfile,
  router: state.router,
  notify: state.notify
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    { ...NotifyActions, ...LoginActions, clearCart, clearResults, loadConfig },
    dispatch
  )
});

const PageWithContext = withContext(Page);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PageWithContext);
