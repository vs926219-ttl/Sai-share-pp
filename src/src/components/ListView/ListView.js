/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import styles from './ListView.module.css';

function ListView({
  listItems = [],
  handleSelection,
  title,
  selectedColumnLables,
  updateNavigationData ,
  index
}) {
  const [currentSelection, setCurrentSelection] = useState(null);
    const dispatch = useDispatch();

  const handleClick = (item) => {
    if (!index && selectedColumnLables.length > 1) {
      !index
        ? (selectedColumnLables = selectedColumnLables.slice(0, 1))
        : selectedColumnLables.pop();

      selectedColumnLables[item.level - 1] = item.label;
    } else if (index + 1 === item.level - 1) {
      index &&
        selectedColumnLables.length > item.level &&
        (selectedColumnLables = selectedColumnLables.slice(0, item.level));

      selectedColumnLables[item.level - 1] = item.label;
      setCurrentSelection(item);
    } else {
      selectedColumnLables.length && selectedColumnLables.pop();

      selectedColumnLables?.push(item.label);
      setCurrentSelection(item);
    }
    
    handleSelection(item);
    dispatch(updateNavigationData(selectedColumnLables));
  };

  if (!listItems?.length) return null;
  return (
    <div
      className={clsx(
        styles.listView,
        currentSelection && styles.selectedLane,
        styles.scrollBar
      )}
    >
      <span className={styles.listTitle}>{title || 'Select'}</span>
      {listItems?.map((item) => (
        <button
          key={item.label}
          type='button'
          onClick={() => (item.action ? item.action() : handleClick(item))}
          className={clsx(
            styles.listItem,
            selectedColumnLables &&
             ( selectedColumnLables[item.level - 1] || selectedColumnLables[index ]) === item.label &&
              styles.selected
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

ListView.propTypes = {
  listItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      action: PropTypes.func,
    })
  ),
  handleSelection: PropTypes.func.isRequired,
  title: PropTypes.string,
  selectedColumnLables: PropTypes.array,
  updateNavigationData:PropTypes.func,
  index:PropTypes.number
};
export default ListView;
