import React from 'react';
import { Header, Footer } from '@tmlconnected/avant-garde-components-library';
import PropTypes from 'prop-types';
import styles from './HeaderAndFooter.module.css';
import logo from '../../assets/images/tata_motors_logo.png';
import Esakha from '../../assets/images/esakha.svg';
import config from '../../config/config';
import { ENV_TYPES } from '../../constants';
import { useAuthorizationContext } from '../../providers/AuthorizationHandler/AuthorizationHandler';

const HeaderAndFooter = ({ children }) => {
  const { user, logoutUser } = useAuthorizationContext();

  return (
    <div className={styles.body}>
      <Header
        images={{ logo, Esakha }}
        config={config}
        envType={ENV_TYPES}
        other={{ alt: 'Tata Motors' }}
        logoutUser={logoutUser}
        user={user}
      />
      <div className={styles.renderArea}>{children}</div>
      <Footer />
    </div>
  );
};

HeaderAndFooter.propTypes = {
  children: PropTypes.any,
};

export default HeaderAndFooter;
