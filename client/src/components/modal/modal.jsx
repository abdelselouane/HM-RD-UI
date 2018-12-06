import React from 'react';
import PropTypes from 'prop-types';
import kebabCase from 'lodash.kebabcase';
import styled from 'styled-components';

const StyledCardModal = styled.div`
.card-content {
  ${props => (props.scrollable ? ' overflow-y: scroll; height: 450px;' : 'overflow: hidden;')}
}
`;

const Modal = ({ styles, title, content, buttons, scrollable }) => (
  <div className="modal-container">
    <StyledCardModal className="card modal" style={styles} scrollable={scrollable}>
      <div className={`card-toolbar ${title.className}`}>
        {title.icon && <i className={`icon_${title.icon}`} />}
        <span className="card-title">
          {title.text && <h2>{title.text}</h2>}
        </span>
        {title.closeModal && <i className="icon_close" onClick={title.closeModal} />}
      </div>
      <div className={`card-content ${content.className}`}>
        {content.text && <h2 className="text">{content.text}</h2>}
        {content.body}
      </div>
      {buttons.length > 0 && (
        <div className={content.body ? 'card-actions right' : 'card-footer buttons'}>
          {buttons.map((button) => (
            <button
              key={kebabCase(button.text)}
              id={kebabCase(button.text)}
              className={`button ${button.className}`}
              onClick={button.onClick}
            >
              {button.text}
            </button>
          ))}
        </div>
      )}
    </StyledCardModal>
  </div>
);

Modal.defaultProps = {
  styles: {
    width: '50em'
  }
};

Modal.propTypes = {
  styles: PropTypes.shape({
    width: PropTypes.string
  }),
  title: PropTypes.shape({
    className: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    icon: PropTypes.string,
    handleCloseModal: PropTypes.func
  }).isRequired,
  content: PropTypes.shape({
    className: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    form: PropTypes.object
  }).isRequired,
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      className: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      onClick: PropTypes.func
    })
  ).isRequired
};

export default Modal;
