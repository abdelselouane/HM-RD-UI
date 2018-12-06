import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ArrowKeysReact from 'arrow-keys-react';

import Tile from './tile';

class TileContainer extends PureComponent {
  state = {
    tileIndex: 0
  };

  componentDidMount() {
    if (this.containerRef && this.containerRef.current) {
      this.containerRef.current.focus();
    }
  }

  containerRef = React.createRef();

  handleKeyPress = ({ key }) => {
    if (key === 'Enter') {
      this.props.tiles[this.state.tileIndex].tileFunction();
    }
  };

  handleMouseEnter = index => {
    this.setState({ tileIndex: index });
  };

  render() {
    ArrowKeysReact.config({
      left: () => {
        const { tileIndex } = this.state;
        this.setState({
          tileIndex: tileIndex > 0 ? tileIndex - 1 : this.props.tiles.length - 1
        });
      },
      right: () => {
        this.setState(({ tileIndex }) => ({
          tileIndex: tileIndex < this.props.tiles.length - 1 ? tileIndex + 1 : 0
        }));
      }
    });

    return (
      <div
        tabIndex={0}
        ref={this.containerRef}
        className="tile-container container"
        role="presentation"
        onKeyPress={this.handleKeyPress}
        {...ArrowKeysReact.events}
      >
        {this.props.tiles.map(
          ({ className, icon, tileFunction, title }, index) => (
            <Tile
              key={className}
              className={`${className} ${
                this.state.tileIndex === index ? 'tile-active' : ''
              }`}
              icon={icon}
              title={title}
              index={index}
              handleTileFunction={tileFunction}
              handleMouseEnter={this.handleMouseEnter}
            />
          )
        )}
      </div>
    );
  }
}

TileContainer.propTypes = {
  tiles: PropTypes.arrayOf(
    PropTypes.shape({
      className: PropTypes.string.isRequired,
      tileFunction: PropTypes.func.isRequired,
      icon: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired
    }).isRequired
  ).isRequired
};

export default TileContainer;
