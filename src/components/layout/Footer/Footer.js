import React from 'react';
import styles from './Footer.module.css';

const Footer = () => (
  <div className={styles.footer}>
    <span className={styles.footerText}>
      Copyright 2021 <span className={styles.companyName}>Tata Motors</span>.
      All rights reserved
    </span>
  </div>
);

export default Footer;
