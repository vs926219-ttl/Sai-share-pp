/* eslint-disable arrow-body-style */
import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import ReactSelect from 'react-select';
import styles from './Select.module.css';

const defaultOptions = [
  { label: 'Jharkand', value: 'jharkand' },
  { label: 'pune', value: 'pune' },
];

const Select = ({
  label,
  options = defaultOptions,
  selectClassName,
  selectName,
  maxMenuHeight = 160,
  onChange,
  isLoading,
  ...props
}) => {
  return (
    <div {...props}>
      {label}
      <ReactSelect
        isLoading={isLoading}
        options={options}
        className={clsx(styles.select, selectClassName)}
        classNamePrefix={`select-${selectName}`}
        maxMenuHeight={maxMenuHeight}
        styles={{
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
          control: provided => ({
            ...provided,
            minHeight: 0,
            height: '100%',
            padding: 0,
            border: 'solid 1px #707070',
          }),
          dropdownIndicator: provided => ({
            ...provided,
            width: '30px',
            padding: '5px',
          }),
        }}
        onChange={onChange}
      />
    </div>
  );
};

Select.propTypes = {
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ),
  selectClassName: PropTypes.string,
  selectName: PropTypes.string.isRequired,
  maxMenuHeight: PropTypes.number,
  onChange: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default Select;
