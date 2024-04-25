import React from 'react';
import PropTypes from 'prop-types';
import styles from './DocumentTable.module.css';

function DocumentTable({ columns, rows, customDocuments, isInputBlock }) {
  const getTextAlignment = alignment => {
    if (alignment === 'center') return 'center';
    if (alignment === 'right') return 'right';
    return 'left';
  };

  return (
    <div id={isInputBlock ?'scrollToBlock' : false} className={styles.content}>
      <table style={{ overflow: 'scroll' }}>
        <thead>
          <tr>
            {columns.map((col) =>
              col.renderHeader ? (
                <th
                  style={{
                    width: col.width ? col.width : null,
                    textAlign: getTextAlignment(col.alignment),
                  }}
                >
                  {col.renderHeader()}
                </th>
              ) : (
                <th
                  style={{
                    width: col.width ? col.width : null,
                    textAlign: getTextAlignment(col.alignment),
                  }}
                >
                  {col.title}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className={styles.documentsContainer}>
          {rows && rows.length ? (
            rows.map((row, index) => (
              <tr key={row.id}>
                {columns.map((col) =>
                  col.render && row ? (
                    <td
                      style={{
                        width: col.width ? col.width : null,
                        textAlign: getTextAlignment(col.alignment),
                      }}
                    >
                      {col.render(row, index)}
                    </td>
                  ) : (
                    <td
                      style={{
                        width: col.width ? col.width : null,
                        textAlign: getTextAlignment(col.alignment),
                      }}
                    >
                      {row[col.field]}
                    </td>
                  )
                )}
              </tr>
            ))
          ) : (
            <tr>
              {columns.map(() => (
                <td />
              ))}
            </tr>
          )}

          {customDocuments && customDocuments.length ? (
            customDocuments.map((row, index) => (
              <tr key={row.id}>
                {columns.map((col) =>
                  col.render && row ? (
                    <td
                      style={{
                        width: col.width ? col.width : null,
                        textAlign: getTextAlignment(col.alignment),
                      }}
                    >
                      {col.render(row, rows ? rows.length + index : index)}
                    </td>
                  ) : (
                    <td
                      style={{
                        width: col.width ? col.width : null,
                        textAlign: getTextAlignment(col.alignment),
                      }}
                    >
                      {row[col.field]}
                    </td>
                  )
                )}
              </tr>
            ))
          ) : (
            <tr>
              {columns.map(() => (
                <td />
              ))}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

DocumentTable.propTypes = {
  columns: PropTypes.array,
  rows: PropTypes.array,
  customDocuments: PropTypes.array,
  isInputBlock: PropTypes.bool
}
export default DocumentTable;
