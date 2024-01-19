import React from 'react';
import PropTypes from 'prop-types';
import MetroIcon from '../../assets/icons/metro-tools.svg';
import styles from './ToolsListView.module.css';
import { RESOURCE_TYPE, TOOLS } from '../../constants';
import { withAllowedOperationsProvider } from '../../hocs';
import { AuthChecker } from '../../atomicComponents';

const IconMapping = {
  [TOOLS.MASTER_DATA_MANAGEMENT]: MetroIcon,
};

const ToolsListView = ({ listItems = [], handleSelection }) => (
  <div className={styles.toolListView}>
    <div className={styles.toolListTitleContainer}>
      <img src={MetroIcon} alt="icon" />
      <span className={styles.toolListTitle}>Tools</span>
    </div>
    {listItems.map(item => (
      <AuthChecker key={item.label} operation={item.authOperation}>
        {isAuthorized => (
          isAuthorized &&
            <button
              type="button"
              onClick={() => (item.action ? item.action() : handleSelection(item))}
              className={styles.toolListItem}
              data-testid={item.testId}
            >
              <span>{item.label}</span>
              {IconMapping[item.label] && (
                <img src={IconMapping[item.label]} alt="icon" />
              )}
            </button>
        )}
      </AuthChecker>
    ))}
  </div>
);

ToolsListView.propTypes = {
  listItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      action: PropTypes.func,
    }),
  ),
  handleSelection: PropTypes.func.isRequired,
};

export default withAllowedOperationsProvider(
  ToolsListView,
  RESOURCE_TYPE.PROJECT,
  RESOURCE_TYPE.PPAP_STAGE_DOCUMENT
);
