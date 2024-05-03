import React, { forwardRef } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { columnsPropType } from '../../types';
import styles from './TableHead.module.css';
import HeaderWithMenu from '../HeaderWithMenu/HeaderWithMenu';

const TableHead = forwardRef(
  (
    {
      columns,
      className,
      height,
      reorderHeaders,
      rows,
      allRows,
      fieldToSearchTextMap,
      setSearchTextForTitleCurry,
      noOfFixedColumns,
      fieldToFiltersSetMap,
      setFiltersForFieldCurry,
    },
    ref,
  ) => {
    const renderHeader = col => {
      if (col.renderHeader) return col.renderHeader(rows);
      if (col.enableSearch || col.enableFilter)
        return (
          <HeaderWithMenu
            column={col}
            searchText={fieldToSearchTextMap[col.field]}
            handleSearchTextChange={setSearchTextForTitleCurry(col.field)}
            selectedFilterOptions={fieldToFiltersSetMap[col.field]}
            applyFilters={setFiltersForFieldCurry(col.field)}
            rows={allRows}
            field={col.field}
          />
        );
      return (
        <span style={{ paddingBottom: 2, display: 'inline-block' }}>
          {col.title}
        </span>
      );
    };
    return (
      <DragDropContext onDragEnd={reorderHeaders}>
        <Droppable droppableId="droppable" direction="horizontal">
          {provided => (
            <div
              className={clsx(styles.tableHeader, styles.scrollBar, className)}
              ref={refVal => {
                provided.innerRef(refVal);
                // eslint-disable-next-line no-param-reassign
                if (ref != null) ref.current = refVal;
              }}
              {...provided.droppableProps}
              style={{
                height,
                ...provided.droppableProps.style,
              }}
            >
              {columns.map((col, index) => (
                <Draggable
                  key={col.field}
                  draggableId={col.field}
                  index={index}
                  isDragDisabled={index < noOfFixedColumns}
                >
                  {(given, snapshot) => (
                    <div
                      ref={given.innerRef}
                      {...given.draggableProps}
                      {...given.dragHandleProps}
                      style={{
                        textAlign: col.alignment || 'left',
                        ...col.style,
                        ...col.headerStyles,
                        ...given.draggableProps.style,
                        display: 'inline-block',
                        width: col.width,
                        backgroundColor: snapshot.isDragging
                          ? '#eff7ff'
                          : '#fff',
                      }}
                    >
                      {renderHeader(col)}
                    </div>
                  )}
                </Draggable>
              ))}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  },
);

TableHead.propTypes = {
  columns: columnsPropType,
  className: PropTypes.string,
  height: PropTypes.number,
  reorderHeaders: PropTypes.func.isRequired,
  rows: PropTypes.array,
  allRows: PropTypes.array,
  fieldToSearchTextMap: PropTypes.object.isRequired,
  setSearchTextForTitleCurry: PropTypes.func.isRequired,
  noOfFixedColumns: PropTypes.number,
  fieldToFiltersSetMap: PropTypes.object.isRequired,
  setFiltersForFieldCurry: PropTypes.func.isRequired,
};

export default TableHead;
