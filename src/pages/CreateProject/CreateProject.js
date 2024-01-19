/* eslint-disable no-unneeded-ternary */
import React from 'react'
import { useHistory, useParams } from 'react-router-dom';
import { CustomTab } from '../../atomicComponents'
import { CreateProjectForm } from '../../components';
import BackButton from '../../components/BackButton/BackButton'
import styles from './CreateProject.module.css'
import { PROJECT_TYPE } from '../../constants';

function CreateProject() {
  const history = useHistory();
  const { id } = useParams();
  
  const redirectToProjectMasterPage = () => {
    history.push('/project-master');
  };
  const isEditable = window.location.href.includes(PROJECT_TYPE.CREATE) ? true : false;

  return (
    <div className={styles.container} style={{ boxSizing: 'border-box' }}>
      <div className={styles.backButtonLastRefreshedDateWrapper}>
        <BackButton
          action="Project List"
          handleClick={redirectToProjectMasterPage}
        />
      </div>
      <div className={styles.tabAndDatePickerWrapper}>
        <div style={{ width: '15%' }}>
          <CustomTab title="Project Creation" withOutCount isSelected />
        </div>
        <div style={{ 
          width: '84%',
          background: '#FFFFFF 0% 0% no-repeat',
          boxShadow: '0px 3px 6px #00000029',
          borderRadius: '4px',
          opacity: 1 
        }} />
      </div>
      <CreateProjectForm isEditable={isEditable} projectId={id} redirectToProjectMasterPage={redirectToProjectMasterPage} />
    </div>
  )
}

export default CreateProject
