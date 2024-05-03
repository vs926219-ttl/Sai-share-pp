/* eslint-disable react/button-has-type */
import React from "react";
import PropTypes from "prop-types";
import { Modal } from "@material-ui/core";
import { FiInfo } from "react-icons/fi";
import clsx from "clsx";
import styles from "./SessionInactiveModal.module.css"; 

const SessionInactiveModal = ({ 
  handleClose, 
  logoutUser,
  open
}) => (
  <Modal open={open}>
    <div className={styles.container}>
      <div className={styles.title}>
        <span className={clsx(styles.txt, styles.flexBox)}>
          <FiInfo style={{marginRight: 10}} className={styles.clickable}/> Inactive</span>
      </div>

      <div className={styles.content}>
        <div className={styles.note}>Note: On pressing continue all unsaved data will be lost</div>
        <span className={styles.grayBox}>
          <p className={styles.warningText}>Looks like you have been inactive.</p>
          <p className={styles.warningText} style={{marginBottom: 0}}>
            Please click on &apos;Continue&apos; to keep on working or press &apos;Logout&apos; to end your session now.
          </p>
        </span>
        <div className={styles.bottomRow}>
            <button
              className={styles.cancelBt}
              onClick={() => {
                handleClose();
                logoutUser();
              }}
            >
              LOGOUT
            </button>
            <button
              className={styles.submitBt}
              onClick={() => {
                window.location.reload();
              }}
            >
              CONTINUE
            </button>
        </div>
      </div>
      
    </div>
  </Modal>
);

SessionInactiveModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired
};

export default SessionInactiveModal;
