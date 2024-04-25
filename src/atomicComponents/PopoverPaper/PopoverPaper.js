import React from 'react';
import PropTypes from 'prop-types';
import { Popover, Paper } from '@material-ui/core';
import styles from './PopoverPaper.module.css';

const defaultAnchorOrigin = {
  vertical: 'top',
  horizontal: 'left',
};

const defaultTransformOrigin = {
  vertical: 'top',
  horizontal: 'right',
};

/*
 * Note: The paper will take the dimensions of the children
 */
const PopoverPaper = ({
  children,
  open,
  handleClose,
  anchorEl,
  anchorOrigin = defaultAnchorOrigin,
  transformOrigin = defaultTransformOrigin,
}) => (
  <Popover
    open={open}
    anchorEl={anchorEl}
    onClose={handleClose}
    anchorOrigin={anchorOrigin}
    transformOrigin={transformOrigin}
  >
    <Paper className={styles.container}>{children}</Paper>
  </Popover>
);

const verticalValues = ['top', 'bottom', 'center'];
const horizontalValues = ['left', 'right', 'center'];

PopoverPaper.propTypes = {
  children: PropTypes.any,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  anchorEl: PropTypes.instanceOf(Element),
  anchorOrigin: PropTypes.shape({
    vertical: PropTypes.oneOf(verticalValues),
    horizontal: PropTypes.oneOf(horizontalValues),
  }),
  transformOrigin: PropTypes.shape({
    vertical: PropTypes.oneOf(verticalValues),
    horizontal: PropTypes.oneOf(horizontalValues),
  }),
};

export default PopoverPaper;
