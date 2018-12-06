import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class Tabs extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    defaultTab: PropTypes.string,
    tabs: PropTypes.arrayOf(
      PropTypes.shape({
        displayName: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        component: PropTypes.oneOfType([
          PropTypes.func,
          PropTypes.node,
          PropTypes.element
        ]),
      })
    ).isRequired
  };

  static defaultProps = {
    className: '',
    defaultTab: ''
  }

  state = {
    currentTab: this.props.defaultTab || this.props.tabs[0].id,
  };

  handleTabChange = id => this.setState({ currentTab: id });

  render() {
    const { tabs, className } = this.props;
    const { currentTab } = this.state;
    return (
      <div className={`${className} tabs`}>
        <div role="tablist">
          {tabs.length && tabs.map(({ displayName, id }) => {
            const isCurrentTab = this.state.currentTab === id;
            return (
              <span
                id={`${id}-tab`}
                key={id}
                role="tab"
                aria-selected={isCurrentTab}
                tabIndex={isCurrentTab ? '0' : '-1'}
                onClick={() => this.handleTabChange(id)}
              >
                {displayName}
              </span>
            );
          })}
        </div>
        {tabs.length && tabs.map(({ id, component: Component }) => {
          const isHidden = id !== currentTab;
          if (isHidden) return null;
          const shouldMountComponent = !isHidden && typeof Component === 'function';
          return (
            <div role="tabpanel" key={id} className={`${id} tabpanel`} hidden={isHidden}>
              {shouldMountComponent && <Component />}
            </div>
          );
        })}
      </div>
    );
  }
}

export default Tabs;
