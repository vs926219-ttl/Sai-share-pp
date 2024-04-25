import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import SearchIcon from '@material-ui/icons/Search';
import { MdClose } from 'react-icons/md';
import styles from './SearchBar.module.css';

const SearchBar = ({ searchQuery, setSearchQuery }) => (
  <div className={clsx(styles.searchBarContainer)}>
    <input
      className={styles.input}
      value={searchQuery}
      onInput={e => setSearchQuery(e.target.value)}
      type="text"
      id="header-search"
      data-testid="header-search"
      autoComplete="off"
    />
    {searchQuery ? (
      <MdClose
        className={clsx(styles.icon, styles.clickable)}
        onClick={() => setSearchQuery('')}
      />
    ) : (
      <SearchIcon className={styles.icon} />
    )}
  </div>
);

SearchBar.propTypes = {
  searchQuery: PropTypes.string,
  setSearchQuery: PropTypes.func.isRequired,
};

export default SearchBar;
