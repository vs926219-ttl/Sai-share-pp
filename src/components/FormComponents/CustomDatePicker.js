import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from '@material-ui/pickers'
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

const CustomDatePicker = ({
  isDisabled,
  validationFn,
  isMandatory,
  markIfUnselected,
  value,
  resetAllVisitedFields,
  ...props
}) => {
  const classes = useStyles();

  const [isVisited, setIsVisited] = useState(false);
  const shouldMarkRed =
    ((isMandatory && isVisited) || markIfUnselected) && !value && !isDisabled;
  const isValueValid = validationFn && value ? validationFn(value) : true;

  useEffect(() => {
    if (resetAllVisitedFields && isVisited)
      setIsVisited(false);
  }, [resetAllVisitedFields, isVisited])

  return (
    <DatePicker
      error={shouldMarkRed || !isValueValid}
      onBlur={() => setIsVisited(true)}
      isDisabled={ isDisabled}
      style={{ borderColor: 'red', boxShadow: '0px' }}
      value={value}
      {...props}
      className={classes.root}
    />
  );
};

CustomDatePicker.propTypes = {
  isDisabled: PropTypes.bool,
  validationFn: PropTypes.func,
  isMandatory: PropTypes.bool,
  markIfUnselected: PropTypes.bool,
  value: PropTypes.object,
  resetAllVisitedFields: PropTypes.bool
};

export default CustomDatePicker;
