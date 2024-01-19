import React from 'react'
import PropTypes from 'prop-types';
import styles from './FormComponents.module.css';

function CustomFormGroup({header, body}) {
  return (
    <div>
      <div className={styles.header}>{header}</div>
      {body}
    </div>
  )
}

CustomFormGroup.propTypes = {
  header: PropTypes.string,
  body: PropTypes.node
}

export default CustomFormGroup
