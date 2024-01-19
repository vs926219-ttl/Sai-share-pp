import React from 'react';
import PropTypes from 'prop-types';
import { Header, Sidebar } from '../../components';
import styles from './WithHeaderAndSideBar.module.css';

const WithHeaderAndSideBar = ({ pageTitle, children }) => (
  <div style={{ height: '100vh' }}>
    <Header
      style={{ height: '10vh', boxSizing: 'border-box' }}
      title={pageTitle}
    />
    <div
      style={{ height: '90vh', boxSizing: 'border-box' }}
      className={styles.renderArea}
    >
      {children}
    </div>
    <div className={styles.sideBarContainer}>
      <Sidebar />
    </div>
  </div>
);

WithHeaderAndSideBar.propTypes = {
  children: PropTypes.element,
  pageTitle: PropTypes.string,
};

export default WithHeaderAndSideBar;
