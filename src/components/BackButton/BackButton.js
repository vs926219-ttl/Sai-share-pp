import React from 'react';
import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
import { Button } from '@tmlconnected/avant-garde-components-library';
import styles from './BackButton.module.css';
import ArrowBackIcon from '../../assets/icons/ArrowBackIcon';

// const getMaterialGroupDescription = (
//   requiredMaterialGroup,
//   allMaterialGroups,
// ) =>
//   allMaterialGroups.filter(
//     ({ materialGroup }) => materialGroup === requiredMaterialGroup,
//   )[0]?.description;

const BackButton = ({
  action,
  handleClick,
  // userMaterialGroups,
  // basePath
}) => (
  <Button className={styles.backButton} onClick={handleClick}>
    <ArrowBackIcon className={styles.arrowBackIcon} />
    {/* <span className={styles.materialGroup}>
      {materialGroup && getMaterialGroupDescription(materialGroup, userMaterialGroups)}
    </span>
    { !materialGroup && basePath && (
        <span className={styles.materialGroup}>{basePath}</span>
      )
    }
    {(getMaterialGroupDescription(materialGroup, userMaterialGroups) ||  basePath) && (
      <span className={styles.action}>/</span>
    )} */}
    <span className={styles.action} data-testid={action}>
      {action}
    </span>
  </Button>
);

BackButton.propTypes = {
  // materialGroup: PropTypes.string,
  action: PropTypes.string,
  handleClick: PropTypes.func,
  // userMaterialGroups: PropTypes.arrayOf(
  //   PropTypes.shape({
  //     materialGroup: PropTypes.string.isRequired,
  //     description: PropTypes.string.isRequired,
  //   }),
  // ),
  // basePath: PropTypes.string
};

export { BackButton as BaseBackButton };
// eslint-disable-next-line import/prefer-default-export
export default BackButton;