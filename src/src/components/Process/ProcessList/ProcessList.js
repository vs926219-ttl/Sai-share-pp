/* eslint-disable jsx-a11y/click-events-have-key-events */
import SearchOutlined from '@material-ui/icons/SearchOutlined';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { React } from 'react';
import { RiFilter2Line } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { AutoSizer, InfiniteLoader, List } from 'react-virtualized';
import ChildList from '../../../atomicComponents/ChildList/ChildList';
import Menu from '../../../atomicComponents/Menu/Menu';
import { PPAP_STATE } from '../../../constants';
import { SET_OPEN_MENU } from '../../../redux/features/filter/actionTypes';
import styles from './ProcessList.module.css';

function ProcessList({
  data,
  pagination,
  handleClick,
  searchInput,
  removeChip,
}) {
  const { last, setState } = pagination;
  const { filter, dataList } = useSelector((state) => state.filters);
  const dispatch = useDispatch();
  const isRowLoaded = ({ index }) => !!data[index];

  const loadMoreRows = () =>
    new Promise((resolve) => {
      if (!last) {
        setState((prev) => ({
          ...prev,
          number: prev.number + 1,
        }));
        resolve();
      } else {
        resolve();
      }
    });

  function rowRenderer({ key, index, style }) {
    return (
      <div key={key} style={style}>
        <div
          className={clsx(
            styles.listItem,
            data[index].isSelected ? styles.selected : styles.unSelected
          )}
          onClick={() => handleClick(index, data, setState)}
          role='button'
          tabIndex={0}
          style={{ cursor: 'pointer' }}
          data-testid={`list-item-${data[index].ppapId}`}
        >
          <div
            className={clsx(
              styles.listItemHeader,
              data[index].isSelected
                ? styles.listItemHeader1
                : styles.listItemHeader
            )}
          >
            <span className={styles.title}>PPAP No : {data[index].ppapId}</span>
            {data[index]?.state && (
              <div
                className={clsx(
                  styles.state,
                  data[index]?.state === PPAP_STATE.TERMINATE &&
                    styles.terminate,
                  data[index]?.state === PPAP_STATE.COMPLETE && styles.complete
                )}
              >
                <span>{data[index]?.state}</span>
              </div>
            )}
          </div>
          <div className={styles.listItemBody}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span className={styles.partNumber}>
                {data[index].partNumber}
              </span>
              <span className={styles.commodity}>{data[index].commodity}</span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              <span className={styles.supplierCode}>
                {data[index].description
                  ? data[index].description
                  : data[index].supplierCode}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'left',
              }}
            >
              <span className={styles.ppapInitiater}>
                <span style={{ fontWeight: 'bold', marginRight: '2px' }}>
                  By:
                </span>
                {data[index]?.ppapCreatedBy?.name ? (
                  <span>{data[index]?.ppapCreatedBy?.name}</span>
                ) : (
                  <span>{data[index]?.createdBy?.name}</span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleToggle = () => {
    searchInput();
    dispatch({
      type: SET_OPEN_MENU,
      payload: true,
    });
  };

  return (
    <>
      <div className={styles.listContainer}>
        <div style={{ padding: '10px' }}>
          <div className={styles.inputWrapper}>
            <RiFilter2Line
              onClick={() => handleToggle()}
              className={styles.filterIcon}
            />
            <div className={styles.verticalLine} />
            <input
              onKeyUp={(e) => searchInput(e.target.value)}
              className={styles.inputBox}
              type='text'
              placeholder='Search by ppap no.'
            />
            <SearchOutlined className={styles.searchIcon} />
          </div>
          <div className={styles.menuOnTop}>
            <Menu />
            <ChildList />
          </div>
        </div>
        <div
          className={styles.filtersList}
          style={filter !== null ? { display: 'flex' } : { display: 'none' }}
        >
          {dataList?.map((chip, index) => (
            <div
              className={styles.filterChip}
              style={chip !== null ? { display: 'flex' } : { display: 'none' }}
            >
              <div>{chip?.value?.replace('_', ' ')}</div>
              <button
                type='button'
                className={styles.chipCloseButton}
                onClick={() => removeChip(index)}
              >
                &#10006;
              </button>
            </div>
          ))}
        </div>
        {!data ||
          (data.length === 0 && (
            <div style={{ textAlign: 'center' }}>No result found</div>
          ))}
        <div
          className={!filter ? styles.listWrapper : styles.listWrapperFilter}
        >
          <InfiniteLoader
            isRowLoaded={isRowLoaded}
            loadMoreRows={loadMoreRows}
            rowCount={data.length + 1}
            threshold={1}
          >
            {({ onRowsRendered, registerChild }) => (
              <AutoSizer>
                {({ width, height }) => (
                  <List
                    width={width}
                    height={height}
                    onRowsRendered={onRowsRendered}
                    ref={registerChild}
                    rowCount={data.length}
                    rowHeight={100}
                    rowRenderer={rowRenderer}
                    className={styles.list}
                  />
                )}
              </AutoSizer>
            )}
          </InfiniteLoader>
        </div>
      </div>
    </>
  );
}

ProcessList.propTypes = {
  data: PropTypes.array,
  pagination: PropTypes.any,
  handleClick: PropTypes.func,
  searchInput: PropTypes.func,
  removeChip: PropTypes.func,
};

export default ProcessList;
