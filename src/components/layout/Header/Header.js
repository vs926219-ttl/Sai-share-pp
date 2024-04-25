import React, { useRef, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { BsFillCaretDownFill } from 'react-icons/bs';
import logo from '../../../assets/images/tata_motors_logo.png';
import Esakha from '../../../assets/images/esakha.svg';
import styles from './Header.module.css';
import config from '../../../config/config';
import { ENV_TYPES } from '../../../constants';
import UserProfile from '../../UserProfile/UserProfile';
import { IconButton } from '../../../atomicComponents';

const Header = props => {
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);

  const renderTestWaterMark = () => (
    <span className={styles.testTitle}>
      <strong>TEST ENVIRONMENT</strong>
      Changes made here will not impact/influence actual Production
    </span>
  );

  return (
    <div className={styles.header} {...props}>
      <div className={styles.leftContainer}>
        <img className={styles.logo} src={logo} alt="Tata Motors" />
      </div>
      <div>{config.ENV_TYPE === ENV_TYPES.TEST && renderTestWaterMark()}</div>
      <div className={styles.rightContainer}>
        <div className={styles.topIcons}>
          <FaUserCircle />
          <IconButton
            className={styles.iconButton}
            ref={profileRef}
            onClick={() => setShowProfile(true)}
          >
            <BsFillCaretDownFill style={{ marginRight: 0 }} />
          </IconButton>
        </div>
        <div className={styles.esakhaContainer}>
          <a href={config.HOME_UI_BASE_URL} className={styles.homeLink}>
            <span>
              <img src={Esakha} className={styles.esakhaLogo} alt="IMPS 4.0" />
            </span>
          </a>
        </div>
      </div>
      <UserProfile
        open={showProfile}
        anchorEl={profileRef.current}
        handleClose={() => setShowProfile(false)}
      />
    </div>
  );
};

Header.propTypes = {};

export default Header;
