/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-unneeded-ternary */
import React, { useEffect, useReducer, useState } from 'react'
import axios from 'axios';
import PropTypes from 'prop-types';
import clsx from 'clsx'
import moment from 'moment'
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@material-ui/core";
import { MdReplay } from 'react-icons/md';
import { Button } from '@tmlconnected/avant-garde-components-library';
import styles from './CreateProjectForm.module.css'
import { CustomDatePicker, CustomFormGroup, CustomSelect, ValidatingTextField } from '../FormComponents'
import { API } from '../../apis/api'
import { buildErrorMessage, log } from '../../apis/calls'
import { API_RESOURCE_URLS, DATE_FORMAT, DISPLAY_MESSAGES, MESSAGE_TYPE, RESOURCE_TYPE, USER_OPERATIONS, EDIT_STATUS } from '../../constants'
import { AuthChecker } from '../../atomicComponents'
import { withAllowedOperationsProvider } from '../../hocs'
import { usePopupManager } from '../../providers/PopupManager/PopupManager';


const initialState = {
  projectCode: '',
  projectName: '',
  // businessUnit: null,
  plants: null,
  vehicleLines: null,
  projectMilestones: [],
  vehicleProjections: [...Array(5).keys()].map((index) => ({
    sn: `Year ${index + 1}`,
    count: 0,
    year: null
  })),
  remark: ''
}

let updatedState = {}

const reducer = (state, action) => {
  switch (action.type) {
    case 'update':
      return {
        ...state,
        [action.field]: action.value
      }
    case 'reset':
      return {
        ...state,
        ...initialState
      }
    case 'patch':
      return {
        ...state,
        ...initialState,
        ...updatedState
      }  
    default:
      return state
  }
}

function CreateProjectForm({ redirectToProjectMasterPage, projectId, isEditable }) {


  const [partDetail, setPartDetail] = useState([]);
  const [selectedPartNo, setSelectedPartNo] = useState('');
  const [plants, setPlants] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [sorNosValue, setSorNosValue] = useState([]);
  const [selectedPlants, setSelectedPlants] = useState([]);
  const [byProjectName, setByProjectName] = useState('');
  const [byProjectCode, setByProjectCode] = useState('');
  const [byVehicleLine, setByVehicleLine] = useState('');
  const [sorNumbers, setSorNumbers] = useState([]);
  const [showSorNumber, setShowSorNumber] = useState(false); 

  const [businessUnit, setBusinessUnit] = useState('');

  const { showPopup } = usePopupManager();

  const [state, dispatch] = useReducer(reducer, initialState)
  const { projectCode,
    projectName,
    // businessUnit,
    // plants,
    vehicleLines,
    projectMilestones,
    vehicleProjections,
    remark } = state;

  const [availableBusinessUnits, setAvailableBusinessUnits] = useState({ loading: false, data: [] });
  const [availablePlants, setAvailablePlants] = useState({ loading: false, data: [] });
  const [availableVehicleLines, setAvailableVehicleLines] = useState({ loading: false, data: [] });
  const [availableProjectMilestones, setAvailableProjectMilestones] = useState({ loading: false, data: [] });

  const [highlightMandatoryFields, setHighlightMandatoryFields] = useState(
    false
  );
    const [saveAsDraftHighlightMandatoryFields, setSaveAsDraftHighlightMandatoryFields] = useState(
    false
  );
  const [resetAllVisitedFields, setResetAllVisitedFields] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedRowStatus, setSelectedRowStatus] = useState(null);


  const BG_COLOR = '#fffef8';
  const [backgroundColors, setBackgroundColors] = useState({
    projectInfoBg: true,
    projectMilestoneBg: false,
    vehicleProjectionBg: false,
    remarkBg: false
  });
  const { projectInfoBg,
    projectMilestoneBg,
    vehicleProjectionBg,
    remarkBg } = backgroundColors;

  const changeBackgroundColor = (field) =>
    setBackgroundColors(prev => {
      const newBackgroundColors = {};
      // eslint-disable-next-line no-restricted-syntax
      for (const [key] of Object.entries(prev)) {
        if (key === field)
          newBackgroundColors[key] = true;
        else
          newBackgroundColors[key] = false;
      }
      return newBackgroundColors
    })

  const handleClose = () => setIsPopupOpen(false);

  const handleOpen = () => setIsPopupOpen(true);

  // const resetFields = () => setResetAllVisitedFields(true);

  const loadData = async (setState, url, params) => {
    try {
      const response = await API.get(url, {
        params,
      });
      setState({ loading: false, data: response.data });
    } catch (error) {
      console.error(buildErrorMessage(error));
    }
  };


  const loadBusinessUnits = async () =>
    loadData(setAvailableBusinessUnits, API_RESOURCE_URLS.getAllBusinessUnits());

  async function getPartNumber() {
    const res = await API.get(API_RESOURCE_URLS.getAllBusinessUnits());
    return res.data;
  }
 
    async function fetchPartDetail() { 
      try {
        const data = await getPartNumber();
        setPartDetail(data);
      } catch (error) {
        console.error('Error fetching part details:', error);
      }
    }
    useEffect(()=>{
      fetchPartDetail();

    })
