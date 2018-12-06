import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Page, { Container } from '../../components/page';
import { RepairPartsAdmin } from 'repair-parts-admin';

export const PartsAdmin = ({ config, userProfile }) => (
  <Page className="admin" showBreadcrumb enableScroll>
    <Container hideBoxShadow>
      <RepairPartsAdmin
        partsServiceUrl={config && config.partsServiceUrl}
        userId={userProfile && userProfile.id}
      />
    </Container>
  </Page>
);

PartsAdmin.propTypes = {
  config: PropTypes.shape({
    partsServiceUrl: PropTypes.string.isRequired
  }).isRequired,
  userProfile: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired
};

const mapStateToProps = state => ({
  config: state.config,
  userProfile: state.login.userProfile
});

export default connect(mapStateToProps, null)(PartsAdmin);
