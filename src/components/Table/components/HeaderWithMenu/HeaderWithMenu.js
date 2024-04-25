/* eslint-disable no-nested-ternary */
import React, { useRef, useState } from 'react';
import FilterListIcon from '@material-ui/icons/FilterList';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import styles from './HeaderWithMenu.module.css';
import SearchSortFilterMenu from '../SearchSortFilterMenu/SearchSortFilterMenu';
import { columnProptype } from '../../types';

const HeaderWithMenu = ({
  column,
  searchText,
  field,
  rows,
  selectedFilterOptions,
  ...args
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const ref = useRef(null);

  const uniqueFilterOptions = column.customFilterOptions
    ? new Set(column.customFilterOptions)
    : field === 'allPlants' || field === 'allVehicleLines'
      ? new Set(rows.map(row => row[field])[0]?.map(i => i).filter(i => i))
      : new Set(rows.map(row => row[field]).filter(i => i));

  return (
    <>
      <div className={styles.headerWithMenu}>
        <div
          className={styles.ellipsisText}
          style={{ textAlign: column.alignment || 'left' }}
        >
          {column.title}
        </div>
        <FilterListIcon
          className={clsx(
            styles.filterIcon,
            (searchText || selectedFilterOptions?.size || isMenuOpen) &&
              styles.openFilterIcon,
          )}
          onClick={() => setIsMenuOpen(true)}
          ref={ref}
          aria-label={`menu-for-column-${column.title}`}
        />
      </div>

      <div style={{ background: '#fafafa' }}>
        <SearchSortFilterMenu
          options={column}
          rows={rows}
          field={field}
          open={isMenuOpen}
          anchorEl={ref.current}
          handleClose={() => setIsMenuOpen(false)}
          enableSearch={column.enableSearch}
          enableFilter={column.enableFilter}
          searchText={searchText}
          filterOptions={[...uniqueFilterOptions]}
          selectedFilterOptions={selectedFilterOptions}
          searchLabel={column.title}
          {...args}
        />
      </div>
    </>
  );
};

HeaderWithMenu.propTypes = {
  column: columnProptype,
  searchText: PropTypes.string,
  field: PropTypes.string,
  rows: PropTypes.array,
  selectedFilterOptions: PropTypes.objectOf(Set),
};

export default HeaderWithMenu;
