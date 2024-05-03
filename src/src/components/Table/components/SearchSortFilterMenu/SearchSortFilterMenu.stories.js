import React, { useRef, useState } from 'react';
import SearchSortFilterMenu from './SearchSortFilterMenu';

export default {
  title: 'Components/Search sort filter menu',
  component: SearchSortFilterMenu,
};

const Template = args => {
  const [searchText, setSearchText] = useState('');
  const [selectedFilterOptions, setSelectedFilterOptions] = useState([]);

  const ref = useRef(null);
  return (
    <>
      <div ref={ref}> Header </div>
      <SearchSortFilterMenu
        {...args}
        anchorEl={ref.current}
        searchText={searchText}
        handleSearchTextChange={val => setSearchText(val)}
        applyFilters={filters => setSelectedFilterOptions(filters)}
        selectedFilterOptions={selectedFilterOptions}
      />
    </>
  );
};

export const Default = Template.bind({});

Default.args = {
  open: true,
  handleClose: () => {},
  filterOptions: [
    'pending',
    'selected',
    'dropped',
    'rolled',
    'lined out',
    'others',
    'a',
    'test',
    'xyz',
    'mt0',
    'mto',
    'mtx',
    'fish',
  ],
  enableSearch: true,
  enableFilter: true,
};

export const OnlySearch = Template.bind({});

OnlySearch.args = {
  ...Default.args,
  enableSearch: true,
  enableFilter: false,
};
