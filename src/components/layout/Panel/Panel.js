import React from 'react'
import PropTypes from 'prop-types';

function Panel({ value, index, children }) {
  if (index !== value) return null;
  return <>{children}</>
}

Panel.propTypes = {
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired
}

export default Panel
