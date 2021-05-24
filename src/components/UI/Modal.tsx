import React, { Fragment, FC } from 'react';
import ReactDOM from 'react-dom';

import classes from './Modal.module.css';

interface Props {
  onClose: () => void;
}

/**
 * 1)Modal Component: ->
 * This creates a Portal and puts the Modal in the public/index.html
 * as the direct child element of the body. This is a wrapper card for
 * the content from the Modal's content component.
 * @param onClose - onClose: -> This is a fuction to close the Modal component.
 * @param children - children: -> This is the ModalContent component with flight details.
 * @returns Modal (ModalOverlay + Backdrop).
 * 
 * 
 * 
 * 2)Backdrop Component: ->
 * This component returns a backdrop for the Modal overlay.
 * @param onClose - onClose: -> receives a fuction to close the Modal component
 * @returns backdrop for the Modaloverlay component
 * 
 * 
 * 
 * 3)ModalOverlay Component: ->
 * This component is a card wrapper for the ModalContent component
 * @param children -  children: -> ModalContent component (props.child) with flight details
 * @returns - Card with flight details
 * 
 * 
 * 
|* 4)portalElement Element:
 * Targets HTML Element: -> direct child element for the body element
 */
const Modal: FC<Props> = ({ onClose, children }) => {
  const portalElement = document.getElementById('overlays') as HTMLDivElement;
  return (
    <Fragment>
      {ReactDOM.createPortal(<Backdrop onClose={onClose} />, portalElement)}
      {ReactDOM.createPortal(
        <ModalOverlay>{children}</ModalOverlay>,
        portalElement
      )}
    </Fragment>
  );
};

const Backdrop: FC<Props> = ({ onClose }) => {
  return <div className={classes.backdrop} onClick={onClose} />;
};

const ModalOverlay: FC = ({ children }) => {
  return (
    <div className={classes.modal}>
      <div className={classes.content}>{children}</div>
    </div>
  );
};

export default Modal;
