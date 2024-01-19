import React, { useState, createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import { MdClose, MdThumbUp } from 'react-icons/md';
import { FaInfo } from 'react-icons/fa';
import clsx from 'clsx';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import { MESSAGE_TYPE } from '../../constants';
import GridLoadingSpinner from '../../components/GridLoadingSpinner/GridLoadingSpinner';
import styles from './PopupManager.module.css';

export const PopupContext = createContext(null);

const getErrorMessage = err => {
  if (err.response) {
    if (err.response.data && err.response.data.error) {
      return err.response.data.error;
    }
    if (err.response.data && err.response.data.errors) {
      return err.response.data.errors;
    }
    if (err.response.data && Array.isArray(err.response.data)) {
      return err.response.data[0].message
    }
    return err.response.data;
  }
  return err.message;
};

// eslint-disable-next-line react/prop-types
export default ({ children }) => {
  const [popupType, setPopupType] = useState(MESSAGE_TYPE.INFORMATION);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [messageData, setMessageData] = useState({
    contextText: null, // the first line/s at the top of the dialog content
    info: null, // the rest of the line/s at the bottom of the dialog content
  });

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  const setInternalErrorMessageContext = () => {
    setMessageData({
      contextText: 'Refresh the browser',
      info: 'If issue persists, please contact SRM helpdesk',
    });
    setPopupType(MESSAGE_TYPE.INTERNAL_ERROR);
  };

  const CLEAR_ERRORS = 'Clear following errors and try again';

  const setContextForErrorObjectScenario = (
    type,
    error,
    contextText = CLEAR_ERRORS,
  ) => {
    if (error.response && error.response.status === 500) {
      setInternalErrorMessageContext();
    } else {
      const errors = getErrorMessage(error);
      setMessageData({ contextText, info: errors });
      setPopupType(type || MESSAGE_TYPE.FAILURE);
    }
  };

  const showPopup = ({ contextText, info, type, error }) => {
    if (type === MESSAGE_TYPE.INTERNAL_ERROR) {
      setInternalErrorMessageContext();
    } else if (error) {
      const isNetworkError =
        !error.response && error.message === 'Network Error';
      const isTimeoutError =
        error.response?.status === 408 || error.code === 'ECONNABORTED';
      const isServerError = error.response?.status === 500;

      if (isNetworkError || isServerError || isTimeoutError) {
        setInternalErrorMessageContext();
      } else {
        setContextForErrorObjectScenario(
          type || MESSAGE_TYPE.FAILURE,
          error,
          contextText,
        );
      }
    } else {
      setMessageData({ contextText, info });
      setPopupType(type || MESSAGE_TYPE.INFORMATION);
    }
    openPopup();
  };

  const showSuccess = args =>
    showPopup({ ...args, type: MESSAGE_TYPE.SUCCESS });

  const showError = args => showPopup({ ...args, type: MESSAGE_TYPE.FAILURE });

  const showInternalError = () =>
    showPopup({ type: MESSAGE_TYPE.INTERNAL_ERROR });

  const showInformation = args =>
    showPopup({ ...args, type: MESSAGE_TYPE.INFORMATION });

  const showLoading = () => {
    showPopup({ type: MESSAGE_TYPE.LOADING });
    return closePopup;
  };

  return (
    <>
      <Popup
        open={isPopupOpen}
        handleClose={closePopup}
        messageData={messageData}
        type={popupType}
      />
      <PopupContext.Provider
        value={{
          showPopup,
          showError,
          showSuccess,
          showInternalError,
          showInformation,
          showLoading,
        }}
      >
        {children}
      </PopupContext.Provider>
    </>
  );
};

export const usePopupManager = () => useContext(PopupContext);

const Popup = ({ open, type, handleClose, messageData }) => {
  let dialogIcon = null;
  let dialogTitleModifierClass = null;
  let title = null;

  switch (type) {
    case MESSAGE_TYPE.SUCCESS:
      dialogIcon = <MdThumbUp className={styles.icfail} />;
      dialogTitleModifierClass = styles.success;
      title = 'Success';
      break;
    case MESSAGE_TYPE.FAILURE:
      dialogIcon = <NotInterestedIcon className={styles.icfail} />;
      dialogTitleModifierClass = styles.failure;
      title = 'Fail';
      break;
    case MESSAGE_TYPE.INFORMATION:
      dialogIcon = <FaInfo className={styles.icfail} />;
      dialogTitleModifierClass = styles.information;
      title = 'Information';
      break;
    case MESSAGE_TYPE.INTERNAL_ERROR:
      dialogIcon = null;
      dialogTitleModifierClass = styles.internalError;
      title = 'Oops! Something went wrong...';
      break;
    default:
      break;
  }

  const renderMessage = () => {
    if (
      !messageData.contextText ||
      (Array.isArray(messageData.contextText) &&
        messageData.contextText.length === 0)
    )
      return null;

    const renderTexts = textLines =>
      textLines.map((errorMessage, index) => (
        <>
          {/* eslint-disable-next-line react/no-array-index-key */}
          <div className={clsx(styles.error, styles.errorMessage)} key={index}>
            - {errorMessage}
          </div>
          <br />
        </>
      ));

    const renderText = text => (
      <span className={clsx(styles.error, styles.errorMessage)}>{text}</span>
    );

    const renderInfo = () => {
      const { info } = messageData;
      if (Array.isArray(info)) {
        return renderTexts(info);
      }
      return renderText(info);
    };

    return (
      <div className={styles.errorsContainer}>
        <p className={styles.editMessage}>{messageData.contextText}</p>
        <br />
        <p className={styles.errorList}>{renderInfo()}</p>
      </div>
    );
  };

  return (
    <Dialog
      open={open}
      className={styles.dialogContainer}
      classes={{
        paper:
          type === MESSAGE_TYPE.LOADING ? styles.spinnerBox : styles.dialogBox,
      }}
    >
      {type === MESSAGE_TYPE.LOADING ? (
        <GridLoadingSpinner />
      ) : (
        <>
          <DialogTitle>
            <span className={clsx(styles.title, dialogTitleModifierClass)}>
              {dialogIcon}
              <span className={styles.txt}>{title}</span>
            </span>
            <MdClose
              className={styles.cancelIcon}
              onClick={handleClose}
              data-testid="close-icon"
            />{' '}
          </DialogTitle>
          <DialogContent className={styles.content}>
            {renderMessage()}
          </DialogContent>
        </>
      )}
    </Dialog>
  );
};

Popup.propTypes = {
  type: PropTypes.oneOf(Object.values(MESSAGE_TYPE)),
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  messageData: PropTypes.shape({
    contextText: PropTypes.string,
    info: PropTypes.string,
  }),
  response: PropTypes.shape({
    title: PropTypes.string,
    data: PropTypes.object,
    status: PropTypes.number,
  }),
};
