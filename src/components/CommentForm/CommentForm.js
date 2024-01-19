/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Popover } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { reasons, agencies } from '../../staticData';
import styles from './CommentForm.module.css';

// eslint-disable-next-line react/prop-types
const Select = ({ label, id, options, defaultOption, ...selectProps }) => (
  <div className={styles.row}>
    <label htmlFor={id} className={clsx(styles.lb3, styles.selLabel)}>
      {label}
    </label>
    <select
      id={id}
      className={clsx(styles.popupSelect, styles.vl3)}
      {...selectProps}
    >
      <option value="" key="default">
        {defaultOption}
      </option>
      {options.map(option => (
        <option value={option} key={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

Select.propTypes = {
  options: PropTypes.array,
};

const CommentForm = ({
  title,
  anchorEl,
  open,
  handleClose,
  rowData,
  handleSubmit,
  handleCancel,
  cancelButtonText = 'CANCEL',
  submitButtonText = 'SUBMIT',
}) => {
  const defaultReason = 'Select a Reason';
  const defaultAgency = 'Select an Agency';

  const [editRowData, setEditRowData] = useState({});
  const [comment, setComment] = useState('');
  const [reason, setReason] = useState('');
  const [agency, setAgency] = useState('');
  const [error, setError] = useState(null);

  const [isDescriptionPopupOpen, setIsDescriptionPopupOpen] = useState(false);
  const [popoverVal, setPopoverVal] = useState(null);
  const [descriptionAnchorEl, setDescriptionAnchorEl] = useState(null);

  const handleDescriptionPopoverOpen = (event, val) => {
    if (event.currentTarget.scrollWidth > event.currentTarget.clientWidth) {
      const size = val.length;
      const hoverText = (
        <span>
          {val.toString().substring(0, size / 2)}
          <br />
          {val.toString().substring(size / 2)}
        </span>
      );
      setPopoverVal(hoverText);
      setIsDescriptionPopupOpen(true);
      setDescriptionAnchorEl(event.currentTarget);
    }
  };

  const handleDescriptionPopoverClose = () => {
    setIsDescriptionPopupOpen(false);
    setDescriptionAnchorEl(null);
  };

  const closeDescriptionPopup = () => setIsDescriptionPopupOpen(false);
  const useDescriptionPopoverStyles = makeStyles(theme => ({
    popover: {
      pointerEvents: 'none',
    },
    paper: {
      padding: theme.spacing(1),
      color: 'white',
      backgroundColor: 'grey',
      fontSize: '11.5px', // TODO: keep same as value
    },
  }));

  const descriptionPopoverClasses = useDescriptionPopoverStyles();

  useEffect(() => {
    if (rowData) {
      const { plan, attributes, ...rest } = rowData;
      setEditRowData({ ...rest, ...plan, ...attributes });
    }
  }, [rowData]);

  useEffect(() => {
    if (open) {
      setReason(rowData.reason || '');
      setAgency(rowData.agency || '');
      setComment(rowData.comment || '');
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const renderRow = (label, value) => {
    if (label && label === 'Description') {
      return (
        <div className={styles.row}>
          <label className={styles.lb1}>{label}</label>
          <span
            className={clsx(styles.value, styles.vl1, styles.mightOverflow)}
            onMouseEnter={e => handleDescriptionPopoverOpen(e, value)}
            onMouseLeave={e => handleDescriptionPopoverClose(e)}
          >
            {value}
          </span>
        </div>
      );
    }
    return (
      <div className={styles.row}>
        <label className={styles.lb1}>{label}</label>
        <span className={clsx(styles.value, styles.vl1)}>{value}</span>
      </div>
    );
  };

  const handleSelectChangeCurry = setState => e => setState(e.target.value);

  return (
    <>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <div className={styles.mainPopup}>
          <div className={styles.row}>
            <h2 className={styles.popupHeading}>{title}</h2>
            <span className={styles.rgtStatus}>* Mandatory fields</span>
          </div>
          <div className={styles.popupFrm}>
            {renderRow('Machine Name', editRowData.equipmentName)}
            {renderRow('Station', editRowData.stationName)}
            {renderRow('VIN', editRowData.vin)}
            {renderRow('Description', editRowData.vcDescription)}

            <Select
              defaultOption={defaultReason}
              id="select-reason"
              name="Reason"
              label="Reason *"
              options={reasons}
              value={reason}
              onChange={handleSelectChangeCurry(setReason)}
            />
            <Select
              defaultOption={defaultAgency}
              id="select-agency"
              name="Agency"
              label="Agency *"
              options={agencies}
              value={agency}
              onChange={handleSelectChangeCurry(setAgency)}
            />

            <div className={styles.row}>
              <label className={clsx(styles.lb1, styles.selLabel)}>
                Comments
              </label>
              <textarea
                className={clsx(styles.popupTextarea, styles.vl1)}
                placeholder="Leave a note here"
                value={comment}
                onChange={e => setComment(e.target.value)}
              />
            </div>
            <div className={styles.row}>
              <div className={styles.bt1}>
                <button
                  type="button"
                  className={styles.btPopup}
                  onClick={handleCancel}
                >
                  {cancelButtonText}
                </button>
              </div>
              <div className={styles.bt2}>
                <button
                  type="button"
                  data-testid="submit-comment"
                  className={clsx(styles.btPopup, styles.submitBt)}
                  onClick={() => {
                    if (reason && agency) {
                      handleSubmit({ ...rowData, reason, agency, comment });
                      handleClose();
                    } else {
                      setError('*Reason and Agency are required');
                    }
                  }}
                >
                  {submitButtonText}
                </button>
              </div>
            </div>
            <div className={styles.errorText}>
              <em>{error}</em>
            </div>
          </div>
        </div>
      </Popover>
      <Popover
        open={isDescriptionPopupOpen}
        anchorEl={descriptionAnchorEl}
        onClose={closeDescriptionPopup}
        className={descriptionPopoverClasses.popover}
        classes={{
          paper: descriptionPopoverClasses.paper,
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {popoverVal}
      </Popover>
    </>
  );
};

CommentForm.propTypes = {
  title: PropTypes.string.isRequired,
  anchorEl: PropTypes.instanceOf(Element),
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  rowData: PropTypes.shape({
    vin: PropTypes.string.isRequired,
    vcDescription: PropTypes.string.isRequired,
    equipmentName: PropTypes.string.isRequired,
    stationName: PropTypes.string.isRequired,
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  cancelButtonText: PropTypes.string,
  submitButtonText: PropTypes.string,
};

export default CommentForm;
