import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Select, { components } from 'react-select';

const CustomSelect = ({
  className,
  isDisabled,
  isMandatory,
  markIfUnselected,
  maxMenuHeight = 160,
  name,
  showError,
  value,
  resetAllVisitedFields,
  hideDropDownIndicator,
 ...props
}) => {
  const [isVisited, setIsVisited] = useState(false);
  const shouldMarkRed =
    ((isMandatory && isVisited) || markIfUnselected) && !value && !isDisabled;

  const error = shouldMarkRed || showError;

  useEffect(() => {
    if (resetAllVisitedFields && isVisited)
      setIsVisited(false);
  }, [resetAllVisitedFields, isVisited])

  return (
    <Select
      onBlur={() => setIsVisited(true)}
      value={value}
      className={className}
      isDisabled={isDisabled}
      components={{
        DropdownIndicator: (dropDownIndicatorProps) =>
          !isDisabled && !hideDropDownIndicator
            ? (<components.DropdownIndicator {...dropDownIndicatorProps} />)
            : null,
        IndicatorSeparator: (indicatorSeparatorProps) =>
          !isDisabled && !hideDropDownIndicator
            ? (<components.IndicatorSeparator {...indicatorSeparatorProps} />)
            : null
      }}
      classNamePrefix={`select-${name}`}
      maxMenuHeight={maxMenuHeight}
      styles={{
        control: (provided, state) => ({
          ...provided,
          minHeight: '35px',
          height: '100%',
          borderColor: state.isFocused ? '#E9DEAE' : '#c4c4c4',
          boxShadow: state.isFocused && '0 0 0 1px #E9DEAE',
          backgroundColor: state.isDisabled ? '#f3f5f9' : '#fff',
          ...(error && {
            borderColor: 'red',
            outline: 'none',
            '&:hover': {
              borderColor: 'red',
            },
          }),
          '&:hover': {
            borderColor: '#E9DEAE'
          },
        }),
        menuList: provided => ({
          ...provided,
          '&::-webkit-scrollbar': {
            width: '4px !important',
            height: '6px',
            display: 'block !important',
            background: 'none',
          },
          '&::-webkit-scrollbar-track': {
            background: 'none',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#f17c7c',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#da6363',
          },
        }),

        multiValue: provided => ({
          ...provided,
          backgroundColor: '#C9AF28',
          maxWidth: '140px'
        }),
        singleValue: provided => ({
          ...provided,
          color: '#146DA2'
        }),
        multiValueLabel: provided => ({
          ...provided,
          color: '#fff'
        }),
        multiValueRemove: provided => ({
          ...provided,
          color: '#fff'
        }),
        valueContainer: provided => ({
          ...provided,
          cursor: 'text'
        })
      }}
      {...props}
    />
  );
};

CustomSelect.propTypes = {
  className: PropTypes.string,
  isDisabled: PropTypes.bool,
  isMandatory: PropTypes.bool,
  markIfUnselected: PropTypes.bool,
  maxMenuHeight: PropTypes.number,
  name: PropTypes.string,
  showError: PropTypes.bool,
  value: PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
  }).isRequired,
  resetAllVisitedFields: PropTypes.bool,
  hideDropDownIndicator: PropTypes.bool

};

export default CustomSelect;
