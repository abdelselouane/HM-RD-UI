import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import kebabcase from 'lodash.kebabcase';
import { Container } from './styles';

import ROUTE_MAP from '../../constants/routeMap';

export const Breadcrumbs = props => {
  const locations = props.pathname.split('/').filter(x => x);
  if (locations.length < 1 || locations[0] === 'home') {
    return null;
  }
  return (
    <Container className="breadcrumb-nav">
      <Link
        id={kebabcase(ROUTE_MAP.home.displayName)}
        className="breadcrumb"
        to={ROUTE_MAP.home.path}
      >
        {ROUTE_MAP.home.displayName}
      </Link>
      {locations[0] === 'orderHistory' && locations.length > 1 ? (
        <React.Fragment>
          <Link
            id={kebabcase(ROUTE_MAP[locations[0]].displayName)}
            className="breadcrumb"
            to={ROUTE_MAP[locations[0]].path}
          >
            {ROUTE_MAP[locations[0]].displayName}
          </Link>
          <span className="breadcrumb">
            {`Order #${locations[1]} Details`}
          </span>
        </React.Fragment>
      ) : (
        <span className="breadcrumb">
          {ROUTE_MAP[locations[0]].displayName}
        </span>
      )}
    </Container>
  );
};

Breadcrumbs.propTypes = {
  pathname: PropTypes.string.isRequired
};

const mapStateToProps = ({ router }) => ({
  pathname: router.location.pathname
});

export default connect(mapStateToProps, null)(Breadcrumbs);
