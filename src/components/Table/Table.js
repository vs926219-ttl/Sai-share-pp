/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState, useMemo } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { AutoSizer, InfiniteLoader, List } from 'react-virtualized';
import { Popover, LinearProgress } from '@material-ui/core';
import { Button } from '@tmlconnected/avant-garde-components-library';
import { AuthChecker } from '../../atomicComponents';
import styles from './Table.module.css';
import { columnsPropType } from './types';
import { TableHead, SelectionMenu, TableRow } from './components';

function filterBySearchTexts(fieldToSearchTextMap, data, columns) {
  const fieldToSearchFnMap = columns.reduce((acc, col) => {
    if (col.searchFn) return { ...acc, [col.field]: col.searchFn };
    return acc;
  }, {});

  let filteredData = [...data];
  Object.entries(fieldToSearchTextMap).forEach(entry => {
    const [field, searchText] = entry;
    const defaultSearchFn = (fieldValue, searchValue) =>
      fieldValue.toLowerCase().startsWith(searchValue);

    const searchFn = fieldToSearchFnMap[field] || defaultSearchFn;

    filteredData = filteredData.filter(
      row => !searchText || !row[field] || searchFn(row[field], searchText),
    );
  });
  return filteredData;
}

function filterBySelectedFilters(fieldToFiltersSetMap, data, columns) {
  const fieldToFilterFnMap = columns.reduce((acc, col) => {
    if (col.filterFn) return { ...acc, [col.field]: col.filterFn };
    return acc;
  }, {});

  let filteredData = [...data];
  Object.entries(fieldToFiltersSetMap).forEach((entry, idx) => {
    const [field, filtersSet] = entry;
    const filterFn = fieldToFilterFnMap[field];

    filteredData = filteredData.filter(row => {
      if (!filterFn) {
        return !filtersSet?.size ||
          filtersSet.has(row[field]) ||
          (
            row[field] instanceof Array &&
            row[field].some(i => [...filtersSet].includes(i))
          );
      }
      if (!idx) {
        console.log(' [...filtersSet]', [...filtersSet]);
      }

      return (
        !filtersSet?.size ||
        [...filtersSet].some(filter => filterFn(row, filter.value ? filter.value : filter))
      );
    });
  });
  return filteredData;
}

function deepCompareEqualsColumnsArray(oldArray, newArray) {
  if (oldArray?.length !== newArray?.length) return false;
  const zippedArray = oldArray.map((e, i) => [e, newArray[i]]);
  return zippedArray.every(tuple => tuple[0].title === tuple[1].title);
}

