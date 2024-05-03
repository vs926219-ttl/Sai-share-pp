import React, { useState,useEffect,useRef } from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import styles from './ProjectMaster.module.css';
import BackButton from '../../components/BackButton/BackButton';
import Table from '../../components/Table/Table';
import useAjaxCallbackWithIntervals from '../../hooks/useAjaxCallbackWithIntervals';
import { API } from '../../apis/api';
import { buildErrorMessage } from '../../apis/calls';
import { usePopupManager } from '../../providers/PopupManager/PopupManager';
import { CustomTab } from '../../atomicComponents';
import { API_RESOURCE_URLS, RESOURCE_TYPE, USER_OPERATIONS } from '../../constants';
import { withAllowedOperationsProvider } from '../../hocs';

function ProjectMaster() {
  const { showInternalError } = usePopupManager();
  const history = useHistory();

  const ROW_HEIGHT = 38;
  // eslint-disable-next-line no-unused-vars
  const [projectCount, setProjectCount] = useState(0);

  const [rowsData, setRowsData] = useState({
    loading: false,
    data: [],
    filteredData: [],
  });

  const baseDefaultColumns = [
    {
      width: 140,
      title: 'Project Code',
      field: 'code',
      enableSearch: true,
      enableFilter: true,
    },
    {
      width: 150,
      title: 'Project Name',
      field: 'name',
      enableSearch: true,
      enableFilter: true,
    },
    {
      width: 150,
      title: 'Business Unit',
      field: 'businessUnit',
      enableSearch: true,
      enableFilter: true,
    },
    {
      width: 150,
      title: 'Plant',
      field: 'allPlants',
      enableSearch: true,
      enableFilter: true,
      filterFn: (row, value) => 
        row.plants
        .map(({name}) => name)
        .some(i => i.includes(value)),
      // eslint-disable-next-line no-unused-vars
      render: (row, index, prop) => 
        <div
          className={styles.ellipsisText}
          onMouseEnter={e => prop.openEllipsisPopupForEventWithText(e, row.plants.map(plant => plant.name).toString())}
          onMouseLeave={() => prop.closeEllipsisPopup()}
          style={{ textAlign: 'left' }}
        >
          {row.plants.map(plant => plant.name).toString()}
        </div>
    },
    {
      width: 150,
      title: 'Vehicle Line',
      field: 'allVehicleLines',
      enableSearch: true,
      enableFilter: true,
      filterFn: (row, value) => 
        row.vehicleLines
        .some(i => i.includes(value)),
      // eslint-disable-next-line no-unused-vars
      render: (row, index, prop) => 
        <div
          className={styles.ellipsisText}
          onMouseEnter={e => prop.openEllipsisPopupForEventWithText(e, row.vehicleLines.toString())}
          onMouseLeave={() => prop.closeEllipsisPopup()}
          style={{ textAlign: 'left' }}
        >
          {row.vehicleLines.toString()}
        </div>
    },
    {
      width: 180,
      title: 'Project Created By',
      field: 'createdBy',
      enableSearch: true,
      enableFilter: true,
    },
    {
      width: 180,
      title: 'Project Creation Date',
      field: 'projectCreationDate',
      enableSearch: true,
      enableFilter: true,
    },
    {
      width: 180,
      title: 'Status',
      field: 'editStatus',
      enableSearch: true,
      enableFilter: true,
    }
  ]

  const redirectToApplicationLandingPage = () => {
    history.push('/');
  };

  const redirectToCreateProjectPage = () => history.push('/create-project');
  const redirectToProjectEditPage = (id) => history.push(`/create-project/${id}`);
  const redirectToProjectDetailsPage = (id) => history.push(`/project-details/${id}`);

  const setCount = count => { 
    setProjectCount(count);
  };

  const processProjectList = projectList => {
    let processedProjectList = projectList.map(({...project}) => {
      const allPlants = project.plants.map(plant => plant.name);
      const allVehicleLines = project.vehicleLines;
      const projectCreationDate = moment(project.createdAt).format("DD/MM/YYYY");
      const createdBy = project?.createdBy?.name;
      return {
        id: project.id,
        ...project,
        allPlants,
        allVehicleLines,
        projectCreationDate,
        createdBy
      }
    });
    const allPlantsList = [];
    const allVehicleLineList = [];
    processedProjectList.forEach(({ allPlants, vehicleLines}) => {
      allPlantsList.push(...allPlants);
      allVehicleLineList.push(...vehicleLines);
    });

    processedProjectList = processedProjectList.map(({...project}) => (
      {
        ...project,
        allPlants: [...new Set(allPlantsList)],
        allVehicleLines: [...new Set(allVehicleLineList)],
      }
    ));
    return processedProjectList;
  }

  const loadAllProjects = async () => {
    try {
      setRowsData(prev => ({
        ...prev,
        loading: true,
      }));

      const response = await API.get(
        API_RESOURCE_URLS.PROJECTS
      );

      const { data: projectList } = response;
      
      const processedProjectList = processProjectList(projectList);
      
      setRowsData({
        data: processedProjectList,
        filteredData: processedProjectList,
        loading: false,
      });
    } catch (error) {
      showInternalError(error);
      console.error(buildErrorMessage(error));
      setRowsData({
        data: [],
        filteredData: [],
        loading: false,
      });
    }
  };
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    sessionStorage.setItem("disableCheckbox","Y");
    return () => {
        mounted.current = false;
    sessionStorage.removeItem("disableCheckbox");
    };
}, []);
  useAjaxCallbackWithIntervals(
    rowsData.loading,
    loadAllProjects,
    []
  );

  return (
    <>
      <div className={styles.container} style={{ boxSizing: 'border-box' }}>
        <div className={styles.backButtonLastRefreshedDateWrapper}>
          <BackButton
            action="Process"
            handleClick={redirectToApplicationLandingPage}
          />
        </div>
        <div className={styles.tabAndDatePickerWrapper}>
          <div style={{ width: '15%' }}>
            <CustomTab isSelected count={projectCount} title="Project List" />
          </div>
          <div style={{ 
            width: '84%',
            background: '#FFFFFF 0% 0% no-repeat',
            boxShadow: '0px 3px 6px #00000029',
            borderRadius: '4px',
            opacity: 1 
          }} />
        </div>
        <div
          className={styles.tableView}
          style={{ flex: 0.97 }}
        >
          <Table
            columns={[...baseDefaultColumns]}
            defaultColumns={[...baseDefaultColumns]}
            rowHeight={ROW_HEIGHT}
            rows={rowsData.data}
            primaryAction={{
              name: 'Create Project',
              authOperation: USER_OPERATIONS.CREATE_PROJECT,
              shouldEnable: () => true,
              actionFn: redirectToCreateProjectPage,
            }}
            secondaryActions={[
							{ 
								name: 'Edit',
								authOperation: USER_OPERATIONS.CREATE_PROJECT,
								shouldEnable: selected => (selected.length === 1 && selected[0].editStatus !=='COMPLETE'),
								actionFn: selected => redirectToProjectEditPage(selected[0].id) ,
							}
						]}
            setAsnCount={setCount}
            isDataLoading={rowsData.loading}
            actionButtons
            onRowSelect={(e)=> redirectToProjectDetailsPage(e.id)}
          />
        </div>
      </div>
    </>
  );
 
}

export default withAllowedOperationsProvider(
  ProjectMaster,
  RESOURCE_TYPE.PROJECT
);
