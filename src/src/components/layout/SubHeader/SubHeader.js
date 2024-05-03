import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '../../../atomicComponents';
import { HomeIcon } from '../../../assets/icons';
import styles from './SubHeader.module.css';
// import PlantSelectorDropdown from '../PlantSelectorDropdown/PlantSelectorDropdown';
import config from '../../../config/config';

function SubHeader({ title }) {
  return (
    <div className={styles.subHeader}>
      <span className={styles.spanClass}>
        <a href={config.HOME_UI_BASE_URL}>
          <IconButton className={styles.homeIconButton}>
            <HomeIcon className={styles.homeIcon} />
          </IconButton>
        </a>
        <span className={styles.title}> {title}</span>
      </span>
      {/* <span className={styles.plantDropdown}>
        <PlantSelectorDropdown />
      </span> */}
    </div>
  );
}

SubHeader.propTypes = {
  title: PropTypes.string.isRequired,
};

export default SubHeader;
