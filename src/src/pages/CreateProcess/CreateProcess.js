import React from 'react';
import { useHistory } from 'react-router-dom';
import BackButton from '../../components/BackButton/BackButton';
import styles from './CreateProcess.module.css';
import { CreateProcessForm } from '../../components';
import { CustomTab } from '../../atomicComponents';

function CreateProcess() {
  const history = useHistory();
  const redirectToProcessPage = () => {
    history.push('/process');
  };

  return (
    <>
      <div className={styles.container} style={{ boxSizing: 'border-box' }}>
        <div className={styles.backButtonLastRefreshedDateWrapper}>
          <BackButton
            action="Process"
            handleClick={redirectToProcessPage}
          />
        </div>
        <div className={styles.processHeader}>
          <div style={{ width: '15%' }}>
            <CustomTab title="Add New Process" withOutCount isSelected />
          </div>
          <div className={styles.processTopbar}>
            Process 
            <select disabled className={styles.selectBox}>
              <option>PPAP</option>
            </select>
          </div>
        </div>
        <CreateProcessForm redirectToProcessPage={redirectToProcessPage}/>
      </div>
    </>
  )
}

export default CreateProcess