async function getPlantsDetailByPart(partNo) {
  try {
      const res = await API.get(`http://localhost:3000/ppap/projects/getPlants/${partNo}`);
      return res.data; // Return plant data
  } catch (error) {
      console.error("Error:", error);
      return []; // Return empty array in case of error
  }
}
useEffect(() => {
  async function fetchPlants() {
      try {
          if (selectedPartNo) {
              const plantsData = await getPlantsDetailByPart(selectedPartNo);
              const locations = plantsData.map(plant => plant.location);
              console.log("Locations:", locations);
              if (locations.length > 0) {
                setSelectedLocation(locations[0]);
              }
              setPlants(plantsData); // Set plants data
          }
      } catch (error) {
          console.error('Error fetching plants:', error);
      }
  }

  fetchPlants();
}, [selectedPartNo]);


  useEffect(() => {
    async function fetchPlants() {
      try {
        if (selectedPartNo) {
          const plantsData = await getPlantsDetailByPart(selectedPartNo);
          setPlants(plantsData);
        }
      } catch (error) {
        console.error('Error fetching plants:', error);
      }
    }

    fetchPlants();
  }, [selectedPartNo]);

  async function getSorNumberByPartAndLocation(partNo, location) {
   
    try {
      const res = await API.get(`http://localhost:3000/ppap/projects/getSorNo/${partNo}/${location}`);
      return res.data;
      
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  }
  useEffect(() => {
    async function fetchSorNumber() {
      try {
        if (selectedPartNo && selectedLocation) {
          const sorNumbersData = await getSorNumberByPartAndLocation(selectedPartNo, selectedLocation);
          // console.log("new Comment", sorNumbersData);
          setSorNumbers(sorNumbersData);
          const sorNos = sorNumbersData.map(sor => sor.sorNo);
          setSorNosValue(sorNos); 
          const ProjectNameData = sorNumbersData.map(name => name.projectName);
          const ProjectCodeData = sorNumbersData.map(name => name.projectCode);
          const vehicleLineData = sorNumbersData.map(name => name.productLine);
          console.log("Sor Numbers1:", vehicleLineData); // Log SOR numbers to console
          if (ProjectNameData.length > 0) {
            setByProjectName(ProjectNameData[0]);
          }
          if (ProjectCodeData.length > 0) {
            setByProjectCode(ProjectCodeData[0]);
          }
          if (vehicleLineData.length > 0) {
            setByVehicleLine(vehicleLineData[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching SOR numbers:', error);
      }
    }
  
    fetchSorNumber();
  }, [selectedPartNo, selectedLocation]);

  // Function to extract values for each location
  const extractValuesByLocation = (location) => {
    const values = {
      year1: sorNumbers.map((item) => item[`${location}Year1`] || 0),
      year2: sorNumbers.map((item) => item[`${location}Year2`] || 0),
      year3: sorNumbers.map((item) => item[`${location}Year3`] || 0),
      year4: sorNumbers.map((item) => item[`${location}Year4`] || 0),
      year5: sorNumbers.map((item) => item[`${location}Year5`] || 0),
    };
     // If location is not the current one, set all other years to 0
  if (location !== 'pun') {
    ['year1', 'year2', 'year3', 'year4', 'year5'].forEach((year) => {
      if (!values[year]) {
        values[year] = Array(sorNumbers.length).fill(0);
      }
    });
  }
    return values;
  };


  const resetFields = () => {
    // Reset all state variables holding selected values to their initial states
    setSelectedPartNo('');
    setSelectedLocation('');
    // setSorNosValue([]);
    setSelectedPlants([]);
    setByProjectName('');
    setByProjectCode('');
    setByVehicleLine('');
    setSorNumbers([]);
    // resetProjectMilestones();
    // Reset any other relevant state variables
  };


  const loadPlants = async (businessUnitName) =>
    loadData(
      setAvailablePlants,
      API_RESOURCE_URLS.getAllPlantsForBusinessUnit(),
      { businessUnitName });

  const loadVehicleLines = async () =>
    loadData(setAvailableVehicleLines, API_RESOURCE_URLS.getAllVehicleLines());

  const loadProjectMilestone = async () => {
    loadData(setAvailableProjectMilestones, API_RESOURCE_URLS.getAllProjectMilestones());
  }

  const formatOptionsForSelect = (...options) =>
    options.map((option) => ({ value: option, label: option }));

  const formatOptionsForPlantsSelect = (...options) =>
    options.map(({ value, label }) => ({ value, label }));

  // const getBusinessUnitOptions = () =>
  //   formatOptionsForSelect(...availableBusinessUnits.data.map(({ name }) => name));

  const getBusinessUnitOptions = () =>
  formatOptionsForSelect(...availableBusinessUnits.data);

  const getPlantsOptions = () =>
    formatOptionsForPlantsSelect(...availablePlants.data.map(({ name, code }) => ({
      value: code,
      label: `${name} - ${code}`
    })));
  const getMinimumDateForPicker = (index, arr) => {
    if (index === 0) {
      return moment(0).format(DATE_FORMAT.ISO)
    }
    if (!arr[index - 1].timeline) {
      return moment().format(DATE_FORMAT.ISO)
    }
    return moment(arr[index - 1].timeline).add(1, 'day').format(DATE_FORMAT.ISO)
  }

  const getFiveYears = (currentDate) => {
    const years = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 100; i++) {
      const copyDate = moment(currentDate);
      years.push({ year: copyDate.add(i, 'years').format('YYYY') })
    }
    return years;
  };

  const getYearOptions = (index, arr) => {
    let currentDate;
    if (index === 0) {
      currentDate = moment(1970);
      currentDate = currentDate.add(0, 'years');
      return formatOptionsForSelect(...getFiveYears(currentDate).map(({ year }) => year))
    }
    if (arr[index - 1].year?.value) {
      currentDate = moment(arr[index - 1].year?.value);
      currentDate = currentDate.add(1, 'years');
      return formatOptionsForSelect(...getFiveYears(currentDate).map(({ year }) => year));
    }
    return [];
  }

  const getVehicleLinesOptions = () =>
    formatOptionsForSelect(...availableVehicleLines.data.map(({ name }) => name));

  const updateProjectMilestoneTimeLine = (date, index) =>
    dispatch({
      type: 'update',
      field: 'projectMilestones',
      value: projectMilestones.map((item, i) => {
        if (i === index)
          return { ...item, timeline: date.format(DATE_FORMAT.ISO) }
        if (i > index)
          return { ...item, timeline: null }
        return item
      })
    })

  const updateVehicleProjection = (count, year, index, calledFor) =>
    dispatch({
      type: 'update',
      field: 'vehicleProjections',
      value: vehicleProjections.map((item, i) => {
        if (i === index)
          return { ...item, count, year }
        if (i > index && calledFor === 'year')
          return { ...item, year: null }
        return item
      })
    })



  const getProjectMilestones = () => {
    // eslint-disable-next-line consistent-return
    const valid = projectMilestones.every((mileStone) => mileStone.timeline !== null)
    if (valid)
      return projectMilestones.map(({ projectMilestone, timeline }) => {
        const {name} = projectMilestone;
        return ({
          projectMilestone: name,
          timeline
        })
      });
    return null;
  }

  const getVehicleProjections = () => {
    const projections = vehicleProjections.map(({ count, year }) => ({
      count: Number(count),
      year: year ? year.value : null
    }))
    // eslint-disable-next-line consistent-return
    const valid = projections.every(({ count, year }) => count > 0 && year !== null);
    if (valid)
      return projections;
    return null;
  }

  const getSelectedFields = () => ({
    code: projectCode,
    name: projectName,
    businessUnit: businessUnit && businessUnit.value,
    vehicleLines: vehicleLines && vehicleLines.map(({ value }) => value),
    projectMilestoneTimelines: getProjectMilestones(),
    vehicleProjections: getVehicleProjections(),
  });

  const getSaveAsDraftSelectedFields = () => ({
    code: projectCode,
    name: projectName,
  });

  const validateFields = (fields) => {
    const { ...requiredFields } = fields;
    const hasMissingRequiredFields = Object.values(requiredFields).some(
      (field) => !field
    );
    if (hasMissingRequiredFields) {
      return false;
    }
    return true;
  };

  const selectedField = getSelectedFields();
	const mandatoryFields = validateFields(selectedField);

  const runPreSubmissionChecks = () => {
    const selectedFields = getSelectedFields();
    const areFieldsValid = validateFields(selectedFields);
    
    if (!areFieldsValid) {
      setHighlightMandatoryFields(true);
      return false;
    }
    return true;
  };

   const runSaveAsDraftPreSubmissionChecks = () => {
    const saveAsDraftSelectedField = getSaveAsDraftSelectedFields();
    const areFieldsValid = validateFields(saveAsDraftSelectedField);
    if (!areFieldsValid) {
      setSaveAsDraftHighlightMandatoryFields(true);
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    const selectedFields = getSelectedFields();
    
    try {
      if(projectId){
        selectedFields.id = projectId;
        await API.put(`${API_RESOURCE_URLS.getProject(projectId)}`, {
          ...selectedFields,
          remarks: remark,
          editStatus: EDIT_STATUS.COMPLETE,
        });
      }else{
        await API.post(`${API_RESOURCE_URLS.PROJECTS}`, {
          ...selectedFields,
          remarks: remark,
          editStatus: EDIT_STATUS.COMPLETE,
        });
      }
      showPopup({
        type: MESSAGE_TYPE.SUCCESS,
        contextText: `Project has been ${projectId ? 'updated' : 'created'} successfully.`,
      });
      redirectToProjectMasterPage();
    } catch (error) {
      console.error(buildErrorMessage(error));
      showPopup({
        type: MESSAGE_TYPE.FAILURE,
        contextText: projectId ? DISPLAY_MESSAGES.PROJECT_UPDATE_FAILURE : DISPLAY_MESSAGES.PROJECT_CREATION_FAILURE,
        info: `Project ${projectId ? 'update' : 'Creation'} failed.`,
        error,
      });
    }
  };

  const handleSaveAsDraft = async () => {
    const selectedFields = getSelectedFields();
    
    try {
      if(projectId){
        selectedFields.id = projectId;
        await API.put(`${API_RESOURCE_URLS.getProject(projectId)}`, {
          ...selectedFields,
          remarks: remark,
          editStatus: EDIT_STATUS.DRAFT,
        });
      }else{
        await API.post(`${API_RESOURCE_URLS.PROJECTS}`, {
          ...selectedFields,
          remarks: remark,
          editStatus: EDIT_STATUS.DRAFT,
        });
      }
      showPopup({
        type: MESSAGE_TYPE.SUCCESS,
        contextText: `Project has been saved in draft state.`,
      });
      redirectToProjectMasterPage();
    } catch (error) {
      console.error(buildErrorMessage(error));
      showPopup({
        type: MESSAGE_TYPE.FAILURE,
        contextText: projectId ? DISPLAY_MESSAGES.PROJECT_UPDATE_FAILURE : DISPLAY_MESSAGES.PROJECT_CREATION_FAILURE,
        info: `Project ${projectId ? 'update' : 'Creation'} failed.`,
        error,
      });
    }
  };

  const patchProjectDetails = (data) => {
    loadPlants(data.businessUnit);
    getVehicleProjections();
    updatedState = {
			projectCode: data.code,
			projectName: data.name,
			businessUnit: { value: data.businessUnit, label: data.businessUnit },
			plants: data.plants.map((item, index) => ({
				value: item.code,
				label: `${item.name} - ${item.code}`,
			})),
			vehicleLines: data.vehicleLines.map((item, index) => ({
				value: item,
				label: item,
			})),
			projectMilestones: data.projectMilestoneTimelines,
			vehicleProjections:
				data.vehicleProjections.length === 0
					? vehicleProjections.map((item, index) => ({
							sn: `Year ${index + 1}`,
							count: item.count,
							year: { value: item.year, label: item.year },
					  }))
					: data.vehicleProjections.map((item, index) => ({
							sn: `Year ${index + 1}`,
							count: item.count,
							year: { value: item.year, label: item.year },
					  })),
			remark: data.remarks,
		};
    dispatch({ type: 'patch' })
  }

  const getProjectDetails = async () => {
    try {
      const response = await API.get(`${API_RESOURCE_URLS.getProject(projectId)}`);
      if(response && response.data){
        const { data } = response;
        setSelectedRowStatus(data.editStatus)
        patchProjectDetails(data);
      }
    } catch (error) {
      console.error(buildErrorMessage(error));
      showPopup({
        type: MESSAGE_TYPE.FAILURE,
        contextText: DISPLAY_MESSAGES.PROJECT_DETAILS_FAILURE,
        info: "Project details not found.",
        error,
      });
    }
  }
    // eslint-disable-next-line no-unused-vars
  const resetState = () => {
    dispatch({ type: 'reset' });
    setHighlightMandatoryFields(null);
    setSaveAsDraftHighlightMandatoryFields(false);
    setAvailablePlants({ loading: false, data: [] });
    changeBackgroundColor('projectInfoBg');
    setResetAllVisitedFields(false);
    setSelectedPartNo('');
    setSelectedLocation('');
    setSorNumbers([]);
    setSorNosValue([]);
    setByProjectName('');
    setByProjectCode('');
    setByVehicleLine('');
  
  }

  useEffect(() => {
    loadBusinessUnits();
    loadVehicleLines();
    loadProjectMilestone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!projectMilestones.length)
      dispatch({
        type: 'update',
        field: 'projectMilestones',
        value: availableProjectMilestones.data.map(({ name, displayName }) => {
          const timelineDetails = {
            projectMilestone: {
              name,
              displayName
            },
            timeline: null
          }
        
          return timelineDetails
        })
      })
  }, [availableProjectMilestones.data, availableProjectMilestones.data.length, projectMilestones.length])

  useEffect(() => {
    if (resetAllVisitedFields)
      resetState();
  }, [resetAllVisitedFields])

  useEffect(() => {
    if(projectId)
      getProjectDetails();
  },[projectId])

  const renderProjectInfoElements = () => (
    <div
      className={styles.formGroup}
      style={{ backgroundColor: projectInfoBg ? BG_COLOR : null }}
      onClick={() => changeBackgroundColor('projectInfoBg')}
    >
 <div className={clsx(styles.formGroupRow, styles.projectInfoFormGroupRow)}>
        <div className={styles.formRow}>
          <label className={styles.label}>
            Part #
          </label>
            <select
        name="partNo"
        id="partNoField"
        value={selectedPartNo}
        onChange={(e) => {
          setSelectedPartNo(e.target.value)
        }}
        className={clsx(styles.select, styles.sel1, 'customField')}
        style={{ border: '1px solid darkgrey',  color: 'darkgrey',  padding:"9px 10px", borderRadius: '4px'}}
      >
        <option value="">Select...</option>
        {partDetail.map((partNo) => (
          <option key={partNo} value={partNo}>
            {partNo}
          </option>
        ))}
      </select>
      {/* <CustomSelect
  name="partNo"
  value={selectedPartNo}
  onChange={(selectedOption) => setSelectedPartNo(selectedOption)}
  options={partDetail.map(partNo => ({ value: partNo, label: partNo }))}
  className={clsx(styles.select, styles.sel1, 'customField')}
  style={{ border: '1px solid darkgrey',  color: 'darkgrey',  padding:"9px 10px", borderRadius: '4px'}}
  isMandatory// or false
  markIfUnselected={highlightMandatoryFields}
  resetAllVisitedFields={resetAllVisitedFields}
  isMulti
  isClearable
  isDisabled={isEditable ? false : true}
/> */}
        </div>
        <div className={styles.formRow}>
          <label className={styles.label}>
            Plants*
          </label>
         <CustomSelect
    name="plants"
    isMandatory
    markIfUnselected={highlightMandatoryFields}
    options={plants.map(plant => ({ value: plant.name, label: plant.name }))}
    className={clsx(styles.select, styles.sel1, styles.sel2)}
    value={selectedPlants}
    resetAllVisitedFields={resetAllVisitedFields}
    // isMulti
    isClearable
    onChange={(selection) => {
      setSelectedPlants(selection);
      dispatch({ type: 'update', field: 'plants', value: selection })
  }}
    isDisabled={!isEditable}
/>
        
        </div>
        <div className={styles.formRow}>
          <label className={styles.label}>
            SOR #
          </label>
          <CustomSelect
            name="sorNumbers"
            isMandatory
            markIfUnselected={highlightMandatoryFields}
            options={sorNosValue.map(sorNo => ({ value: sorNo, label: sorNo }))}
            className={clsx(styles.select, styles.sel1)}
            resetAllVisitedFields={resetAllVisitedFields}
            // isMulti
            isClearable
            isDisabled={isEditable? false:true}
          />
        </div>
      </div>

      <div className={clsx(styles.formGroupRow, styles.projectInfoFormGroupRow)}>
        <div className={styles.formRow}>
          <label className={styles.label}>
            Project Code*
          </label>
          <ValidatingTextField
            isDisabled={isEditable? false:true}
            isMandatory
            validationFn={(value) => value.length > 0}
            markIfEmpty={highlightMandatoryFields || saveAsDraftHighlightMandatoryFields}
            validationHelperText="error occured"
            variant="outlined"
            size="small"
            value={byProjectCode}
            resetAllVisitedFields={resetAllVisitedFields}
            onChange={(e) => dispatch({ type: 'update', field: 'projectCode', value: e.target.value })}
            placeholder="Enter Project Code"
            className={styles.textField}
            inputProps={{
              className: clsx(styles.textInput, styles.projectInfoTextInput),
              "data-testid": "project-code-input",
            }}
            FormHelperTextProps={{
              className: styles.helperText,
            }}
          />
        </div>
        <div className={styles.formRow}>
          <label className={styles.label}>
            Project Name*
          </label>
          <ValidatingTextField
            isDisabled={isEditable? false:true}
            isMandatory
            validationFn={(value) => value.length > 0}
            markIfEmpty={highlightMandatoryFields || saveAsDraftHighlightMandatoryFields}
            validationHelperText="error occured"
            variant="outlined"
            size="small"
            value={byProjectName}
            resetAllVisitedFields={resetAllVisitedFields}
            // onChange={(e) => dispatch({ type: 'update', field: 'projectName', value: e.target.value })}
           onChange={(e) => setByProjectName(e.target.value)}
            placeholder="Enter Project Name"
            className={styles.textField}
            inputProps={{
              className: clsx(styles.textInput, styles.projectInfoTextInput),
              "data-testid": "project-name-input",
            }}
            FormHelperTextProps={{
              className: styles.helperText,
            }}
          />
        </div>
        <div className={styles.formRow}>
          <label className={styles.label}>
            Business Unit*
          </label>
          {/* <CustomSelect
            name="business-unit"
            isMandatory
            markIfUnselected={highlightMandatoryFields}
            options={getBusinessUnitOptions()}
            className={clsx(styles.select, styles.sel1)}
            value={businessUnit}
            resetAllVisitedFields={resetAllVisitedFields}
            onChange={(selection) => {
              if (selection) {
                loadPlants(selection.value);
                dispatch({ type: 'update', field: 'businessUnit', value: selection })
                dispatch({ type: 'update', field: 'plants', value: null })
              }
            }}
            isDisabled={isEditable? false:true}
          /> */}
          
         <input type="text" value="CVBU" readOnly
          className={clsx(styles.select, styles.sel1, 'customField')}
          style={{ border: '1px solid darkgrey',  color: 'darkgrey',  padding:"9px 0px", borderRadius: '4px'}}
         
         />
        </div>
      </div>
      <div className={clsx(styles.formGroupRow, styles.projectInfoFormGroupRow)}>
        <div className={styles.formRow}>
          <label className={styles.label}>
            Vehicle Line*
          </label>
          {/* <CustomSelect
            name="vehicle-line"
            isMandatory
            markIfUnselected={highlightMandatoryFields}
            options={getVehicleLinesOptions()}
            className={clsx(styles.select, styles.sel1)}
            value={vehicleLines}
            resetAllVisitedFields={resetAllVisitedFields}
            isMulti
            isClearable
            onChange={(selection) => dispatch({ type: 'update', field: 'vehicleLines', value: selection })}
            isDisabled={isEditable? false:true}
          /> */}
            <input type="text" 
             className={clsx(styles.select, styles.sel1, 'customField')}
             style={{ border: '1px solid darkgrey',  color: 'darkgrey',  padding:"9px 10px", borderRadius: '4px'}}
            value={byVehicleLine} onChange={(e) => setByVehicleLine(e.target.value)} />
        </div>
        <div className={styles.formRow}>
          <label className={styles.label}>
             VC #  
          </label>
          <ValidatingTextField
            isDisabled={isEditable? false:true}
            isMandatory
            validationFn={(value) => value.length > 0}
            markIfEmpty={highlightMandatoryFields || saveAsDraftHighlightMandatoryFields}
            validationHelperText="error occured"
            variant="outlined"
            size="small"
            value={projectName}
            resetAllVisitedFields={resetAllVisitedFields}
            onChange={(e) => dispatch({ type: 'update', field: 'projectName', value: e.target.value })}
            placeholder="Enter VC"
            className={styles.textField}
            inputProps={{
              className: clsx(styles.textInput, styles.projectInfoTextInput),
              "data-testid": "project-name-input",
            }}
            FormHelperTextProps={{
              className: styles.helperText,
            }}
          />
        </div>
      </div>
    </div>
  )

  const renderProjectMilestoneElements = () => (
		<div
			className={styles.formGroup}
			style={{
				// paddingRight: '30%',
				backgroundColor: projectMilestoneBg ? BG_COLOR : null,
			}}
			onClick={() => changeBackgroundColor('projectMilestoneBg')}
		>
			<div
				className={clsx(
					styles.formGroupRow,
					styles.projectMilestoneformGroupRow,
				)}
			>
				<h6 className={styles.projectMilestoneHeaderTitle}>Stage</h6>
				<h6 className={styles.projectMilestoneHeaderTitle}>Timeline</h6>
			</div>
			{projectMilestones.map(
				({ projectMilestone, displayName, timeline }, index, milestones) => (
					<div
						key={projectMilestone}
						className={clsx(
							styles.formGroupRow,
							styles.projectMilestoneformGroupRow,
						)}
					>
						<label className={styles.label}>{projectMilestone?.displayName}*</label>
						<CustomDatePicker
							isMandatory
							markIfUnselected={highlightMandatoryFields}
							autoOk
							inputVariant="outlined"
							value={timeline}
							resetAllVisitedFields={resetAllVisitedFields}
							onChange={(date) => updateProjectMilestoneTimeLine(date, index)}
							inputProps={{
								className: clsx(styles.select, styles.dateInput),
							}}
							emptyLabel="dd/mm/yyyy"
							defaultDate={moment().format(DATE_FORMAT.DD_MM_YYYY)}
							minDate={!isEditable? null: getMinimumDateForPicker(index, milestones)}
							format="DD/MM/yyyy"
							data-testid={`date-picker-div-${index + 1}`}
              disabled={isEditable? false:true}
						/>
					</div>
				),
			)}
		</div>
	);

  const renderVehicleProjectionElements = () => (
    <div
      className={styles.formGroup}
      style={{
        paddingRight: '50%',
        backgroundColor: vehicleProjectionBg ? BG_COLOR : null,
        overflowX: 'auto',
      }}
      // onClick={() => changeBackgroundColor('vehicleProjectionBg')}
    >
     
      {/* <div className={clsx(styles.formGroupRow, styles.projectMilestoneformGroupRow)}>
        <h6 className={styles.projectMilestoneHeaderTitle}>SN</h6>
        <h6 className={styles.projectMilestoneHeaderTitle}>Pune CVBU</h6>
        <h6 className={styles.projectMilestoneHeaderTitle}>Pune PVBU</h6>
        <h6 className={styles.projectMilestoneHeaderTitle}>Jamshedpur</h6>
        <h6 className={styles.projectMilestoneHeaderTitle}>Lucknow</h6>
        <h6 className={styles.projectMilestoneHeaderTitle}>Pantnagar</h6>
        <h6 className={styles.projectMilestoneHeaderTitle}>Sanand</h6>
        <h6 className={styles.projectMilestoneHeaderTitle}>Dharwad</h6>
        <h6 className={styles.projectMilestoneHeaderTitle}>Grand Total</h6>
      </div>
    
      {vehicleProjections.map(({ sn, count, year }, index, projections) => (
        <div key={sn} className={clsx(styles.formGroupRow, styles.projectMilestoneformGroupRow)}>
          <label className={styles.label}>{sn}*</label>
          {/* <ValidatingTextField
            isDisabled={isEditable? false:true}
            isMandatory
            validationFn={(value) => value > 0}
            variant="outlined"
            size="small"
            type="number"
            markIfEmpty={highlightMandatoryFields}
            value={count}
            resetAllVisitedFields={resetAllVisitedFields}
            onChange={(e) => updateVehicleProjection(e.target.value, year, index, 'count')}
            onKeyPress={(e) => {
              if (e?.key === '-' || e?.key === '+') {
                e?.preventDefault();
              }
            }}
            placeholder="Pune CVBU"
            className={styles.textField}
            inputProps={{
              className: styles.textInput,
              step: 1,
              min: 0,
              "data-testid": `vehicle-projection-input-${index + 1}`,
            }}
          /> */}
           {/* <ValidatingTextField
            isDisabled={isEditable? false:true}
            isMandatory
            validationFn={(value) => value > 0}
            variant="outlined"
            size="small"
            type="number"
            markIfEmpty={highlightMandatoryFields}
            value={count}
            resetAllVisitedFields={resetAllVisitedFields}
            onChange={(e) => updateVehicleProjection(e.target.value, year, index, 'count')}
            onKeyPress={(e) => {
              if (e?.key === '-' || e?.key === '+') {
                e?.preventDefault();
              }
            }}
            placeholder="Pune PVBU"
            className={styles.textField}
            inputProps={{
              className: styles.textInput,
              step: 1,
              min: 0,
              "data-testid": `vehicle-projection-input-${index + 1}`,
            }}
          /> */}
           {/* <ValidatingTextField
            isDisabled={isEditable? false:true}
            isMandatory
            validationFn={(value) => value > 0}
            variant="outlined"
            size="small"
            type="number"
            markIfEmpty={highlightMandatoryFields}
            value={count}
            resetAllVisitedFields={resetAllVisitedFields}
            onChange={(e) => updateVehicleProjection(e.target.value, year, index, 'count')}
            onKeyPress={(e) => {
              if (e?.key === '-' || e?.key === '+') {
                e?.preventDefault();
              }
            }}
            placeholder="Jamshedpur"
            className={styles.textField}
            inputProps={{
              className: styles.textInput,
              step: 1,
              min: 0,
              "data-testid": `vehicle-projection-input-${index + 1}`,
            }}
          /> */}
           {/* <ValidatingTextField
            isDisabled={isEditable? false:true}
            isMandatory
            validationFn={(value) => value > 0}
            variant="outlined"
            size="small"
            type="number"
            markIfEmpty={highlightMandatoryFields}
            value={count}
            resetAllVisitedFields={resetAllVisitedFields}
            onChange={(e) => updateVehicleProjection(e.target.value, year, index, 'count')}
            onKeyPress={(e) => {
              if (e?.key === '-' || e?.key === '+') {
                e?.preventDefault();
              }
            }}
            placeholder="Lucknow"
            className={styles.textField}
            inputProps={{
              className: styles.textInput,
              step: 1,
              min: 0,
              "data-testid": `vehicle-projection-input-${index + 1}`,
            }}
          /> */}
           {/* <ValidatingTextField
            isDisabled={isEditable? false:true}
            isMandatory
            validationFn={(value) => value > 0}
            variant="outlined"
            size="small"
            type="number"
            markIfEmpty={highlightMandatoryFields}
            value={count}
            resetAllVisitedFields={resetAllVisitedFields}
            onChange={(e) => updateVehicleProjection(e.target.value, year, index, 'count')}
            onKeyPress={(e) => {
              if (e?.key === '-' || e?.key === '+') {
                e?.preventDefault();
              }
            }}
            placeholder="Pantnagar"
            className={styles.textField}
            inputProps={{
              className: styles.textInput,
              step: 1,
              min: 0,
              "data-testid": `vehicle-projection-input-${index + 1}`,
            }}
          /> */}
           {/* <ValidatingTextField
            isDisabled={isEditable? false:true}
            isMandatory
            validationFn={(value) => value > 0}
            variant="outlined"
            size="small"
            type="number"
            markIfEmpty={highlightMandatoryFields}
            value={count}
            resetAllVisitedFields={resetAllVisitedFields}
            onChange={(e) => updateVehicleProjection(e.target.value, year, index, 'count')}
            onKeyPress={(e) => {
              if (e?.key === '-' || e?.key === '+') {
                e?.preventDefault();
              }
            }}
            placeholder="Sanand"
            className={styles.textField}
            inputProps={{
              className: styles.textInput,
              step: 1,
              min: 0,
              "data-testid": `vehicle-projection-input-${index + 1}`,
            }}
          /> */}
           {/* <ValidatingTextField
            isDisabled={isEditable? false:true}
            isMandatory
            validationFn={(value) => value > 0}
            variant="outlined"
            size="small"
            type="number"
            markIfEmpty={highlightMandatoryFields}
            value={count}
            resetAllVisitedFields={resetAllVisitedFields}
            onChange={(e) => updateVehicleProjection(e.target.value, year, index, 'count')}
            onKeyPress={(e) => {
              if (e?.key === '-' || e?.key === '+') {
                e?.preventDefault();
              }
            }}
            placeholder="Dharwad"
            className={styles.textField}
            inputProps={{
              className: styles.textInput,
              step: 1,
              min: 0,
              "data-testid": `vehicle-projection-input-${index + 1}`,
            }}
          /> */}
             {/* <ValidatingTextField
            isDisabled={isEditable? false:true}
            isMandatory
            validationFn={(value) => value > 0}
            variant="outlined"
            size="small"
            type="number"
            markIfEmpty={highlightMandatoryFields}
            value={count}
            resetAllVisitedFields={resetAllVisitedFields}
            onChange={(e) => updateVehicleProjection(e.target.value, year, index, 'count')}
            onKeyPress={(e) => {
              if (e?.key === '-' || e?.key === '+') {
                e?.preventDefault();
              }
            }}
            placeholder="Grand Total"
            className={styles.textField}
            inputProps={{
              className: styles.textInput,
              step: 1,
              min: 0,
              "data-testid": `vehicle-projection-input-${index + 1}`,
            }}
          /> */}
         {/* </div> */}
      {/* // ))} */}
      <div className={styles.tableContainer}>
    <table className={`${styles.customTable} my-custom-class`}>
      <thead>
        <tr className='my-table-row'>
          <th className={styles.smallFont}>SN</th>
          <th className={styles.smallFont}>Pune CVBU</th>
          <th className={styles.smallFont}>Pune PVBU</th>
          <th className={styles.smallFont}>Jamshedpur</th>
          <th className={styles.smallFont}>Lucknow</th>
          <th className={styles.smallFont}>Pantnagar</th>
          <th className={styles.smallFont}>Sanand</th>
          <th className={styles.smallFont}>Dharwad</th>
          <th className={styles.smallFont}>Grand Total</th>
        </tr>
      </thead>
      <tbody>
      {[1, 2, 3, 4, 5].map((yearIndex) => (
      <tr key={yearIndex} className={styles.customTableRow}>
    <td>Year {yearIndex}</td>
    <td key={`pun-year-${yearIndex}`}>{extractValuesByLocation('pun')[`year${yearIndex}`]}</td>
    <td key={`pun-year-${yearIndex}`}>{extractValuesByLocation('pun')[`year${yearIndex}`]}</td>
    <td key={`jsr-year-${yearIndex}`}>{extractValuesByLocation('jsr')[`year${yearIndex}`]}</td>
    <td key={`lkw-year-${yearIndex}`}>{extractValuesByLocation('lkw')[`year${yearIndex}`]}</td>
    <td key={`pnt-year-${yearIndex}`}>{extractValuesByLocation('pnt')[`year${yearIndex}`]}</td>
    <td key={`san-year-${yearIndex}`}>{extractValuesByLocation('san')[`year${yearIndex}`]}</td>
    <td key={`dhw-year-${yearIndex}`}>{extractValuesByLocation('dhw')[`year${yearIndex}`]}</td>
    <td>
      {extractValuesByLocation('pun')[`year${yearIndex}`] +
        extractValuesByLocation('pun')[`year${yearIndex}`] +
        extractValuesByLocation('jsr')[`year${yearIndex}`] +
        extractValuesByLocation('lkw')[`year${yearIndex}`] +
        extractValuesByLocation('pnt')[`year${yearIndex}`] +
        extractValuesByLocation('san')[`year${yearIndex}`] +
        extractValuesByLocation('dhw')[`year${yearIndex}`]}
    </td>
  </tr>
))}


      </tbody>
    </table>
</div>
    </div> 
    
  )

  const renderRemarkElement = () => (
    <div
      className={styles.formGroup}
      style={{
        paddingRight: '40%',
        backgroundColor: remarkBg ? BG_COLOR : null
      }}
      onClick={() => changeBackgroundColor('remarkBg')}
    >
      <ValidatingTextField
        isDisabled={isEditable? false:true}
        variant="outlined"
        size="small"
        fullWidth
        multiline
        rows={4}
        value={remark}
        resetAllVisitedFields={resetAllVisitedFields}
        onChange={(e) => dispatch({ type: 'update', field: 'remark', value: e.target.value })}
        placeholder="Enter Remark"
        inputProps={{
          "data-testid": "remark-input",
        }}
      />
    </div>
  )

  return (
    <>
      <div className={styles.formContainer}>
        <CustomFormGroup header='Project Info' body={renderProjectInfoElements()} />
        <CustomFormGroup header='Project Milestones' body={renderProjectMilestoneElements()} />
        <CustomFormGroup header='Project Volumes' body={renderVehicleProjectionElements()} />
        <CustomFormGroup header='Remark' body={renderRemarkElement()} />
      </div>
      {isEditable && (
      <div className={styles.actionBar}>
        <Button
          className={clsx(styles.actionButton, styles.resetButton)}
          variant="tertiary"
          onClick={() => {
            handleOpen(); // Open reset confirmation modal if needed
            resetFields(); // Reset selected fields
          }}
        >
          RESET
        </Button>
        <Button
          className={clsx(styles.actionButton, styles.saveAsDraftButton )}
          variant="secondary"
          onClick={() => runSaveAsDraftPreSubmissionChecks() && handleSaveAsDraft()}
          disabled = {selectedRowStatus === EDIT_STATUS.COMPLETE}
        >
          SAVE AS DRAFT
        </Button>
        <AuthChecker operation={USER_OPERATIONS.CREATE_PROJECT}>
          {isAuthorized => (
            <Button
              className={clsx(
                styles.actionButton,
                styles.primaryActionButton,
              )}
              variant="primary"
              onClick={() => runPreSubmissionChecks() && handleSubmit()}
              disabled={!isAuthorized || !mandatoryFields}
              data-testid="confirm-action"
            >
              SUBMIT
            </Button>
          )}
        </AuthChecker>
      </div>
      )}
      <ResetModal
        isPopupOpen={isPopupOpen}
        handleClose={handleClose}
        resetFields={resetFields}
      />
    </>
  )
}

CreateProjectForm.propTypes = {
  redirectToProjectMasterPage: PropTypes.func,
  projectId: PropTypes.string,
  isEditable: PropTypes.bool
}

function ResetModal({ isPopupOpen, handleClose, resetFields }) {
  return (
    <Dialog
      open={isPopupOpen}
      className={styles.popContainer}
      classes={{
        paper: styles.popupBox,
      }}
      data-testid="reset-popup"
    >
      <>
        <DialogTitle>
          <span className={styles.title}>
            <MdReplay style={{ height: '18px', width: '18px' }} />
            <span className={styles.txt}>Reset</span>
          </span>
        </DialogTitle>
        <DialogContent className={styles.content}>
          <span>
            Are you sure you want to reset the form?
          </span>
        </DialogContent>
        <DialogActions>
          <Button
            className={clsx(
              styles.actionButton,
              styles.transparentButton
            )}
            onClick={handleClose}
          >CANCEL</Button>
          <Button
            className={clsx(
              styles.actionButton,
              styles.primaryActionButton,
            )}
            variant="primary"
            onClick={(e) => {
              e?.preventDefault();
              handleClose()
              resetFields()
            }}
          >
            YES
          </Button>
        </DialogActions>
      </>
    </Dialog>
  )
}

ResetModal.propTypes = {
  isPopupOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  resetFields: PropTypes.func.isRequired
}

export default withAllowedOperationsProvider(
  CreateProjectForm,
  RESOURCE_TYPE.PROJECT
);