import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledHeader = styled.div`
  z-index: 3;
  .header-info .product-info {
    font-size: 1.5em;
  }

  .header-logo.go-to-homepage {
    cursor: pointer;
  }
`;

const Header = ({
  handleLogoClick,
  handleLogoutClick,
  handleAdminClick,
  showActions,
  userProfile
}) => {
  let showAdmin = false;
  if (userProfile && userProfile.groups) {
    const accessGroup = userProfile.groups.filter((group) => group.cn === 'Repair Depot Admin');
    showAdmin = accessGroup.length > 0;
  }
  return (
    <StyledHeader className="header">
      {userProfile ? (
        <div className="header-logo go-to-homepage" onClick={handleLogoClick}>
          <i className="icon_homedepot" />
        </div>
    ) : (
      <div className="header-logo">
        <i className="icon_homedepot" />
      </div>
    )}
      <div className="header-info">
        <label className="product-info">Repair Depot</label>
      </div>
      <div className="header-search" />
      <div className="header-actions">
        {showAdmin && (
        <div className="admin-btn" onClick={handleAdminClick}>
          <i className="icon_laptop" />Admin
        </div>
      )}
        {showActions &&
        userProfile && (
          <div className="username"><i className="icon_person" />{userProfile.id}</div>
        )}
        {showActions && (
        <div className="logout-btn" onClick={handleLogoutClick}>
          <i className="icon_exit_to_app" />Logout
        </div>
      )}
      </div>
    </StyledHeader>
  );
};

Header.defaultProps = {
  userProfile: {},
  handleAdminClick: () => {}
};

Header.propTypes = {
  showActions: PropTypes.bool.isRequired,
  handleAdminClick: PropTypes.func,
  handleLogoutClick: PropTypes.func.isRequired,
  handleLogoClick: PropTypes.func.isRequired,
  userProfile: PropTypes.shape()
};

export default Header;
