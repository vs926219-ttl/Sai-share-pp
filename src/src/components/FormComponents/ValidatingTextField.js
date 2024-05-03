import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    "& .MuiOutlinedInput-root": {
      background: '#fff'
    },
    "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "#E9DEAE"
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#E9DEAE"
    },
    '&	.Mui-disabled': {
      backgroundColor: "#f3f5f9"
    },
  }
})

const ValidatingTextField = ({
  isDisabled,
  isMandatory,
  markIfEmpty,
  validationFn,
  validationHelperText,
  value,
  resetAllVisitedFields,
  ...props
}) => {
  const classes = useStyles();

  const [isVisited, setIsVisited] = useState(false);
  const shouldMarkRed =
    ((isMandatory && isVisited) || markIfEmpty) && !value && !isDisabled;
  const isValueValid = validationFn && value ? validationFn(value) : true;

  useEffect(() => {
    if (resetAllVisitedFields && isVisited)
      setIsVisited(false);
  }, [resetAllVisitedFields, isVisited])

  return (
    <TextField
      onBlur={() => setIsVisited(true)}
      error={shouldMarkRed || !isValueValid}
      helperText={!isValueValid ? validationHelperText : null}
      value={value}
      {...props}
      className={classes.root}
      disabled={isDisabled}
    />
  );
};

ValidatingTextField.propTypes = {
  isDisabled: PropTypes.bool,
  isMandatory: PropTypes.bool,
  markIfEmpty: PropTypes.bool,
  validationFn: PropTypes.func.isRequired,
  validationHelperText: PropTypes.string,
  value: PropTypes.string,
  resetAllVisitedFields: PropTypes.bool
};

export default ValidatingTextField;
