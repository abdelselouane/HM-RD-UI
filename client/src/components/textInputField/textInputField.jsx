import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class TextInputField extends PureComponent {
  static propTypes = {
    containerRef: PropTypes.shape(),
    className: PropTypes.string, // eslint-disable-line
    icon: PropTypes.shape({// eslint-disable-line
      className: PropTypes.string.isRequired
    }),
    id: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    setFocusOnMount: PropTypes.bool
  };

  static defaultProps = {
    className: '',
    setFocusOnMount: false,
    containerRef: null
  };

  componentDidMount() {
    if (this.props.setFocusOnMount && this.inputRef && this.inputRef.current) {
      this.inputRef.current.focus();
    }
  }

  inputRef = React.createRef();

  render() {
    const { icon = null, id, onChange, setFocusOnMount, containerRef, ...inputProps } = this.props;
    return (
      <div className={`text-input-container ${inputProps.className}`} ref={containerRef}>
        <input
          ref={this.inputRef}
          type="text"
          onChange={({ target: { value } }) => onChange(id, value)}
          {...inputProps}
        />
        {icon && <i className={icon.className} />}
      </div>
    );
  }
}
export default TextInputField;
