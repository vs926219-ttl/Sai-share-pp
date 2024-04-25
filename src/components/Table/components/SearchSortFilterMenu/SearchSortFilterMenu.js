/* eslint-disable no-param-reassign */
import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Button } from '@tmlconnected/avant-garde-components-library';
import styles from './SearchSortFilterMenu.module.css';
import { PopoverPaper, SearchBar } from '../../../../atomicComponents';

const SearchSortFilterMenu = ({
  open,
  handleClose,
  filterOptions,
  selectedFilterOptions,
  applyFilters,
  enableSearch,
  enableFilter,
  anchorEl,
}) => {
  const [filterSelections, setFilterSelections] = useState(
    new Set(selectedFilterOptions),
  );

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
  const [searchQuery, setSearchQuery] = useState('');
  const filteredOptions = filterOptionsFunc(filterOptions, searchQuery);

  const handleFilterSelection = filterOption => {
    setFilterSelections(prev => {
      const copySet = new Set(prev);
      if (copySet.delete(filterOption)) {
        return copySet;
      }
      return new Set([...copySet, filterOption]);
    });
  };

  const selectAllCheckboxRef = useCallback(
    node => {
      if (node !== null) {
        if (
          filterSelections.size &&
          filterSelections.size === filteredOptions.length
        ) {
          node.checked = true;
          node.indeterminate = false;
        } else if (filterSelections.size > 0) {
          node.indeterminate = true;
          node.checked = false;
        } else {
          node.checked = false;
          node.indeterminate = false;
        }
      }
    },
    [filterSelections, filteredOptions],
  );

  useEffect(() => {
    setFilterSelections(new Set(selectedFilterOptions));
  }, [selectedFilterOptions]);

  return (
    <PopoverPaper
      open={open}
      handleClose={() => {
        handleClose();
        setSearchQuery('');
      }}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
    >
      <div className={styles.container}>
        {enableSearch && (
          <div className={styles.searchBarArea}>
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
        )}
        {enableFilter && filterOptions?.length > 0 && (
          <>
            <div className={clsx(styles.filterArea, styles.scrollBar)}>
              <div className={styles.filtersList}>
                {filteredOptions?.length > 1 && (
                  <div className={styles.filterOption}>
                    <input
                      ref={selectAllCheckboxRef}
                      name="select-all"
                      type="checkbox"
                      data-testid="select-all-filters"
                      onChange={() => {
                        if (filterSelections.size === filteredOptions.length)
                          setFilterSelections(new Set());
                        else setFilterSelections(new Set(filteredOptions));
                      }}
                    />
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                    <label htmlFor="select-all-filters">Select All</label>
                  </div>
                )}
                {filteredOptions.map(option => (
                  <div
                    className={styles.filterOption}
                    key={option?.value || option}
                  >
                    {typeof option === 'string' ? (
                      <>
                        <input
                          id={`option-${option}`}
                          data-testid={`option-${option}`}
                          type="checkbox"
                          name={option}
                          checked={filterSelections.has(option)}
                          onChange={() => {
                            handleFilterSelection(option);
                          }}
                        />
                        <label htmlFor={`option-${option}`}>{option}</label>
                      </>
                    ) : (
                      <>
                        <input
                          type="checkbox"
                          name={option.value}
                          checked={filterSelections.has(option)}
                          onChange={() => handleFilterSelection(option)}
                        />
                        <label htmlFor={option.value}>{option.node}</label>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.filterApplyButtons}>
              <Button
                className={styles.cancelButton}
                variant="secondary"
                onClick={() => {
                  setFilterSelections(new Set(selectedFilterOptions));
                  handleClose();
                  setSearchQuery('');
                }}
              >
                CANCEL
              </Button>
              <Button
                className={styles.okButton}
                variant="primary"
                onClick={() => {
                  applyFilters([...filterSelections]);
                  handleClose();
                  setSearchQuery('');
                }}
              >
                OK
              </Button>
            </div>
          </>
        )}
      </div>
    </PopoverPaper>
  );
};

SearchSortFilterMenu.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
  selectedFilterOptions: PropTypes.objectOf(Set),
  applyFilters: PropTypes.func,
  filterOptions: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  ),
  enableSearch: PropTypes.bool,
  enableFilter: PropTypes.bool,
  anchorEl: PropTypes.any,
};

export default SearchSortFilterMenu;
