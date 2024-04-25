/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable object-shorthand */
/* eslint-disable no-nested-ternary */
import React, { useEffect, useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
import * as XLSX from 'xlsx';
import { Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, makeStyles } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { Button } from '@tmlconnected/avant-garde-components-library';
import styles from './ApqpTimingChart.module.css'
import { API_RESOURCE_URLS, DATE_FORMAT, DISPLAY_MESSAGES, EDIT_STATUS, MESSAGE_TYPE, PPAP_STATE } from '../../../constants';
import { CustomDatePicker, ValidatingTextField } from '../../FormComponents';
import DocumentTable from '../DocumentTable/DocumentTable';
import { buildErrorMessage } from '../../../apis/calls';
import { API } from '../../../apis/api';
import { usePopupManager } from '../../../providers/PopupManager/PopupManager';
import { Remarks } from '../..';

const useStyles = makeStyles({
  root: {
      color: '#C9AF28 !important',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  disabled: {
    color: '#b2b2b2 !important'
  }
})

const initialState = {
  apqpTimingChartGroup: [],
  additionalDetails: []
}
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
    default:
      return state
  }
}

function ApqpTimingChart({
  ppap,
  highlightMandatoryFields,
  setHighlightMandatoryFields,
  reloadData,
  children
}) {
  const classes = useStyles();
  const { showInternalError, showPopup } = usePopupManager();

  const NOT_APPLICABLE = 'NA';

  const [reducerState, dispatch] = useReducer(reducer, initialState);
  const { apqpTimingChartGroup, additionalDetails } = reducerState;

  const [availableApapTimingChartGroups, setAvailableApapTimingChartGroups] = useState({ loading: false, data: [] });

  const { project, state, _links: links, apqpTimingChart } = ppap;
  const { _links: apqpTimingChartLinks } = apqpTimingChart || {};
  const isApqpTimingChartSubmissionPending = !!(links?.submitAPQP || (apqpTimingChart && apqpTimingChartLinks?.submitAPQP));
  const isApqpTimingChartApprovalOrRevisePending = !!(apqpTimingChart && (apqpTimingChartLinks?.approve || apqpTimingChartLinks?.revise))
  const disableDatePicker = !isApqpTimingChartSubmissionPending;
  const [remark, setRemark] = useState('');
  const [comments, setComments] = useState([]);

  const getUpdatedActivities = (activityGroupName, activityName, field, value) => {
    const activityGroup = apqpTimingChartGroup.find((group) => group.name === activityGroupName);
    const updatedActivities = activityGroup
      .activities
      .map((item) => {
        if (item.name === activityName)
          return { ...item, [field]: value }
        return item;
      });
    
    return updatedActivities;
  }

  const updateActivityDate = (field, activityGroupName, activityName, date) => {

    const updatedActivities = getUpdatedActivities(
      activityGroupName,
      activityName,
      field,
      date.format(DATE_FORMAT.ISO)
    );

    dispatch({
      type: 'update',
      field: 'apqpTimingChartGroup',
      value: apqpTimingChartGroup.map((activityGroup) => {
        if (activityGroup.name === activityGroupName)
          return { ...activityGroup, activities: updatedActivities }
        return { ...activityGroup }
      })
    })
  }

  const updateCheckbox = (activityGroupName, activityName, checked) => {
    const updatedActivities = getUpdatedActivities(
      activityGroupName,
      activityName,
      'notApplicable',
      checked
    );

    dispatch({
      type: 'update',
      field: 'apqpTimingChartGroup',
      value: apqpTimingChartGroup.map((activityGroup) => {
        if (activityGroup.name === activityGroupName)
          return { ...activityGroup, activities: updatedActivities }
        return { ...activityGroup }
      })
    })
  }

  const getMinimumDateForEndDate = (arr, index) => {
    if (arr[index].startDate)
      return moment(arr[index].startDate).add(1, 'day').format(DATE_FORMAT.ISO)
    return moment(0).format(DATE_FORMAT.ISO)
  }

  const getKnownActivityGroupTimelines = () => {
    const knownActivityGroupTimelines = apqpTimingChartGroup.map((activityGroup) => {
      const activities = activityGroup.activities
        .filter((activity) => !activity.notApplicable)
        .map((activity) => ({
          activityId: activity.id,
          timeline: {
            start: activity.startDate,
            end: activity.endDate,
          },
        }));
      return { groupId: activityGroup.id, activityTimelines: activities };
    });

    return knownActivityGroupTimelines;
  }

  const getAdditionalActivityTimelines = () => {
    const additionalActivityTimelines = additionalDetails.map((activity) => ({
      activity: activity.name,
      timeline: {
        start: activity.startDate,
        end: activity.endDate
      }
    }));

    return additionalActivityTimelines;
  }

  const getMandatoryApqpTimingChartFields = () => {
    const knownActivityGroupTimelines = getKnownActivityGroupTimelines();
    const additionalActivityTimelines = getAdditionalActivityTimelines();

    const areKnownActivityGroupTimelinesValid = knownActivityGroupTimelines.every(
      (activityGroup) =>
        activityGroup.activityTimelines.every((activity) => {
          const { start, end } = activity.timeline;
          return (
            start !== null && end !== null && moment(end).isAfter(moment(start))
          );
        })
    );

    const areAdditionalActivityTimelinesValid = additionalActivityTimelines.every((activity) => {
      const { start, end } = activity.timeline;
      return (
        start !== null && end !== null && moment(end).isAfter(moment(start))
      );
    })

    return {
      knownActivityGroupTimelines: areKnownActivityGroupTimelinesValid
        ? knownActivityGroupTimelines
        : null,
      additionalActivityTimelines: areAdditionalActivityTimelinesValid
        ? additionalActivityTimelines
        : null,
    };
  }

  const getApqpTimingChartFields = () => {
		const requestRemark =
			apqpTimingChart && apqpTimingChart.remarks
				? [...apqpTimingChart.remarks]
				: [];
		return {
			knownActivityGroupTimelines: getKnownActivityGroupTimelines(),
			remarkRequests: remark
				? [...requestRemark, { remark: remark }]
				: requestRemark,
			additionalActivityTimelines: getAdditionalActivityTimelines(),
		};
	};

  const validateFields = (fields) => {
    const { ...requiredFields } = fields;
    const hasMissingRequiredFields = Object.values(requiredFields).some(
      (field) => field === null
    );
    if (hasMissingRequiredFields) {
      return false;
    }
    return true;
  };

  const selectedField = getMandatoryApqpTimingChartFields();
	const mandatoryFields = validateFields(selectedField);

  const runApqpTimingChartPreSubmissionChecks = () => {
    const selectedFields = getMandatoryApqpTimingChartFields();
    const areFieldsValid = validateFields(selectedFields);

    if (!areFieldsValid) {
      setHighlightMandatoryFields(true);
      return false;
    }
    return true;
  }

  const addActivity = (activity) => {
    dispatch({
      type: "update",
      field: "additionalDetails",
      value: [...additionalDetails, {
        name: activity.activity,
        startDate: activity.startDate,
        endDate: activity.endDate
      }],
    });
  }

  const handleApqpTimingChartDownload = () => {
    const link = document.createElement('a');
    link.href = '/APQP_Timing_Chart_Template_Supplier.xlsx';
    link.setAttribute('download', `APQP_Timing_Chart_Template_Supplier.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  const processExcelData = (parsedExcel, activityGroupIndexs) => {
    let currentActivityGroup = '';
      // eslint-disable-next-line prefer-const
    let processedApqpTimingChartGroups = [ ...availableApapTimingChartGroups.data ];

    parsedExcel.forEach((row, index) => {
      if(activityGroupIndexs.includes(index + 1)){
        const [parsedActivityGroupName] = row;
        currentActivityGroup = parsedActivityGroupName;
      } else {
        processedApqpTimingChartGroups.forEach((group, i) => {
          if (group.name === currentActivityGroup) {
            const [parsedActivityName, startDate, endDate] = row;
            const updatedActivities = group.activities
              .map((activity) => {
                if (activity.name === parsedActivityName) {
                  if (startDate && endDate) {
                    if (
                      startDate.toUpperCase() === NOT_APPLICABLE &&
                      endDate.toUpperCase() === NOT_APPLICABLE
                    )
                      return {
                        ...activity,
                        startDate: null,
                        endDate: null,
                        notApplicable: true
                      }
                    return { 
                        ...activity,
                        startDate: moment(startDate, DATE_FORMAT.DD_MM_YYYY).format(DATE_FORMAT.ISO),
                        endDate: moment(endDate, DATE_FORMAT.DD_MM_YYYY).format(DATE_FORMAT.ISO),
                        notApplicable: false
                      }
                  }
                  return { ...activity };
                }
                return { ...activity };
              });
            processedApqpTimingChartGroups[i] = { ...group, activities: updatedActivities };
          }
        });
      }
    });

    dispatch({ type: 'update', field: 'apqpTimingChartGroup', value: processedApqpTimingChartGroups });
  }

  const handleExcelUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (evt) => { // evt = on_file_select event
      const data = evt.target.result;
      const readedData = XLSX.read(data, {type: 'binary'});
      const wsname = readedData.SheetNames[0];
      const ws = readedData.Sheets[wsname];

      const activityGroupIndexs = ws['!merges'].map(r =>
        Number(XLSX.utils.encode_range(r).split(':')[0].match(/[+-]?\d+(?:\.\d+)?/g)[0])
      );

      const parsedExcel = XLSX.utils.sheet_to_json(ws, {
        header: 1,
        blankrows: false,
      });

      processExcelData(parsedExcel, activityGroupIndexs);
    };
    reader.readAsBinaryString(file);
    showPopup({
      type: MESSAGE_TYPE.SUCCESS,
      contextText: "Document uploaded successfully.",
    });
  }

  const handleSaveAsDraftApqp = async () => {
    const selectedFields = getApqpTimingChartFields();
    try {
      if (links && links.submitAPQP && links.submitAPQP.href) {
        await API.post(links.submitAPQP.href, {
          ...selectedFields,
          editStatus: EDIT_STATUS.DRAFT 
        });
      }
      if (apqpTimingChartLinks && apqpTimingChartLinks.submitAPQP && apqpTimingChartLinks.submitAPQP.href) {
        await API.put(apqpTimingChartLinks.submitAPQP.href, {
          ...selectedFields,
          id: apqpTimingChart.id,
          editStatus: EDIT_STATUS.DRAFT
        });
      }
      showPopup({
        type: MESSAGE_TYPE.SUCCESS,
        contextText: "APQP timing chart has been saved in draft state.",
      });
      setHighlightMandatoryFields(false);
      dispatch({type: 'reset'})
      reloadData();
    } catch (error) {
      console.error(buildErrorMessage(error));
      showPopup({
        type: MESSAGE_TYPE.FAILURE,
        contextText: DISPLAY_MESSAGES.APQP_SUBMISSION_FAILURE,
        info: "APQP timing chart submission failed.",
        error,
      });
    }
  }

  const handleAcknowledgeApqpChart = async () => {
    const selectedFields = getApqpTimingChartFields();
    try {
      if (links && links.submitAPQP && links.submitAPQP.href) {
        await API.post(links.submitAPQP.href, {
          ...selectedFields,
          editStatus: EDIT_STATUS.COMPLETE 
        });
      }
      if (apqpTimingChartLinks && apqpTimingChartLinks.submitAPQP && apqpTimingChartLinks.submitAPQP.href) {
        await API.put(apqpTimingChartLinks.submitAPQP.href, {
          ...selectedFields,
          id: apqpTimingChart.id,
          editStatus: EDIT_STATUS.COMPLETE
        });
      }
      showPopup({
        type: MESSAGE_TYPE.SUCCESS,
        contextText: "APQP timing chart has been submitted successfully",
      });
      setHighlightMandatoryFields(false);
      dispatch({type: 'reset'})
      reloadData();
    } catch (error) {
      console.error(buildErrorMessage(error));
      showPopup({
        type: MESSAGE_TYPE.FAILURE,
        contextText: DISPLAY_MESSAGES.APQP_SUBMISSION_FAILURE,
        info: "APQP timing chart submission failed.",
        error,
      });
    }
  }

  const handleApproveApqpTimingChart = async () => {
    try {
      await API.post(apqpTimingChartLinks.approve.href, remark ? {remark: remark} : {});
      showPopup({
        type: MESSAGE_TYPE.SUCCESS,
        contextText: "APQP timing chart has been approved successfully",
      });
      setHighlightMandatoryFields(false);
      dispatch({type: 'reset'})
      reloadData();
    } catch (error) {
      console.error(buildErrorMessage(error));
      showPopup({
        type: MESSAGE_TYPE.FAILURE,
        contextText: DISPLAY_MESSAGES.APQP_APPROVAL_FAILURE,
        info: "APQP timing chart submission failed.",
        error,
      });
    }
  }

  const handleReviseApqpTimingChart = async () => {
    try {
      await API.post(apqpTimingChartLinks.revise.href, remark ? {remark: remark} : {} );
      showPopup({
        type: MESSAGE_TYPE.SUCCESS,
        contextText: "APQP timing chart has been revised successfully",
      });
      setHighlightMandatoryFields(false);
      dispatch({type: 'reset'})
      reloadData();
    } catch (error) {
      console.error(buildErrorMessage(error));
      showPopup({
        type: MESSAGE_TYPE.FAILURE,
        contextText: DISPLAY_MESSAGES.APQP_APPROVAL_FAILURE,
        info: "APQP timing chart revision failed.",
        error,
      });
    }
  }

  const loadApqpTimingChartActivityGroup = async () => {
    try {
      const response = await API.get(
        API_RESOURCE_URLS.APQP_TIMING_CHART_ACTIVITY_GROUP
      );

      const { data } = response;
        
      const processedApqpTimingChart = data.map((activityGroup) => ({
        ...activityGroup,
        activities: activityGroup.activities.map((activity) => ({
          ...activity,
          startDate: null,
          endDate: null,
          notApplicable: false,
          error: false
        }))
      }));

      return processedApqpTimingChart
    } catch (error) {
      showInternalError(error);
      console.error(buildErrorMessage(error));
      return []
    }
  }

  const getComments = (remarks = [], reviews = []) => {
    let list = [...remarks, ...reviews];
    list = list.sort((a, b) => a.createdAt < b.createdAt ? 1 : -1);
    setComments(list);
  }

  const getApqpTimingChart = async () => {
    if (links && links.submitAPQP) {
      const apqpTimingChartFromApi = await loadApqpTimingChartActivityGroup();
      setAvailableApapTimingChartGroups({ loading: false, data: apqpTimingChartFromApi });

      dispatch({
        type: "update",
        field: "apqpTimingChartGroup",
        value: apqpTimingChartFromApi,
      });
    } else {
      const { knownActivityGroupTimelines, additionalActivityTimelines } = apqpTimingChart || {};

      let processedApqpTimingChartGroups = await loadApqpTimingChartActivityGroup();
      if (knownActivityGroupTimelines && knownActivityGroupTimelines.length) {
        processedApqpTimingChartGroups = processedApqpTimingChartGroups.map((processedItem) => {
          const filteredGroup = knownActivityGroupTimelines.find(({ group }) => group.id === processedItem.id);
          if (filteredGroup) {
            const updatedActivities = processedItem.activities.map((activity) => {
              const filteredActivity = filteredGroup.activityTimelines.find((item) => item.activity.id === activity.id);
              if (filteredActivity) {
                const { start, end } = filteredActivity.timeline;
                if (start && end) {
                  return {
                    ...activity,
                    startDate: moment(filteredActivity.timeline.start).format(DATE_FORMAT.ISO),
                    endDate: moment(filteredActivity.timeline.end).format(DATE_FORMAT.ISO),
                    notApplicable: false,
                  }
                }
                return {
                  ...activity,
                  startDate: null,
                  endDate: null,
                  notApplicable: false,
                }
              }
              return {
                ...activity,
                startDate: null,
                endDate: null,
                notApplicable: true,
              }
            });
  
            return { ...processedItem, activities: updatedActivities };
          }
          return { ...processedItem };
        })
        setAvailableApapTimingChartGroups({ loading: false, data: processedApqpTimingChartGroups });

        dispatch({ type: 'update', field: 'apqpTimingChartGroup', value: processedApqpTimingChartGroups });
      } else {
        setAvailableApapTimingChartGroups({ loading: false, data: processedApqpTimingChartGroups });
        dispatch({ type: 'update', field: 'apqpTimingChartGroup', value: processedApqpTimingChartGroups });
      }
      if (additionalActivityTimelines && additionalActivityTimelines.length) {
        const processedAdditionalActivityTimelines = additionalActivityTimelines.map((activity) => ({
          name: activity.activity,
          startDate: moment(activity.timeline.start).format(DATE_FORMAT.ISO),
          endDate: moment(activity.timeline.end).format(DATE_FORMAT.ISO)
        }));

        dispatch({ type: 'update', field: 'additionalDetails', value: processedAdditionalActivityTimelines });
      }
    }
    getComments(apqpTimingChart?.remarks, apqpTimingChart?.reviews)
  };

  useEffect(() => {  
    getApqpTimingChart();
  }, [ppap.id])

  if (ppap && !ppap.id)
    return children(null)

  const content = (
    <div className={styles.infoWrapper}>
      <h4
        className={clsx(
          styles.projectName,
          state === PPAP_STATE.TERMINATE && styles.terminate
        )}
      >
        {project?.name}
      </h4>
      {
        apqpTimingChartGroup.map((activityGroup) => {
          const columns = [
            {
              width: 380,
              title: activityGroup.name,
              field: 'name',
            },
            {
              title: 'Start date',
              field: 'startDate',
              alignment: 'center',
              render: (row, index) => {
                const {
                  name: activityName,
                  startDate,
                  notApplicable
                } = row;

                return (
                  <CustomDatePicker
                    disabled={notApplicable || disableDatePicker}
                    markIfUnselected={highlightMandatoryFields}
                    autoOk
                    inputVariant="outlined"
                    value={startDate || null}
                    onChange={(date) => updateActivityDate(
                      'startDate',
                      activityGroup.name,
                      activityName,
                      date
                    )}
                    inputProps={{
                      className: clsx(
                        styles.select,
                        styles.dateInput,
                        (notApplicable || disableDatePicker) && styles.disabledDateInput
                      ),
                    }}
                    helperText=''
                    emptyLabel="dd/mm/yyyy"
                    defaultDate={moment().format(DATE_FORMAT.DD_MM_YYYY)}
                    format="DD/MM/yyyy"
                    data-testid={`${activityGroup.id}-start-date-picker-div-${index + 1}`}
                  />
                )
              }
            },
            {
              title: 'End date',
              field: 'endDate',
              alignment: 'center',
              render: (row, index) => {
                const {
                  name: activityName,
                  endDate,
                  notApplicable
                } = row;
                
                return (
                  <CustomDatePicker
                    disabled={notApplicable || disableDatePicker}
                    markIfUnselected={highlightMandatoryFields}
                    autoOk
                    inputVariant="outlined"
                    value={endDate || null}
                    validationFn={(currentValue) => (
                      moment(currentValue).isSameOrAfter(
                        moment(
                          getMinimumDateForEndDate(activityGroup.activities, index)
                        )
                      )
                    )}
                    onChange={(date) => updateActivityDate(
                      'endDate',
                      activityGroup.name,
                      activityName,
                      date
                    )}
                    inputProps={{
                      className: clsx(
                        styles.select,
                        styles.dateInput,
                        (notApplicable || disableDatePicker) && styles.disabledDateInput
                      ),
                    }}
                    helperText=''
                    emptyLabel="dd/mm/yyyy"
                    defaultDate={moment().format(DATE_FORMAT.DD_MM_YYYY)}
                    minDate={getMinimumDateForEndDate(activityGroup.activities, index)}
                    format="DD/MM/yyyy"
                    data-testid={`${activityGroup.id}-end-date-picker-div-${index + 1}`}
                  />
                )
              }
            },
            {
              title: 'Not Applicable',
              field: 'notApplicable',
              alignment: 'center',
              render: (row, index) => {
                const { name: activityName, notApplicable } = row;

                return (
                  <Checkbox
                    size="small"
                    disabled={disableDatePicker}
                    className={clsx(
                      classes.root,
                      disableDatePicker && classes.disabled
                    )}
                    checked={notApplicable}
                    onChange={(e) => updateCheckbox(activityGroup.name, activityName, e.target.checked)}
                    inputProps={{ 'data-testid': `${activityGroup.id}-checkbox-${index + 1}` }}
                  />
                )
              }
            },
          ]

          return (
            <DocumentTable
              key={activityGroup.id}
              columns={columns}
              rows={activityGroup.activities}
            />
          )
        })
      }
      <AdditionalDetails
        isApqpTimingChartSubmissionPending={isApqpTimingChartSubmissionPending}
        disableDatePicker={disableDatePicker}
        highlightMandatoryFields={highlightMandatoryFields}
        additionalDetails={additionalDetails}
        addActivity={addActivity}
        dispatch={dispatch}
      />
      <div className={styles.yellowBg}>
        <h5 style={{fontSize:'1em',margin:0, padding: '0 1.5em'}}><strong>Remarks</strong></h5>
        <Remarks
          disableInput={!isApqpTimingChartSubmissionPending && !isApqpTimingChartApprovalOrRevisePending}
          comments={comments}
          getRemark={(value) => setRemark(value)}
        />
      </div>
    </div>
  );

  const supplierActionButtons = {
    secondaryActions: [
      {
        name: 'SAVE AS DRAFT',
        classNames: { btn: styles.saveAsDraftButton },
        actionFn: () => handleSaveAsDraftApqp(),
        showButton: !disableDatePicker
      },
      {
        name: 'DOWNLOAD TEMPLATE',
        actionFn: () => handleApqpTimingChartDownload(),
        showButton: !disableDatePicker
      },
      {
        name: (
          <>
            <span>
              UPLOAD
            </span>
            <input
              className={styles.uploadExcelInput}
              type="file"
              id="upload-csv"
              accept=".xlsx"
              onClick={e => e.stopPropagation()}
              onChange={e => {
                const elem = e.target;
                handleExcelUpload(elem.files[0]);
                elem.value = '';
              }}
            />
          </>
        ),
        actionFn: () => {},
        showButton: !disableDatePicker
      },
    ],
    primaryAction: {
      name: 'SUBMIT',
      actionFn: () => runApqpTimingChartPreSubmissionChecks() && handleAcknowledgeApqpChart(),
      showButton: !disableDatePicker,
      isDisable: !mandatoryFields
    }
  }

  const sqEngineerActionButtons = {
    secondaryActions: [
      {
        name: 'REVISE',
        classNames: { btn: styles.reviseButton },
        actionFn: () => handleReviseApqpTimingChart(),
        showButton: true
      }
    ],
    primaryAction: {
      name: 'APPROVE',
      actionFn: () => handleApproveApqpTimingChart(),
      showButton: true
    }
  }

  return children({
    content,
    actionButtons: isApqpTimingChartApprovalOrRevisePending ? sqEngineerActionButtons : supplierActionButtons
  });
}

ApqpTimingChart.propTypes = {
  ppap: PropTypes.object,
  highlightMandatoryFields: PropTypes.bool,
  setHighlightMandatoryFields: PropTypes.func,
  reloadData: PropTypes.func,
  children: PropTypes.func.isRequired
}

function AdditionalDetails({
  isApqpTimingChartSubmissionPending,
  disableDatePicker,
  highlightMandatoryFields,
  additionalDetails,
  addActivity,
  dispatch
}) {
  const [isAdditionalModalOpen, setIsAdditionalModalOpen] = useState(false);
  const handleAdditionalModalOpen = () => setIsAdditionalModalOpen(true)
  const handleAdditionlaModalClose = () => setIsAdditionalModalOpen(false);

  const getMinimumDateForEndDate = (startDate) => {
    if (startDate)
      return moment(startDate).add(1, 'day').format(DATE_FORMAT.ISO)
    return moment(0).format(DATE_FORMAT.ISO)
  }

  const updateActivityDate = (field, date, index) => {
    dispatch({
      type: 'update',
      field: 'additionalDetails',
      value: additionalDetails.map((activity, i) => {
        if (i === index)
          return { ...activity, [field]: date.format(DATE_FORMAT.ISO) }
        return { ...activity }
      })
    })
  }

  const handleDelete = (index) => {
    const updatedAdditionalDetails = additionalDetails.filter((_, i) => i !== index)
    dispatch(
      {
        type: 'update',
        field: 'additionalDetails',
        value: updatedAdditionalDetails
      }
    )
  }

  const additionalDetailsColumn = [
    {
      width: 380,
      title: 'Additional timelines',
      field: 'name',
      renderHeader: () => (
        <>
          <span style={{marginRight: '10px'}}>Additional timelines</span>
          {isApqpTimingChartSubmissionPending && (
            <Button
              size="small"
              ignoreExistingClassNames
              className={styles.addDetailsBtn}
              onClick={handleAdditionalModalOpen}
            >
              + Add
            </Button>
          )}
        </>
      ),
    },
    {
      title: 'Start date',
      field: 'startDate',
      alignment: 'center',
      render: (row, index) => {
        const {
          startDate,
        } = row;

        return (
          <CustomDatePicker
            disabled={disableDatePicker}
            markIfUnselected={highlightMandatoryFields}
            autoOk
            inputVariant="outlined"
            value={startDate}
            onChange={(date) => updateActivityDate('startDate', date, index)}
            inputProps={{
              className: clsx(
                styles.select,
                styles.dateInput,
                disableDatePicker && styles.disabledDateInput
              ),
            }}
            helperText=''
            emptyLabel="dd/mm/yyyy"
            defaultDate={moment().format(DATE_FORMAT.DD_MM_YYYY)}
            format="DD/MM/yyyy"
            data-testid={`start-date-picker-div-${index + 1}`}
          />
        )
      }
    },
    {
      title: 'End date',
      field: 'endDate',
      alignment: 'center',
      render: (row, index) => {
        const {
          startDate,
          endDate
        } = row;
        
        return (
          <CustomDatePicker
            disabled={disableDatePicker}
            markIfUnselected={highlightMandatoryFields}
            autoOk
            inputVariant="outlined"
            value={endDate}
            validationFn={(currentValue) => (
              moment(currentValue).isSameOrAfter(
                moment(
                  getMinimumDateForEndDate(startDate, index)
                )
              )
            )}
            onChange={(date) => updateActivityDate('endDate', date, index)}
            inputProps={{
              className: clsx(
                styles.select,
                styles.dateInput,
                disableDatePicker && styles.disabledDateInput
              ),
            }}
            helperText=''
            emptyLabel="dd/mm/yyyy"
            minDate={getMinimumDateForEndDate(startDate, index)}
            defaultDate={moment().format(DATE_FORMAT.DD_MM_YYYY)}
            format="DD/MM/yyyy"
            data-testid={`end-date-picker-div-${index + 1}`}
          />
        )
      }
    },
    {
      title: '',
      field: '',
      alignment: 'center',
      render: (_, index) => {
        if (!disableDatePicker)
          return (
            <IconButton
              color="primary"
              className={styles.deleteIcon}
              onClick={() => handleDelete(index)}
            >
              <DeleteIcon />
            </IconButton>
          );
        return null
      }
    }
  ];

  return (
    <>
      <DocumentTable
        columns={additionalDetailsColumn}
        rows={additionalDetails}
      />
      {
        isAdditionalModalOpen &&
        <AdditionalDetailsModal
          isAdditionalModalOpen={isAdditionalModalOpen}
          handleClose={handleAdditionlaModalClose}
          addActivity={addActivity}
        />
      }
    </>
  )
}

AdditionalDetails.propTypes = {
  isApqpTimingChartSubmissionPending: PropTypes.bool,
  disableDatePicker: PropTypes.bool,
  highlightMandatoryFields: PropTypes.bool,
  additionalDetails: PropTypes.array,
  addActivity: PropTypes.func,
  dispatch: PropTypes.func
}

function AdditionalDetailsModal({ isAdditionalModalOpen, handleClose, addActivity }) {
  const [activityName, setActivityName] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [highlightMandatoryFields, setHighlightMandatoryFields] = useState(false);

  const getMinimumDateForEndDate = () => {
    if (startDate)
      return moment(startDate).add(1, 'day').format(DATE_FORMAT.ISO)
    return moment(0).format(DATE_FORMAT.ISO)
  }

  const validateFields = (fields) => {
    const { ...requiredFields } = fields;
    const hasMissingRequiredFields = Object.values(requiredFields).some(
      (field) => field === null
    );
    if (hasMissingRequiredFields) {
      return false;
    }
    return true;
  };

  const getSelectedFields = () => ({
    activity: activityName,
    startDate,
    endDate
  })

  const runPreSubmissionChecks = () => {
    const selectedFields = getSelectedFields();
    const areFieldsValid = validateFields(selectedFields);

    if (!areFieldsValid) {
      setHighlightMandatoryFields(true);
      return false;
    }
    return true;
  }

  return (
    <Dialog
      open={isAdditionalModalOpen}
      classes={{
        paper: styles.popupBox,
      }}
      data-testid="additional-details-popup"
    >
      <>
        <DialogTitle>
          <span className={styles.title}>
            <span className={styles.txt}>Additional Timelines</span>
          </span>
        </DialogTitle>
        <DialogContent className={styles.popupContent}>
          <div className={styles.popupContainer}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <label className={styles.label}>
                Name*
              </label>
              <ValidatingTextField
                isMandatory
                validationFn={(value) => value.length > 0}
                markIfEmpty={highlightMandatoryFields}
                variant="outlined"
                size="small"
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
                placeholder="Insert Title here"
                className={styles.textField}
                inputProps={{
                  className: styles.textInput,
                  "data-testid": "name-input",
                }}
              />
            </div>
            <CustomDatePicker
              markIfUnselected={highlightMandatoryFields}
              autoOk
              inputVariant="outlined"
              value={startDate}
              onChange={(date) => setStartDate(date.format(DATE_FORMAT.ISO))}
              inputProps={{
                className: clsx(
                  styles.select,
                  styles.dateInput,
                ),
              }}
              helperText=''
              emptyLabel="dd/mm/yyyy"
              defaultDate={moment().format(DATE_FORMAT.DD_MM_YYYY)}
              format="DD/MM/yyyy"
              data-testid="additional-details-start-date-picker-div"
            />
            <CustomDatePicker
              markIfUnselected={highlightMandatoryFields}
              autoOk
              inputVariant="outlined"
              value={endDate}
              onChange={(date) => setEndDate(date.format(DATE_FORMAT.ISO))}
              inputProps={{
                className: clsx(
                  styles.select,
                  styles.dateInput,
                ),
              }}
              helperText=''
              emptyLabel="dd/mm/yyyy"
              minDate={getMinimumDateForEndDate()}
              defaultDate={moment().format(DATE_FORMAT.DD_MM_YYYY)}
              format="DD/MM/yyyy"
              data-testid="additional-details-end-date-picker-div"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            ignoreExistingClassNames
            className={clsx(styles.actionButton, styles.transparentButton)}
            onClick={handleClose}
          >
            CANCEL
          </Button>
          <Button
            className={clsx(styles.actionButton, styles.primaryActionButton)}
            variant="primary"
            onClick={(e) => {
              e?.preventDefault();
              const isValid = runPreSubmissionChecks();
              if (isValid) {
                const activity = getSelectedFields();
                addActivity(activity);
                handleClose();
              }
            }}
          >
            ADD
          </Button>
        </DialogActions>
      </>
    </Dialog>
  )
}

AdditionalDetailsModal.propTypes = {
  isAdditionalModalOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  addActivity: PropTypes.func.isRequired
}

export default ApqpTimingChart;
