import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import styles from './ToolbarContainer.module.css'

function ToolbarContainer({ children, classNames }) {
  return (
    <div className={clsx(styles.toolbarContainer, ...classNames)}>
      {children}
    </div>
  )
}

ToolbarContainer.propTypes = {
  children: PropTypes.node,
  classNames: PropTypes.any
}

export default ToolbarContainer
