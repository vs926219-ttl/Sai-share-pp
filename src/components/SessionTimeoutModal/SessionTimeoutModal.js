/* eslint-disable react/button-has-type */
import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Modal } from "@material-ui/core";
import { FiClock, } from "react-icons/fi";
import clsx from "clsx";
import styles from "./SessionTimeoutModal.module.css";
import SessionInactiveModal from "../SessionInactiveModal/SessionInactiveModal";
import SessionExpiredModal from "../SessionExpiredModal/SessionExpiredModal";

const SessionTimeoutModal = ({
  handleClose,
  open,
  confirmSubmit,
  logoutUser,
}) => {
  const Ref = useRef(null);
  // eslint-disable-next-line no-unused-vars
  const [timer, setTimer] = useState("00:01:05");
  const [formattedTimer, setFormattedTimer] = useState("01:05");
  const [showInactivePopup, setShowInactivePopup] = useState(false);
  const [showExpiredPopup, setShowExpiredPopup] = useState(false);
  
  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / 1000 / 60 / 60) % 24);
    return {
      total,
      hours,
      minutes,
      seconds,
    };
  };

  const startTimer = (e) => {
    const { total, hours, minutes, seconds } = getTimeRemaining(e);
    if (total >= 0) {
      setTimer(
        `${hours > 9 ? hours : `0${hours}`}:${
          minutes > 9 ? minutes : `0${minutes}`
        }:${seconds > 9 ? seconds : `0${seconds}`}`
      );
      setFormattedTimer(
        `${minutes > 9 ? minutes : `0${minutes}`}:${
          seconds > 9 ? seconds : `0${seconds}`
        }`
      );
      
      if (minutes === 0 && seconds === 0) {
        handleClose();
        setShowInactivePopup(true);
        setFormattedTimer("01:05");
      }
    }
  };

  const clearTimer = (e) => {
    setTimer("00:01:05");
    if (Ref.current) {
      clearInterval(Ref.current);
      setFormattedTimer("01:05");
      Ref.current = null;
      return;
    }
    const id = setInterval(() => {
      startTimer(e);
    }, 1000);
    Ref.current = id;
  };

  const getDeadTime = () => {
    const deadline = new Date();
    deadline.setSeconds(deadline.getSeconds() + 64);
    return deadline;
  };

  useEffect(() => {
    if (open) {
      clearTimer(getDeadTime());
      setShowInactivePopup(false);
    }
  }, [open]);

  useEffect(() => {
    if (showInactivePopup) {
      setTimeout(
        () => {
          setShowInactivePopup(false);
          setShowExpiredPopup(true);
        }, 
        2*60*1000
      );
    }
  }, [showInactivePopup]);

  return (
    <>
      <Modal open={open}>
        <div className={styles.container}>
          <div className={styles.title}>
            <span className={clsx(styles.txt, styles.flexBox)}>
              <FiClock style={{marginRight: 10}} className={styles.clickable} /> Session Timeout</span>
          </div>

          <div className={styles.content}>
            <span>
              <p className={styles.warningText}>
                Your online session will expire
              </p>
            </span>
            <div className={styles.timer}>
            <span>{`${formattedTimer}`}</span>
            </div>
            <div className={styles.subtextContainer}>
              <div className={styles.subtext}>
                Please click &apos;Continue&apos; to keep working;
              </div>
              <div className={styles.subtext}>
                Or click &apos;Logout&apos; to end your session now
              </div>
            </div>
          </div>
          
          <div className={styles.bottomRow}>
            <button
              className={styles.cancelBt}
              onClick={() => {
                logoutUser();
                handleClose();
              }}
            >
              LOGOUT
            </button>
            <button
              onClick={() => {
                clearTimer(getDeadTime());
                setShowInactivePopup(false);
                confirmSubmit();
                handleClose();
              }}
              className={styles.submitBt}
            >
              CONTINUE
            </button>
          </div>
        </div>
      </Modal>
      <SessionInactiveModal
        open={showInactivePopup}
        handleClose={() => {
          setShowInactivePopup(false);
        }}
        confirmSubmit={() => {
          window.location.reload();
        }}
        logoutUser={() => {
          logoutUser();
        }}
      />
      <SessionExpiredModal
        open={showExpiredPopup}
        handleClose={() => {
          setShowExpiredPopup(false);
        }}
      />
    </>
  );
};

SessionTimeoutModal.propTypes = {
  confirmSubmit: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired,
};

export default SessionTimeoutModal;
