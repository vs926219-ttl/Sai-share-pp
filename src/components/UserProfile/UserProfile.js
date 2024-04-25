import React from 'react';
import PropTypes from 'prop-types';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
import { Button } from '@tmlconnected/avant-garde-components-library';
import styles from './UserProfile.module.css';
import { PopoverPaper } from '../../atomicComponents';
import { useAuthorizationContext } from '../../providers/AuthorizationHandler/AuthorizationHandler';

const UserProfile = ({ open, handleClose, anchorEl }) => {
  const { user, logoutUser } = useAuthorizationContext();
  return (
    <PopoverPaper
      open={open}
      handleClose={handleClose}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
    >
      <div className={styles.display}>
        <div className={styles.iconContainer}>
          <PersonOutlineOutlinedIcon className={styles.personIcon} />
        </div>
        <div className={styles.details}>
          <span className={styles.name}>{user?.name}</span>
          <span className={styles.email}>{user?.email}</span>
          <Button
            ignoreExistingClassNames
            className={styles.logoutButton}
            startIcon={<PowerSettingsNewIcon />}
            onClick={logoutUser}
          >
            Logout
          </Button>
        </div>
      </div>
    </PopoverPaper>
  )
};

UserProfile.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  anchorEl: PropTypes.instanceOf(Element),
};

export default UserProfile;