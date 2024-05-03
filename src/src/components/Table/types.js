import PropTypes from 'prop-types';

export const columnProptype = PropTypes.shape({
  title: PropTypes.string.isRequired,
  field: PropTypes.string.isRequired,
  render: PropTypes.func,
  renderHeader: PropTypes.func,
  width: PropTypes.number.isRequired,
  enableSearch: PropTypes.bool,
  enableFilter: PropTypes.bool,
  searchFn: PropTypes.func,
  filterFn: PropTypes.func,
  headerStyles: PropTypes.object,
  cellStyles: PropTypes.object,
  style: PropTypes.object,
  alignment: PropTypes.oneOf(['center', 'left', 'right']),
  customFilterOptions: PropTypes.oneOf([
    PropTypes.func,
    PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string.isRequired,
        node: PropTypes.node,
        labelStyles: PropTypes.object,
      }),
    ),
  ]),
});

export const columnsPropType = PropTypes.arrayOf(columnProptype).isRequired;
