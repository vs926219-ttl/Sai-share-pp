import React from 'react';
import PropTypes from 'prop-types';
import styles from './BasicTable.module.css';

const BasicTable = ({
  columns,
  data,
  minNoOfRows = 10,
  minTableHeight = '35px',
}) => {
  const noOfPaddedRowsRequired = Math.max(minNoOfRows - data.length, 0);
  const paddedData = [
    ...data,
    ...[...Array(noOfPaddedRowsRequired).keys()].map(() => ({
      isPaddingRow: true,
    })),
  ];

  const renderColumn = (row, column) => {
    if (row.isPaddingRow) return <span />;
    return column.render ? column.render(row) : row[column.field];
  };

  return (
    <table className={styles.table} border="0" cellPadding="0" cellSpacing="0">
      <thead>
        <tr style={{ position: 'sticky', top: 0 }}>
          {columns.map(column => (
            <th
              style={{
                textAlign: 'left',
                ...column.style,
                ...column.headerStyle,
                width: column.width,
              }}
              key={column.title}
            >
              {column.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {paddedData.map(row => (
          <tr
            key={row.id}
            style={{ minHeight: minTableHeight, height: minTableHeight }}
          >
            {columns.map(column => (
              <td
                style={{
                  textAlign: 'left',
                  ...column.style,
                  ...column.cellStyle,
                  width: column.width,
                }}
              >
                {renderColumn(row, column)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

BasicTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      field: PropTypes.string.isRequired,
    }),
  ),
  data: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.any.isRequired })),
  minNoOfRows: PropTypes.number,
  minTableHeight: PropTypes.string,
};

export default BasicTable;
