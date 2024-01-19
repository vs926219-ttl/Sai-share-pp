/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { columnsPropType } from '../../types';
import styles from './TableRow.module.css';

const TableRow = ({
  classNames,
  columns,
  index,
  row,
  style,
  snapshot,
  handlePopoverOpen,
  handlePopoverClose,
  onCopy,
  rowClick
}) => {
 
  const getFlexAlignment = alignment => {
    if (alignment === 'center') return 'center';
    if (alignment === 'right') return 'flex-end';
    return 'flex-start';
  };
  return (
    <div
      className={clsx(
        styles.tableRow,
        row.isSelected && styles.defaultSelectedRow,
        classNames.tableRowClassName instanceof Function
          ? classNames.tableRowClassName(row, snapshot?.isDragging)
          : classNames.tableRowClassName,
      )}
      style={{
        ...style,
      }}
    >
      {columns.map(col => {
        const renderColumnCell = () =>
          col.render && row ? (
            col.render(row, index + 1, {
              openEllipsisPopupForEventWithText: handlePopoverOpen,
              closeEllipsisPopup: handlePopoverClose,
              onCopy,
            })
          ) : (
            <div
              onDoubleClick={() => onCopy(row[col.field])}
              className={styles.ellipsisText}
              onMouseEnter={e => handlePopoverOpen(e, row[col.field])}
              onMouseLeave={() => handlePopoverClose()}
              style={{ textAlign: col.alignment || 'left' }}
              onClick={() => rowClick(row)}
            >
              {row[col.field]}
            </div>
          );

        return (
          <div
            className={clsx(styles.tableCell, classNames.tableCellClassName)}
            style={{
              height: '100%',
              ...col.style,
              ...col.cellStyles,
              display: 'inline-flex',
              alignItems: 'center',
              width: col.width,
              justifyContent: getFlexAlignment(col.alignment),
            }}
            key={`${row.asn}-${col.field}`}
          >
            {renderColumnCell()}
          </div>
        );
      })}
    </div>
  );
};

TableRow.propTypes = {
  classNames: PropTypes.shape({
    tableContainerClassName: PropTypes.string,
    tableClassName: PropTypes.string,
    tableRowClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    tableHeadClassName: PropTypes.string,
    tableCellClassName: PropTypes.string,
  }),
  columns: columnsPropType,
  index: PropTypes.number,
  row: PropTypes.shape({
    asn: PropTypes.string.isRequired,
    isSelected: PropTypes.bool,
  }).isRequired,
  style: PropTypes.object,
  snapshot: PropTypes.object,
  handlePopoverOpen: PropTypes.func.isRequired,
  handlePopoverClose: PropTypes.func.isRequired,
  onCopy: PropTypes.func.isRequired,
  rowClick: PropTypes.func
};

export default TableRow;
