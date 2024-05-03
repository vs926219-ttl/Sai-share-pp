/* eslint-disable no-param-reassign */
import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Button } from '@tmlconnected/avant-garde-components-library';
import { PopoverPaper, SearchBar } from '../../../../atomicComponents';
import styles from './SelectionMenu.module.css';

const SelectionMenu = ({
  open,
  handleClose,
  anchorEl,
  options,
  currentSelections,
  resetToDefault,
  applySelections,
}) => {
  const [columnSelections, setColumnSelections] = useState([
    ...currentSelections,
  ]);

  const selectAllCheckboxRef = useCallback(
    node => {
      if (node !== null) {
        if (
          columnSelections.length &&
          columnSelections.length === options.length
        ) {
          node.checked = true;
          node.indeterminate = false;
        } else if (columnSelections.length > 0) {
          node.indeterminate = true;
          node.checked = false;
        } else {
          node.checked = false;
          node.indeterminate = false;
        }
      }
    },
    [columnSelections, options],
  );

  const handleColumnSelectionChange = option => {
    if (columnSelections.includes(option)) {
      setColumnSelections(prevState => prevState.filter(col => col !== option));
    } else {
      setColumnSelections(prevState => [...prevState, option]);
    }
  };

  const handleSelectAllClick = () => {
    if (columnSelections.length === options.length) {
      setColumnSelections([]);
    } else {
      setColumnSelections([...options]);
    }
  };

  useEffect(() => {
    if (currentSelections) setColumnSelections([...currentSelections]);
  }, [currentSelections]);

  const [searchQuery, setSearchQuery] = useState('');

  const filterOptionsFunc = (optionsToBeFiltered, query) => {
    if (!query) {
      return optionsToBeFiltered;
    }
    const searchedOption = optionsToBeFiltered.filter(option => {
      const optionName = option.toLowerCase();
      const lowerCaseQuery = query.toLowerCase();
      return optionName.includes(lowerCaseQuery);
    });
    return searchedOption;
  };
  const filteredOptions = filterOptionsFunc(options, searchQuery);
  return (
    <PopoverPaper
      open={open}
      handleClose={() => {
        handleClose();
        setSearchQuery('');
      }}
      anchorEl={anchorEl}
      transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    >
      <div className={styles.selectionMenuContainer}>
        <Button
          onClick={resetToDefault}
          variant="secondary"
          className={styles.resetToDefaultButton}
        >
          RESET
        </Button>
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className={clsx(styles.selectionMenu, styles.scrollBar)}>
          {filteredOptions?.length > 1 && (
            <div className={styles.selectOption}>
              <input
                ref={selectAllCheckboxRef}
                name="select-all"
                type="checkbox"
                data-testid="select-all-filters"
                onChange={handleSelectAllClick}
              />
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="select-all-filters">Select All</label>
            </div>
          )}
          {filteredOptions.map(option => (
            <div className={styles.selectOption} key={option}>
              <input
                data-testid={`column-selection-for-${option}`}
                id={`column-selection-for-${option}`}
                type="checkbox"
                name={option}
                onChange={() => {
                  handleColumnSelectionChange(option);
                }}
                checked={columnSelections.includes(option)}
              />
              <label htmlFor="option">{option}</label>
            </div>
          ))}
        </div>
        <div className={styles.buttonsWrapper}>
          <Button
            onClick={() => {
              setColumnSelections([...currentSelections]);
              handleClose();
              setSearchQuery('');
            }}
            variant="secondary"
            className={styles.cancelButton}
          >
            CANCEL
          </Button>
          <Button
            onClick={() => {
              applySelections(columnSelections);
              handleClose();
              setSearchQuery('');
            }}
            className={styles.okButton}
          >
            OK
          </Button>
        </div>
      </div>
    </PopoverPaper>
  );
};

SelectionMenu.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  anchorEl: PropTypes.instanceOf(Element),
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentSelections: PropTypes.arrayOf(PropTypes.string).isRequired,
  resetToDefault: PropTypes.func.isRequired,
  applySelections: PropTypes.func.isRequired,
};

export default SelectionMenu;
