/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import styles from './CustomTab.module.css';

const CustomTab = ({
  classNames = {},
  count,
  title,
  isSelected,
  handleClick,
  countColor,
  withOutCount
}) => {
  const classForTabWrapper = isSelected
    ? styles.selected
    : styles.notSelected;

  const possibleColors = ['blue', 'red'];
  const classForCount = isSelected
		? possibleColors.includes(countColor) && countColor === 'red'
			? styles.redCount
			: styles.blueCount
		: styles.notSelectedCount;
  return (
    <div
      className={clsx(
        !classNames.tabWrapper ? styles.tabWrapper : classNames.tabWrapper,
        classForTabWrapper
      )}
      onClick={handleClick}
      onKeyDown={handleClick}
      role="button"
      tabIndex={0}
      style={{ cursor: 'pointer', outline: 'none' }}
    >
      <div className={styles.countTitleWrapper}>
        {
          !withOutCount &&
            <span aria-label={`${title}-count`} className={classForCount}>
              {count}
            </span>
        }
        <span className={clsx(
          styles.title,
          isSelected ? classNames.selected : classNames.notSelected
        )}>{title}</span>
      </div>
    </div>
  );
};

CustomTab.propTypes = {
  classNames: PropTypes.object,
  count: PropTypes.number,
  title: PropTypes.string,
  isSelected: PropTypes.bool,
  handleClick: PropTypes.func,
  countColor: PropTypes.string,
  withOutCount: PropTypes.bool
};

export default CustomTab;
