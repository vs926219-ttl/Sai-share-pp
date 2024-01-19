/* eslint-disable react/button-has-type */
import React from "react";
import PropTypes from "prop-types";
import { Modal } from "@material-ui/core";
import { HiBan } from "react-icons/hi";
import clsx from "clsx";
import styles from "./SessionExpiredModal.module.css"; 

const SessionExpiredModal = ({ 
  handleClose, 
  open, 
 }) => (
  <Modal open={open}>
    <div className={styles.container}>
      <div className={styles.title}>
        <span className={clsx(styles.txt, styles.flexBox)}>
          <HiBan style={{marginRight: 10}} className={styles.clickable}/> Warning</span>
      </div>

      <div className={styles.content}>
        <span className={styles.grayBox}>
          <p className={styles.warningText}>Looks like you have been inactive. If you are inactive in other tabs you will be logged out.</p>
          <p className={styles.warningText} style={{marginBottom: 0}}>
            Please click on &apos;OK&apos; to continue.
          </p>
        </span>
        
          <div className={styles.bottomRow}>
           <button
              className={styles.submitBt}
              onClick={() => {
                handleClose();
                window.location.reload();
              }}
            >
              OK
            </button>
          </div>
      </div>
      
    </div>
  </Modal>
);

SessionExpiredModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default SessionExpiredModal;
