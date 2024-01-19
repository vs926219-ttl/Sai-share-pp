import clsx from 'clsx';
import React, { useState, useRef } from 'react';
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
import { FiAlertCircle } from 'react-icons/fi';
import styles from './SideBar.module.css';
import { AlertIcon, BellIcon } from '../../../assets/icons';
import { IconButton } from '../../../atomicComponents';
import UserProfile from '../../UserProfile/UserProfile';

const SideBar = () => {
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);
  const toggleProfile = () => setShowProfile(prevState => !prevState);

  const hasNewNotifications = false;
  const isNotificationSideBarOpen = false;

  return (
    <div className={styles.root}>
      <div className={styles.line} />
      <IconButton
        description="Profile"
        ref={profileRef}
        onClick={toggleProfile}
      >
        <PersonOutlineOutlinedIcon
          className={clsx(styles.icon, showProfile && styles.isOpen)}
        />
      </IconButton>
      <IconButton disabled description="Alert">
        <AlertIcon className={clsx(styles.icon)} />
      </IconButton>
      <IconButton description="Update" onClick={() => {}}>
        <BellIcon
          style={{ fontSize: '2.3em' }}
          className={clsx(
            isNotificationSideBarOpen && styles.isOpen,
            styles.icon,
          )}
        />
        {hasNewNotifications && (
          <FiAlertCircle className={styles.notificationAlertIcon} />
        )}
      </IconButton>
      <UserProfile
        open={showProfile}
        anchorEl={profileRef.current}
        handleClose={() => setShowProfile(false)}
      />
    </div>
  );
};

export default SideBar;
