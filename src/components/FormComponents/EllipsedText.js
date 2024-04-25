import React, { useRef, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles, Popover } from '@material-ui/core';
import styles from './FormComponents.module.css';

const EllipsedText = ({ value, className, ...props }) => {
  const spanRef = useRef(null);
  const [showPopover, setShowPopover] = useState(false);

  const useDescriptionPopoverStyles = makeStyles(() => ({
    popover: {
      pointerEvents: 'none',
    },
    paper: {
      color: 'white',
      padding: '2px 3px',
      backgroundColor: 'grey',
      fontSize: '14px', // TODO: keep same as value
    },
  }));

  const handleDescriptionPopoverOpen = (event) => {
    if (event.currentTarget.scrollWidth > event.currentTarget.clientWidth) {
      setShowPopover(true);
    }
  };

  const descriptionPopoverClasses = useDescriptionPopoverStyles();

  return (
    <>
      <Popover
        open={showPopover}
        anchorEl={spanRef.current}
        onClose={() => setShowPopover(false)}
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
        <span className={styles.ellipsisPopup}>{value}</span>
      </Popover>
      <span
        ref={spanRef}
        onMouseEnter={e => handleDescriptionPopoverOpen(e, value)}
        onMouseLeave={() => setShowPopover(false)}
        className={clsx(className, styles.mightOverflow)}
        {...props}
      >
        {value}
      </span>
    </>
  );
};

EllipsedText.propTypes = {
  value: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default EllipsedText;