function useDeepCompareColumnArraysMemoize(value) {
  const ref = useRef();
  // it can be done by using useMemo as well
  // but useRef is rather cleaner and easier

  if (!deepCompareEqualsColumnsArray(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

function useDeepCompareColumnArraysEffect(callback, dependencies) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(callback, dependencies.map(useDeepCompareColumnArraysMemoize));
}

const Table = ({
  rows: data,
  columns: originalColumns,
  classNames = {},
  rowHeight = 38,
  headerHeight,
  defaultColumns: originalDefaultColumns,
  removeRowSelection,
  primaryAction,
  secondaryActions = [],
  setHasActiveEdits,
  setAsnCount,
  isDataLoading,
  hideActionButtons,
  showRadioButton,
  onSelect,
  tableName,
  pagination,
  onRowSelect
}) => {
  
  const [rowsData, setRowsData] = useState({
    data: [...data],
    filteredData: [...data],
  });

  const [fieldToSearchTextMap, setFieldToSearchTextMap] = useState({});
  const [isEllipsisPopupOpen, setIsEllipsisPopupOpen] = useState(false);
  const [ellipsisAnchorEl, setEllipsisAnchorEl] = useState(null);
  const [ellipsisPopupValue, setEllipsisPopupValue] = useState(null);
  const [fieldToFiltersSetMap, setFieldToFiltersSetMap] = useState({});

  const closeEllipsisPopup = () => setIsEllipsisPopupOpen(false);

  const vListRef = useRef(null);
  const tableHeadRef = useRef(null);

  const handleListScroll = e => {
    tableHeadRef.current.scrollLeft = e.target.scrollLeft;
  };

  const syncListToTableHead = e => {
    vListRef.current.scrollLeft = e.target.scrollLeft;
  };

  useEffect(() => {
    // eslint-disable-next-line prefer-destructuring
    vListRef.current = document.getElementsByClassName(
      'ReactVirtualized__Grid ReactVirtualized__List',
    )[0];

    if (vListRef.current)
      vListRef.current.addEventListener('scroll', handleListScroll);
    tableHeadRef.current.addEventListener('scroll', syncListToTableHead);
  }, []);

  useEffect(() => {
    // TODO: Fix this
    if(setAsnCount){
      setAsnCount(rowsData.filteredData.length);
    }
  }, [setAsnCount, rowsData]);

  const handlePopoverOpen = (event, val) => {
    if (event.currentTarget.scrollWidth > event.currentTarget.clientWidth) {
      setEllipsisPopupValue(val);
      setIsEllipsisPopupOpen(true);
      setEllipsisAnchorEl(event.currentTarget);
    }
  };

  const handlePopoverClose = () => {
    setIsEllipsisPopupOpen(false);
    setEllipsisAnchorEl(null);
  };

  const toggleSelectAllRows = () =>
    {
     setRowsData(prev => {
      const visibleRowIdsSet = new Set(prev.filteredData.map(row => row.id));
      const isSelected = !prev.filteredData.every(row => row.isSelected);
      return {
        ...prev,
        filteredData: prev.filteredData.map(row => ({ ...row, isSelected })),
        data: prev.data.map(row => {
          if (visibleRowIdsSet.has(row.id)) return { ...row, isSelected };
          return row;
        }),
      };
    });
  }

  const handleRowSelection = selectedId =>
    setRowsData(prev => ({
      ...prev,
      data: prev.data.map(row =>
        row.id === selectedId ? { ...row, isSelected: !row.isSelected } : row,
      ),
    }));

  const handleRadioRowSelection = item => {
    setRowsData(prev => ({
      ...prev,
      data: prev.data.map(row => row.id === item.id ? { ...row, isSelected: true } : { ...row, isSelected: false }),
    }));
   
    onSelect(item);
  };

  useEffect(() => {
    if (setHasActiveEdits) {
      const areEditsActive = rowsData.data.some(row => row.isSelected);
      setHasActiveEdits(areEditsActive);
    }
  }, [rowsData.data, setHasActiveEdits]);

  const defaultColumns = useMemo(
    () =>
      [
        showRadioButton ? null :
          {
          title: '#',
          field: '_serialNumber',
          width: 40,
          render: (_, idx) => idx,
          headerStyles: {
            paddingLeft: 7,
            paddingRight: 2,
          },
        },
        (primaryAction || secondaryActions?.length) && !removeRowSelection
          ? {
            title: 'select',
            field: '_select',
            width: 30,
            renderHeader: rows => (
              <input
                type="checkbox"
                onChange={toggleSelectAllRows}
                // eslint-disable-next-line react/destructuring-assignment
                checked={rows?.length && rows.every(row => row.isSelected)}
              />
            ),
            render: ({ isSelected, id }) => (
              <input
                style={{ marginTop: 0, marginBottom: 0 }}
                type="checkbox"
                onChange={() => handleRowSelection(id)}
                checked={!!isSelected}
                data-testid={`select-row-${id}`}
                id={`select-row-${id}`}
                name={`select-row-${id}`}
              />
            ),
          }
          : null,
          
        ...originalDefaultColumns,
      ].filter(i => i),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [originalDefaultColumns],
  );
  const radioColumn = useMemo(
    () =>
    [
      showRadioButton ? {
        title: 'select',
        field: '_select',
        width: 30,
        renderHeader: rows => (
          <input
            type="radio"
            onChange={toggleSelectAllRows}
            // eslint-disable-next-line react/destructuring-assignment
            checked={rows?.length && rows.every(row => row.isSelected)}
          />
        ),
        render: (row) => (
          <input
            style={{ marginTop: 0, marginBottom: 0 }}
            type="radio"
            onChange={() => handleRadioRowSelection(row)}
            checked={row.isSelected}
            data-testid={`radio-row-${row.id}`}
            id={`radio-row-${row.id}`}
            name={`radio-row-${tableName}`}
          />
        ),
      }
      : null
    ]
  )
  const [selectedColumns, setSelectedColumns] = useState(defaultColumns);

  const noOfFixedColumns = primaryAction || secondaryActions?.length ? 2 : 1;

  const [isCustomizeTableMenuOpen, setIsCustomizeTableMenuOpen] = useState(
    false,
  );
  const [showCopyAlert, setShowCopyAlert] = useState(false);

  const customizeTableButtonRef = useRef(null);

  const reorder = (list, startIndex, endIndex) => {
    const result = [...list];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const reorderHeaders = result => {
    // dropped outside the list or dropped at serial number place
    if (!result.destination || result.destination.index < noOfFixedColumns) {
      return;
    }

    const reorderedColumns = reorder(
      selectedColumns,
      result.source.index,
      result.destination.index,
    );

    setSelectedColumns(reorderedColumns);
  };

  const rowRenderer = ({ style, index, key }) => {
    const handleCopy = text => {
      navigator.clipboard.writeText(text);
      setShowCopyAlert(true);
    };

    return (
      <TableRow
        index={index}
        style={style}
        key={key}
        row={rowsData.filteredData[index]}
        columns={ showRadioButton ? [...radioColumn,...selectedColumns] : [...selectedColumns] }
        classNames={{ ...classNames }}
        rowHeight={rowHeight}
        onCopy={handleCopy}
        handlePopoverOpen={handlePopoverOpen}
        handlePopoverClose={handlePopoverClose}
        rowClick={(e) => onRowSelect(e)}
      />
    );
  };
  
  const handleColumnSelectionChange = columnTitle => {
    if (selectedColumns.map(({ title }) => title).includes(columnTitle))
      return setSelectedColumns(prev =>
        prev.filter(column => column.title !== columnTitle),
      );
    return setSelectedColumns(prev => [
      ...prev,
      ...originalColumns.filter(({ title }) => title === columnTitle),
    ]);
  };

  const applyColumnsSelections = columnSelections => {
    setSelectedColumns([
      ...defaultColumns.slice(
        0,
        defaultColumns.length - originalDefaultColumns.length,
      ),
      ...originalColumns.filter(col => columnSelections.includes(col.title)),
    ]);
  };

  useEffect(() => {
    if (showCopyAlert) setShowCopyAlert(false);
  }, [showCopyAlert]);

  //  taken from https://stackoverflow.com/questions/54095994/react-useeffect-comparing-objects
  useDeepCompareColumnArraysEffect(() => {
    setSelectedColumns(defaultColumns);
  }, [defaultColumns]);

  useEffect(() => {
    setRowsData(prevState => {
      const dataFilteredBySearchTexts = filterBySearchTexts(
        fieldToSearchTextMap,
        prevState.data,
        selectedColumns,
      );

      const dataFilteredBySearchAndFilters = filterBySelectedFilters(
        fieldToFiltersSetMap,
        dataFilteredBySearchTexts,
        selectedColumns,
      );

      return { ...prevState, filteredData: dataFilteredBySearchAndFilters };
    });
  }, [
    selectedColumns,
    fieldToFiltersSetMap,
    fieldToSearchTextMap,
    rowsData.data,
  ]);

  useEffect(() => { 
    setRowsData({
      data: [...data],
      filteredData: [...data],
    });
  }, [data]);
  
  const isRowLoaded = ({ index }) => !!rowsData.data[index];

  const loadMoreRows = () => 
    new Promise((resolve) => {
      if (!pagination.last) {
        pagination.setCurrentPageNumber(prev => ({
          ...prev,
          number: prev.number + 1
        }))
        resolve();
      }
      else {
        resolve();
      }
    })
    
   return (
    <>
      <div
        style={{ width: '100%', height: '100%' }}
        className={clsx(
          styles.baseContainer,
          classNames.tableContainerClassName,
        )}
      >
        <div
          style={{ width: '100%' }}
          className={clsx(
            styles.basicTableContainer,
            classNames.tableContainerClassName,
          )}
        > 
         {pagination ?
            <InfiniteLoader
              isRowLoaded={isRowLoaded}
              loadMoreRows={loadMoreRows}
              rowCount={rowsData.data.length + 1}
              threshold={1}
              >
                {({ onRowsRendered, registerChild }) => (
                <AutoSizer>
                  {({ width: windowWidth, height: windowHeight }) => {
                    const width = windowWidth;
                    const height = windowHeight;
                    const listHeight = height - rowHeight - 2;
                    return (
                      <div
                        className={clsx(styles.basicTable, classNames.tableClassName)}
                        style={{
                          height,
                          width,
                        }}
                      >
                        <div style={showRadioButton ? {marginLeft:38} : null}>
                        <TableHead
                          columns={selectedColumns}
                          ref={tableHeadRef}
                          className={classNames.tableHeadClassName}
                          height={headerHeight || rowHeight}
                          reorderHeaders={reorderHeaders}
                          rows={rowsData.filteredData}
                          allRows={rowsData.data}
                          fieldToSearchTextMap={fieldToSearchTextMap}
                          setSearchTextForTitleCurry={field => value =>
                            setFieldToSearchTextMap(prev => ({
                              ...prev,
                              [field]: value.toLowerCase(),
                            }))}
                          noOfFixedColumns={noOfFixedColumns}
                          fieldToFiltersSetMap={fieldToFiltersSetMap}
                          setFiltersForFieldCurry={field => selectedFilters =>
                            setFieldToFiltersSetMap(prev => ({
                              ...prev,
                              [field]: new Set(selectedFilters),
                            }))}
                        />
                        </div>
                        <List
                          ref={registerChild}
                          containerStyle={{ overflow: 'initial' }}
                          rowRenderer={rowRenderer}
                          height={listHeight}
                          rowHeight={rowHeight}
                          rowCount={rowsData.filteredData.length}
                          width={width}
                          className={clsx(
                            styles.scrollBar,
                            styles.heightAdjustedListScroll,
                          )}
                          overscanRowCount={10}
                          onRowsRendered={onRowsRendered}
                        
                        />
                        {isDataLoading && (
                          <div>
                            <LinearProgress />
                          </div>
                        )}
                      </div>
                    );
                  }}
                </AutoSizer>
                )}
            </InfiniteLoader>
            : <AutoSizer>
              {({ width: windowWidth, height: windowHeight }) => {
                const width = windowWidth;
                const height = windowHeight;
                const listHeight = height - rowHeight - 2;
                return (
                  <div
                    className={clsx(styles.basicTable, classNames.tableClassName)}
                    style={{
                      height,
                      width,
                    }}
                  >
                    <div style={showRadioButton ? {marginLeft:38} : null}>
                    <TableHead
                      columns={selectedColumns}
                      ref={tableHeadRef}
                      className={classNames.tableHeadClassName}
                      height={headerHeight || rowHeight}
                      reorderHeaders={reorderHeaders}
                      rows={rowsData.filteredData}
                      allRows={rowsData.data}
                      fieldToSearchTextMap={fieldToSearchTextMap}
                      setSearchTextForTitleCurry={field => value =>
                        setFieldToSearchTextMap(prev => ({
                          ...prev,
                          [field]: value.toLowerCase(),
                        }))}
                      noOfFixedColumns={noOfFixedColumns}
                      fieldToFiltersSetMap={fieldToFiltersSetMap}
                      setFiltersForFieldCurry={field => selectedFilters =>
                        setFieldToFiltersSetMap(prev => ({
                          ...prev,
                          [field]: new Set(selectedFilters),
                        }))}
                    />
                    </div>
                    <List
                      ref={vListRef}
                      containerStyle={{ overflow: 'initial' }}
                      rowRenderer={rowRenderer}
                      height={listHeight}
                      rowHeight={rowHeight}
                      rowCount={rowsData.filteredData.length}
                      width={width}
                      className={clsx(
                        styles.scrollBar,
                        styles.heightAdjustedListScroll,
                      )}
                      overscanRowCount={10}
                    />
                    {isDataLoading && (
                      <div>
                        <LinearProgress />
                      </div>
                    )}
                  </div>
                );
              }}
            </AutoSizer>
          }
         
        </div>
        {!hideActionButtons && 
          <div className={styles.actionsBar}>
            <Button
              className={clsx(styles.actionButton, styles.cutomizeTableButton)}
              variant="tertiary"
              onClick={() => setIsCustomizeTableMenuOpen(true)}
              ref={customizeTableButtonRef}
            >
              CUSTOMIZE TABLE
            </Button>
            {secondaryActions.map(action => (
              <AuthChecker operation={action.authOperation}>
                {isAuthorized => (
                  <Button
                    variant="primary"
                    className={styles.actionButton}
                    style={{
                      backgroundColor: !(
                        action.authOperation &&
                        (!isAuthorized ||
                          // eslint-disable-next-line eqeqeq
                          (action.shouldEnable != undefined && !action.shouldEnable(
                            rowsData.data.filter(row => row.isSelected)
                          ))
                        )
                      )
                        ? action.backgroundColor
                        : null,
                    }}
                    onClick={() =>
                      action.actionFn(rowsData.data.filter(row => row.isSelected))
                    }
                    disabled={
                      action.authOperation &&
                      (!isAuthorized ||
                        !action.shouldEnable(
                          rowsData.data.filter(row => row.isSelected),
                        ))
                    }
                  >
                    {action.name}
                  </Button>
                )}
              </AuthChecker>
            ))}
            {Object.values(fieldToFiltersSetMap).every(
              filtersSet => !filtersSet?.size,
            ) || (
                <Button
                  className={clsx(styles.actionButton, styles.clearFiltersButton)}
                  variant="secondary"
                  onClick={() => setFieldToFiltersSetMap({})}
                >
                  Clear Filters
                </Button>
              )}
            {primaryAction && (
              <AuthChecker operation={primaryAction.authOperation}>
                {isAuthorized => (
                  <Button
                    className={clsx(
                      styles.actionButton,
                      styles.primaryActionButton,
                    )}
                    variant="primary"
                    onClick={() =>
                      primaryAction.actionFn(
                        rowsData.data.filter(row => row.isSelected),
                      )
                    }
                    disabled={
                      !isAuthorized ||
                      !primaryAction.shouldEnable(
                        rowsData.data.filter(row => row.isSelected),
                      )
                    }
                    data-testid="primary-action"
                  >
                    {primaryAction.name}
                  </Button>
                )}
              </AuthChecker>
            )}
          </div>
        }
      </div>
      <SelectionMenu
        anchorEl={customizeTableButtonRef.current}
        open={isCustomizeTableMenuOpen}
        handleClose={() => setIsCustomizeTableMenuOpen(false)}
        options={originalColumns.map(({ title }) => title)}
        currentSelections={selectedColumns
          .filter(({ title }) => title !== 'select' && title !== '#')
          .map(({ title }) => title)}
        handleChange={handleColumnSelectionChange}
        resetToDefault={() => setSelectedColumns([...defaultColumns])}
        applySelections={applyColumnsSelections}
      />
      <Popover
        open={isEllipsisPopupOpen}
        anchorEl={ellipsisAnchorEl}
        onClose={closeEllipsisPopup}
        className={styles.popover}
        classes={{
          paper: styles.popoverPaper,
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {ellipsisPopupValue}
      </Popover>
      <div
        className={clsx(
          styles.copyAlert,
          showCopyAlert ? styles.visible : styles.hidden,
        )}
      >
        Text copied
      </div>
    </>
  );
};

Table.propTypes = {
  classNames: PropTypes.shape({
    tableContainerClassName: PropTypes.string,
    tableClassName: PropTypes.string,
    tableRowClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    tableHeadClassName: PropTypes.string,
    tableCellClassName: PropTypes.string,
  }),
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.isRequired,
    }),
  ),
  columns: columnsPropType,
  rowHeight: PropTypes.number,
  headerHeight: PropTypes.number,
  defaultColumns: columnsPropType,
  removeRowSelection: PropTypes.bool,
  primaryAction: PropTypes.shape({
    name: PropTypes.string.isRequired,
    actionFn: PropTypes.func.isRequired,
  }),
  secondaryActions: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      actionFn: PropTypes.func.isRequired,
      backgroundColor: PropTypes.string,
    }),
  ),
  setHasActiveEdits: PropTypes.func,
  setAsnCount: PropTypes.func,
  isDataLoading: PropTypes.bool,
  hideActionButtons: PropTypes.bool,
  showRadioButton: PropTypes.bool,
  onSelect: PropTypes.func,
  tableName: PropTypes.string,
  pagination: PropTypes.any,
  onRowSelect: PropTypes.func
};

export default Table;
