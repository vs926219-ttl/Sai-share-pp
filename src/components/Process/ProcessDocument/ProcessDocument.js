/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useReducer, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@material-ui/core';
import axios from 'axios';
import DeleteIcon from '@material-ui/icons/Delete';
import { Button } from '@tmlconnected/avant-garde-components-library';
import styles from './ProcessDocument.module.css';
import {
  API_RESOURCE_URLS,
  DATE_FORMAT,
  DISPLAY_MESSAGES,
  EDIT_STATUS,
  MESSAGE_TYPE,
  PPAP_STATE,
} from '../../../constants';
import {
  CustomDatePicker,
  CustomSelect,
  CustomFormGroup,
} from '../../FormComponents';
import DocumentsModal from '../DocumentsModal/DocumentsModal';
import DocumentTable from '../DocumentTable/DocumentTable';
import { API } from '../../../apis/api';
import { buildErrorMessage } from '../../../apis/calls';
import { usePopupManager } from '../../../providers/PopupManager/PopupManager';
import { Remarks, GridLoadingSpinner } from '../..';
import WarningModal from '../../WarningModal/WarningModal';

const initialState = {
  stageWiseDocuments: [],
  rAndRWaiver: null,
};
const reducer = (state, action) => {
  switch (action.type) {
    case 'update':
      return {
        ...state,
        [action.field]: action.value,
      };
    case 'reset':
      return {
        ...state,
        ...initialState,
      };
    default:
      return state;
  }
};

function ProcessDocument({
  ppap,
  partCategory,
  systemPpapLevel,
  overwritePpapLevel,
  ppapReason,
  highlightMandatoryFields,
  setHighlightMandatoryFields,
  reloadData,
  children,
}) {
  const { showInternalError, showPopup } = usePopupManager();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { stageWiseDocuments, rAndRWaiver } = state;
  const [documentData, setDocumentData] = useState(null);
  const [loading, setLoader] = useState(false);

  const yesAndNoOptions = [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' },
  ];

  const { _links: links, requirement } = ppap;
  const {
    _links: requirementLinks,
    stageRequirements: stageDocuments,
    attachments: attachment,
  } = requirement || {};
  const isPpapInitiationRemaining = !!(
    links?.initiate ||
    (requirement && requirementLinks?.initiate)
  );
  const isPpapTerminationRemaining = links?.terminate;
  const isApprovalPending = !!requirementLinks?.APPROVE;
  const isDisabled = !isPpapInitiationRemaining || !isPpapTerminationRemaining;
  const ppapReasons = ppap?.reason?.reason;

  const [
    availableStageWiseDocuments,
    setAvailableStageWiseDocuments,
  ] = useState([]);

  const [
    availableAttachmentDocuments,
    setAvailableAttachmentDocuments,
  ] = useState([]);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPopupDeleteOpen, setIsDeletePopupOpen] = useState(false);
  const [currentStage, setCurrentStage] = useState('');
  const [remarks, setRemarks] = useState('');
  const [comments, setComments] = useState([]);
  const [customDocumentIds, setCustomDocumentIds] = useState([]);
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null);
  const [showTemplatePanel, setShowTemplatePanel] = React.useState(false);
  const [deleteInfo, setDeleteInfo] = useState({
    deleteUrl: null,
    documentsList: null,
    setDocumentsList: null,
  });
  const [availablestageDocuments, setAvailableStageDocuments] = useState([]);

  const handleOpen = (stage, data) => {
    setIsPopupOpen(true);
    setCurrentStage(stage);
    if (data) setShowTemplatePanel(true);
    else setShowTemplatePanel(false);
  };
  const handleClose = () => setIsPopupOpen(false);

  const [isTerminatePopupOpen, setIsTerminatePopupOpen] = useState(false);

  const handleTerminatePopupOpen = () => setIsTerminatePopupOpen(true);
  const handleTerminatePopupClose = () => setIsTerminatePopupOpen(false);

  const handleDeleteOpen = () => setIsDeletePopupOpen(true);
  const handleDeleteClose = () => {
    setIsDeletePopupOpen(false);
    setDeleteInfo({
      deleteUrl: null,
      documentsList: null,
      setDocumentsList: null,
    });
  };
  const confirmAttachmentDelete = async (setState) => {
    setLoader(true);
    try {
      if (deleteInfo && deleteInfo.deleteUrl) {
        const response = await API.delete(deleteInfo.deleteUrl);

        if (response) setLoader(false);

        const { data } = response;
        const { documentName, _links, id } = data;

        const filteredArray = deleteInfo.documentsList.filter(
          (element) =>
            // eslint-disable-next-line no-underscore-dangle
            element._links.DELETE.href !== deleteInfo.deleteUrl
        );

        deleteInfo.setDocumentsList(filteredArray);

        showPopup({
          type: MESSAGE_TYPE.SUCCESS,
          contextText: 'Document deleted successfully.',
        });
      }
      setLoader(false);
    } catch (error) {
      console.error(buildErrorMessage(error));
      showPopup({
        type: MESSAGE_TYPE.FAILURE,
        contextText: DISPLAY_MESSAGES.DELETE_FILE,
        info: 'Document delete failed.',
        error,
      });
      setLoader(false);
    }
  };

  const updateTargetDate = (date, index) =>
    dispatch({
      type: 'update',
      field: 'stageWiseDocuments',
      value: stageWiseDocuments.map((item, i) => {
        if (i === index)
          return { ...item, targetDate: date.format(DATE_FORMAT.ISO) };
        return { ...item };
      }),
    });

  const removeStage = (stageName) => {
    const isStagePresent = stageWiseDocuments.find(
      ({ stage }) => stage.name === stageName
    );
    if (isStagePresent && isStagePresent.stage.name) {
      dispatch({
        type: 'update',
        field: 'stageWiseDocuments',
        value: stageWiseDocuments.filter(
          ({ stage }) => stage.name !== stageName
        ),
      });
    }
  };

  const addStage = (stageName) => {
    const isStagePresent = stageWiseDocuments.find(
      ({ stage }) => stage.name === stageName
    );
    if (!isStagePresent) {
      const availableStage = availablestageDocuments.find(
        ({ stage }) => stage.name === stageName
      );
      const stageIndex = availablestageDocuments.findIndex(
        ({ stage }) => stage.name === stageName
      );
      const arr = [...stageWiseDocuments];

      const isStagePresent = stageDocuments.find(
        (stageDoc) => stageDoc.stage.name === 'R@R'
      );

      if (!isStagePresent) {
        availableStage.id = null;
        availableStage.customDocuments = [];
      } else {
        availableStage.id = isStagePresent.id;
        availableStage.customDocuments = isStagePresent.customDocuments;
      }

      arr.splice(stageIndex, 0, availableStage);
      dispatch({
        type: 'update',
        field: 'stageWiseDocuments',
        value: [...arr],
      });
    }
  };

  const getStageRequirements = () =>
    stageWiseDocuments.map(({ stage, targetDate, id }) => {
      const findcustomDocument = customDocumentIds.find(
        (x) => x && x.stageId === stage.id
      );
      const obj = {
        stageId: stage.id,
        targetDate,
        // documentIds: documents.map(({ id: documentId }) => documentId),
        customDocumentIds: findcustomDocument
          ? findcustomDocument.customDocumentIds
          : [],
      };
      if (id || id === null) obj.id = id;
      return obj;
    });

  const getRandRwaiver = () => {
    if (rAndRWaiver) return rAndRWaiver.value;
    return null;
  };

  const getMandatoryFields = () => {
    const processedStagewiseRequirements = getStageRequirements();
    const areStageRequirementValid = processedStagewiseRequirements.every(
      (item) => item.targetDate !== null
    );

    return {
      partCategoryName: partCategory && partCategory.value,
      submissionLevel: systemPpapLevel && systemPpapLevel.value,
      reasonId: ppapReasons,
      stageRequirements: areStageRequirementValid
        ? processedStagewiseRequirements
        : null,
      rAndRWaiver: getRandRwaiver(),
    };
  };

  const getSelectedFields = () => ({
    partCategoryName: partCategory && partCategory.value,
    submissionLevel: systemPpapLevel && systemPpapLevel.value,
    submissionLevelOverride: overwritePpapLevel && overwritePpapLevel.value,
    stageRequirements: getStageRequirements(),
    rAndRWaiver: getRandRwaiver(),
  });

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

  const selectedField = getMandatoryFields();
  const mandatoryFields = validateFields(selectedField);

  const runPreSubmissionChecks = () => {
    const selectedFields = getMandatoryFields();
    const areFieldsValid = validateFields(selectedFields);

    if (!areFieldsValid) {
      setHighlightMandatoryFields(true);
      if (!selectedFields.stageRequirements) {
        showPopup({
          type: MESSAGE_TYPE.FAILURE,
          contextText: 'Target Date should not be empty',
        });
      }
      if (selectedFields.stageRequirements && !selectedFields.rAndRWaiver) {
        const el = document.querySelector('#scrollToBlock');
        el?.scrollIntoView();
      }
      return false;
    }
    return true;
  };

  const handleInitiatePpap = async () => {
    const selectedFields = getSelectedFields();
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(selectedFields)) {
      if (value === null) delete selectedFields[key];
    }
    try {
      if (links && links.initiate && links.initiate.href) {
        await API.post(links.initiate.href, {
          ...selectedFields,
          reasonId: ppapReasons,
          remarks,
          editStatus: EDIT_STATUS.COMPLETE,
        });
      }
      if (
        requirementLinks &&
        requirementLinks.initiate &&
        requirementLinks.initiate.href
      ) {
        await API.put(requirementLinks.initiate.href, {
          ...selectedFields,
          id: requirement.id,
          remarks,
          editStatus: EDIT_STATUS.COMPLETE,
        });
      }
      showPopup({
        type: MESSAGE_TYPE.SUCCESS,
        contextText: 'PPAP has been initiated successfully.',
      });
      setHighlightMandatoryFields(false);
      dispatch({ type: 'reset' });
      reloadData();
    } catch (error) {
      console.error(buildErrorMessage(error));
      showPopup({
        type: MESSAGE_TYPE.FAILURE,
        contextText: DISPLAY_MESSAGES.PPAP_INITIATION_FAILURE,
        info: 'PPAP initiation failed.',
        error,
      });
    }
  };

  const handleSaveAsDraftPpap = async () => {
    let selectedFields = getSelectedFields();
    const { stageRequirements } = selectedFields;

    selectedFields = {
      ...selectedFields,
      stageRequirements:
        stageRequirements.length && stageRequirements.length > 0
          ? stageRequirements
          : null,
    };

    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(selectedFields)) {
      if (value === null) delete selectedFields[key];
    }

    try {
      if (links && links.initiate && links.initiate.href) {
        await API.post(links.initiate.href, {
          ...selectedFields,
          remarks,
          editStatus: EDIT_STATUS.DRAFT,
        });
      }
      if (
        requirementLinks &&
        requirementLinks.initiate &&
        requirementLinks.initiate.href
      ) {
        await API.put(requirementLinks.initiate.href, {
          ...selectedFields,
          id: requirement.id,
          remarks,
          editStatus: EDIT_STATUS.DRAFT,
        });
      }
      showPopup({
        type: MESSAGE_TYPE.SUCCESS,
        contextText: 'PPAP has been saved in draft state.',
      });
      setHighlightMandatoryFields(false);
      dispatch({ type: 'reset' });
      reloadData();
    } catch (error) {
      console.error(buildErrorMessage(error));
      showPopup({
        type: MESSAGE_TYPE.FAILURE,
        contextText: DISPLAY_MESSAGES.PPAP_INITIATION_FAILURE,
        info: 'PPAP initiation failed.',
        error,
      });
    }
  };

  const handleRevise = async () => {
    try {
      if (
        requirementLinks &&
        requirementLinks.REVISE &&
        requirementLinks.REVISE.href
      ) {
        await API.post(requirementLinks.REVISE.href, {
          remark: remarks,
        });
      }

      showPopup({
        type: MESSAGE_TYPE.SUCCESS,
        contextText: 'PPAP has been sent for revision successfullly',
      });
      setHighlightMandatoryFields(false);
      dispatch({ type: 'reset' });
      reloadData();
    } catch (error) {
      console.error(buildErrorMessage(error));
      showPopup({
        type: MESSAGE_TYPE.FAILURE,
        contextText: DISPLAY_MESSAGES.PPAP_REVISION_FAILURE,
        info: 'PPAP revision failed.',
        error,
      });
    }
  };

  const handleApprove = async () => {
    try {
      if (
        requirementLinks &&
        requirementLinks.APPROVE &&
        requirementLinks.APPROVE.href
      ) {
        await API.post(requirementLinks.APPROVE.href, {
          remark: remarks,
        });
      }

      showPopup({
        type: MESSAGE_TYPE.SUCCESS,
        contextText: 'PPAP has been approved successfullly',
      });
      setHighlightMandatoryFields(false);
      dispatch({ type: 'reset' });
      reloadData();
    } catch (error) {
      console.error(buildErrorMessage(error));
      showPopup({
        type: MESSAGE_TYPE.FAILURE,
        contextText: DISPLAY_MESSAGES.PPAP_APPROVAL_FAILURE,
        info: 'PPAP approval failed.',
        error,
      });
    }
  };

  const handleTerminatePpap = async () => {
    try {
      await API.post(links.terminate.href);
      showPopup({
        type: MESSAGE_TYPE.SUCCESS,
        contextText: 'PPAP has been Terminated successfully.',
      });
      setHighlightMandatoryFields(false);
      dispatch({ type: 'reset' });
      reloadData();
    } catch (error) {
      console.error(buildErrorMessage(error));
      showPopup({
        type: MESSAGE_TYPE.FAILURE,
        contextText: DISPLAY_MESSAGES.PPAP_TERMINATION_FAILURE,
        info: 'PPAP Termination failed.',
        error,
      });
    }
  };

  const uploadFile = async (file, documentsList, setDocumentsList) => {
    const api = requirementLinks.GET_ATTACHMENT_UPLOAD_URL.href.replace(
      'documentName=documentName&fileName=fileName',
      `documentName=${file.name}&fileName=${file.name}`
    );
    setLoader(true);

    try {
      const response = await API.get(api);
      const { data } = response;
      const { presignedUrl, _links: acknowledgeLink } = data;

      if (presignedUrl && file) {
        await axios.put(presignedUrl, file, {
          headers: {
            'Content-Type': file.type,
          },
        });

        const acknowledgeResponse = await API.post(
          acknowledgeLink.ACKNOWLEDGE_UPLOAD.href,
          { documentName: file.name, fileName: file.name }
        );

        showPopup({
          type: MESSAGE_TYPE.SUCCESS,
          contextText: 'Document uploaded successfully.',
        });

        const { data } = acknowledgeResponse;
        const { documentName, _links, id } = data;

        if (acknowledgeResponse) setLoader(false);

        if (acknowledgeResponse) {
          const updatedStageDocuments = [
            ...documentsList,
            {
              documentName,
              id,
              _links: { ..._links, DELETE: _links.DELETE_DOCUMENT },
            },
          ];

          setDocumentsList(updatedStageDocuments);
        }
      }
    } catch (error) {
      console.error(buildErrorMessage(error));
      if (error.response?.status === 415) {
        setLoader(false);
        showPopup({
          type: MESSAGE_TYPE.FAILURE,
          contextText: 'Unable to upload the file.',
          info: 'Provided format is not supported.',
        });
      } else {
        setLoader(false);
        showPopup({
          type: MESSAGE_TYPE.FAILURE,
          contextText: 'Document upload failed.',
          info: 'Document upload failed.',
        });
      }
    }
  };

  const handleFileUpload = (event, documentsList, setDocumentsList) => {
    uploadFile(event.target.files[0], documentsList, setDocumentsList);
  };

  const downloadTemplate = async (row) => {
    const { _links: links, templateDocument } = row;
    setLoader(true);
    try {
      const response = await API.get(links.DOWNLOAD_URL.href);
      const { presignedUrl } = response.data;

      if (presignedUrl) {
        const res = await axios.get(presignedUrl, {
          responseType: 'blob',
        });

        const a = document.createElement('a');
        const href = window.URL.createObjectURL(res.data);
        a.href = href;
        a.download = templateDocument.documentName;
        a.click();
        setLoader(false);
      }
    } catch (error) {
      console.error(buildErrorMessage(error));
      setLoader(false);
      showPopup({
        type: MESSAGE_TYPE.FAILURE,
        contextText: DISPLAY_MESSAGES.DOWNLOAD_FAIL,
        info: 'Document download failed.',
      });
    }
  };

  const downloadFile = async (row) => {
    const { _links: links, documentName } = row;
    setLoader(true);
    try {
      const response = await API.get(links.DOWNLOAD_URL.href);
      const { presignedUrl } = response.data;

      if (presignedUrl) {
        const res = await axios.get(presignedUrl, {
          responseType: 'blob',
        });

        const a = document.createElement('a');
        const href = window.URL.createObjectURL(res.data);
        a.href = href;
        a.download = documentName;
        a.click();
        setLoader(false);
      }
    } catch (error) {
      console.error(buildErrorMessage(error));
      setLoader(false);
      showPopup({
        type: MESSAGE_TYPE.FAILURE,
        contextText: DISPLAY_MESSAGES.DOWNLOAD_FAIL,
        info: 'Document download failed.',
      });
    }
  };

  const getAttachmentColumns = (documentsList, setDocumentsList) => [
    {
      width: 1,
      title: '',
      field: '',
      render: (_, rowIndex) => rowIndex + 1,
    },
    {
      width: 150,
      title: 'File',
      field: '',
      render: (row) => {
        const { _links: links, documentName } = row;
        if (links && links.DOWNLOAD_URL)
          return (
            <Button
              size='small'
              ignoreExistingClassNames
              className={styles.submitBtn}
              type='submit'
              onClick={() => downloadFile(row)}
            >
              {documentName}
            </Button>
          );
        return null;
      },
    },
    {
      width: 50,
      title: '',
      field: '',
      alignment: 'center',
      render: (row) => {
        const { _links: links, documentName } = row;
        if (links && links.DELETE)
          return (
            <IconButton
              color='primary'
              className={styles.deleteIcon}
              onClick={() => {
                setDeleteInfo({
                  deleteUrl: links.DELETE.href,
                  documentsList,
                  setDocumentsList,
                });
                handleDeleteOpen();
              }}
            >
              <DeleteIcon style={{ fontSize: 20 }} />
            </IconButton>
          );
        return null;
      },
    },
  ];

  const loadAvailableStageWiseDocuments = async () => {
    try {
      const response = await API.get(API_RESOURCE_URLS.SUGGESTED_DOCUMENTS);

      const { data } = response;
      const processedStageWiseDocuments = data.map((document) => ({
        ...document,
        targetDate: null,
      }));
      setAvailableStageDocuments(processedStageWiseDocuments);
      return processedStageWiseDocuments;
    } catch (error) {
      showInternalError(error);
      console.error(buildErrorMessage(error));
      return [];
    }
  };

  const getAttachmentDocuments = (documents, setState) => {
    if (documents) {
      const updatedDocuments = documents.map((document) => ({
        ...document,
      }));

      setState(updatedDocuments);
    }
  };

  // eslint-disable-next-line no-shadow
  const getComments = (remarks = [], reviews = []) => {
    let list = [...remarks, ...reviews];
    list = list.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    setComments(list);
  };

  const getStageRequirementsFromPpap = async () => {
    if (stageDocuments) {
      setAvailableStageWiseDocuments(stageDocuments);
      dispatch({
        type: 'update',
        field: 'stageWiseDocuments',
        value: stageDocuments,
      });

      const customDocList = stageDocuments.map((item) => ({
        stageId: item.stage.id,
        customDocumentIds: item.customDocuments
          ? item.customDocuments.map((x) => x.id)
          : [],
      }));
      setCustomDocumentIds(customDocList);
    }

    if (links && links.initiate) {
      dispatch({ type: 'update', field: 'rAndRWaiver', value: null });
    } else if (requirementLinks && requirementLinks.initiate) {
      const { stageRequirements, rAndRWaiver: waiver } = requirement || {};

      if (stageRequirements && stageRequirements.length) {
        const updatedStageRequirements = stageDocuments.map((processedItem) => {
          const index = stageRequirements.findIndex(
            (item) => item.stage.name === processedItem.stage.name
          );
          if (index !== -1)
            return {
              ...stageRequirements[index],
              targetDate: stageRequirements[index].targetDate || null,
            };
          return { ...processedItem, targetDate: null };
        });
        dispatch({
          type: 'update',
          field: 'stageWiseDocuments',
          value:
            waiver === true
              ? updatedStageRequirements.filter(
                  ({ stage }) => stage.name !== 'R@R'
                )
              : updatedStageRequirements,
        });
      } else {
        dispatch({
          type: 'update',
          field: 'stageWiseDocuments',
          value: stageDocuments,
        });
      }

      let waiverValue;
      if (waiver === true) {
        waiverValue = {
          value: true,
          label: 'Yes',
        };
      }
      if (waiver === false)
        waiverValue = {
          value: false,
          label: 'No',
        };

      dispatch({
        type: 'update',
        field: 'rAndRWaiver',
        value: waiver === true || waiver === false ? waiverValue : null,
      });
    } else {
      const { stageRequirements, rAndRWaiver: waiver } = requirement || {};
      if (stageRequirements && stageRequirements.length) {
        dispatch({
          type: 'update',
          field: 'stageWiseDocuments',
          value: stageRequirements,
        });
      }

      let waiverValue;
      if (waiver === true) {
        waiverValue = {
          value: true,
          label: 'Yes',
        };
      }
      if (waiver === false)
        waiverValue = {
          value: false,
          label: 'No',
        };

      dispatch({
        type: 'update',
        field: 'rAndRWaiver',
        value: waiver === true || waiver === false ? waiverValue : null,
      });
    }
    getComments(requirement?.remarks, requirement?.reviews);
    getAttachmentDocuments(attachment, setAvailableAttachmentDocuments);
  };

  const getErrors = (code) => {
    let message = DISPLAY_MESSAGES.DOCUMENT_SUBMIT_FAILURE;

    if (code === '401' || code === '403')
      message = DISPLAY_MESSAGES.AUTHORISATION_ERROR;
    else if (code === '504') message = DISPLAY_MESSAGES.NETWORK_ERROR;
    else if (code === '500' || code === '502' || code === '503')
      message = DISPLAY_MESSAGES.PRIMARY_ERROR;

    return message;
  };

  const sendDocData = async (fields) => {
    try {
      const response = await API.post(API_RESOURCE_URLS.ALL_DOCUMENTS, fields);
      const { data } = response;

      if (data) {
        setDocumentData(data);
        dispatch({
          type: 'update',
          field: 'stageWiseDocuments',
          value: stageWiseDocuments.map((item) => {
            if (item.stage && item.stage.id === currentStage.id) {
              const arr = [...item.customDocuments];
              arr.push(data);
              return { ...item, customDocuments: arr };
            }
            return { ...item };
          }),
        });

        const documentIds = [...customDocumentIds];
        const findCurrentStageDocuments = documentIds.find(
          (x) => x.stageId === currentStage.id
        );
        if (findCurrentStageDocuments)
          findCurrentStageDocuments.customDocumentIds.push(data.id);
        documentIds.reverse();
        setCustomDocumentIds(documentIds);
      }
    } catch (error) {
      console.error(buildErrorMessage(error));
    }
  };

  const submitFile = async (file) => {
    if (!file) return;
    const { _links: url } = documentData;

    setLoader(true);
    try {
      let modifiedUrl = null;
      if (url) {
        modifiedUrl = url.UPLOAD_URL.href.replace(
          /=fileName/g,
          `=${file.name}`
        );
      } else {
        modifiedUrl = `${API_RESOURCE_URLS.getPresignedUrl(
          documentData.id
        )}?fileName=${file.name}`;
      }

      const response = await API.get(modifiedUrl);
      const { data } = response;
      const { presignedUrl, _links: path } = data;

      if (presignedUrl && file) {
        await axios.put(presignedUrl, file, {
          headers: {
            'Content-Type': file.type,
          },
        });

        const acknowledgeResponse = await API.put(
          `${path.ACKNOWLEDGE_TEMPLATE_UPLOAD.href}`,
          { name: file.name }
        );

        if (acknowledgeResponse) {
          setLoader(false);
          showPopup({
            type: MESSAGE_TYPE.SUCCESS,
            contextText: `Document submitted successfully.`,
          });
          handleClose();
          dispatch({
            type: 'update',
            field: 'stageWiseDocuments',
            value: stageWiseDocuments.map((item) => {
              if (item.stage && item.stage.id === currentStage.id) {
                const arr = [...item.customDocuments];
                const findIndex = arr.findIndex(
                  (x) => x.id === acknowledgeResponse.data.id
                );

                if (findIndex !== -1) arr[findIndex] = acknowledgeResponse.data;
                return { ...item, customDocuments: arr };
              }
              return { ...item };
            }),
          });
          setShowTemplatePanel(false);
        }
      }
    } catch (error) {
      setLoader(false);
      setShowTemplatePanel(false);
      handleClose();
      const err = buildErrorMessage(error);
      const statusCode = err.substr(err.length - 3);

      console.error(buildErrorMessage(error));
      if (error.response?.status === 415) {
        setLoader(false);
        showPopup({
          type: MESSAGE_TYPE.FAILURE,
          contextText: 'Unable to upload the file.',
          info: 'Provided format is not supported.',
        });
      } else {
        setLoader(false);
        showPopup({
          type: MESSAGE_TYPE.FAILURE,
          contextText: getErrors(statusCode),
          info: 'Document upload failed.',
        });
      }
    }
  };

  useEffect(() => {
    getStageRequirementsFromPpap();
  }, [ppap.id]);

  useEffect(() => {
    loadAvailableStageWiseDocuments();
  }, []);

  if (ppap && !ppap.id) return children({});

  const renderRemarksElement = () => (
    <Remarks
      disableInput={!isPpapInitiationRemaining && !isApprovalPending}
      comments={comments}
      getRemark={(value) => setRemarks(value)}
    />
  );

  const confirmDelete = () => {
    const tempCustomDocumentIds = [...customDocumentIds];
    const findCurrentStage = tempCustomDocumentIds.find(
      (x) => x.stageId === docToDelete.stage
    );
    if (findCurrentStage) {
      const findIndex = findCurrentStage.customDocumentIds.indexOf(
        docToDelete.id
      );
      if (findIndex !== -1) {
        findCurrentStage.customDocumentIds.splice(findIndex, 1);
      }
    }
    setCustomDocumentIds(tempCustomDocumentIds);

    dispatch({
      type: 'update',
      field: 'stageWiseDocuments',
      value: stageWiseDocuments.map((item) => {
        if (item.stage && item.stage.id === docToDelete.stage) {
          const arr = [...item.customDocuments];
          const findIndex = arr.findIndex((x) => x.id === docToDelete.id);
          if (findIndex !== -1) arr.splice(findIndex, 1);

          return { ...item, customDocuments: arr };
        }
        return { ...item };
      }),
    });
    showPopup({
      type: MESSAGE_TYPE.SUCCESS,
      contextText: 'Document deleted successfully.',
    });
  };

  const stageHeader = (documentsList, setDocumentsList) =>
    requirementLinks?.GET_ATTACHMENT_UPLOAD_URL ? (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span className={styles.stage}>Attachment</span>
        <Button size='small' ignoreExistingClassNames className={styles.addBtn}>
          <>
            <span>+UPLOAD</span>
            <input
              className={styles.uploadFileInput}
              type='file'
              id='upload-file'
              accept='.pdf,.xls,.xlsx,.odt,.ppt,.pptx,.txt,.doc,.docx,.jpg,.jpeg,.png'
              data-testid={`upload-file-${document.id}`}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => {
                const elem = e.target;
                handleFileUpload(e, documentsList, setDocumentsList);
                elem.value = '';
              }}
            />
          </>
        </Button>
      </div>
    ) : (
      <span className={styles.stage}>Attachment</span>
    );

  const renderApprovalAttachmentElement = () => (
    <DocumentTable
      columns={getAttachmentColumns(
        availableAttachmentDocuments,
        setAvailableAttachmentDocuments
      )}
      rows={availableAttachmentDocuments}
    />
  );

  const content = (
    <div className={styles.infoWrapper}>
      {loading && (
        <div className={styles.gridLoader}>
          <GridLoadingSpinner />
        </div>
      )}
      <h4
        className={clsx(
          styles.projectName,
          ppap?.state === PPAP_STATE.TERMINATE && styles.terminate
        )}
      >
        {/* {ppap?.project?.name}  */}
      </h4>
      {systemPpapLevel && systemPpapLevel.value && (
        <>
          {stageWiseDocuments.map(
            ({ stage, targetDate, documents, customDocuments }, index) => {
              const columns = [
                {
                  width: 2,
                  title: '',
                  field: '',
                  render: (_, rowIndex) => rowIndex + 1,
                },
                {
                  width: 130,
                  title: 'Documentation',
                  field: 'name',
                  renderHeader: () => (
                    <>
                      <span>Documentation</span>
                      {!isDisabled && (
                        <span
                          onClick={() => handleOpen(stage, null)}
                          className={styles.addBtn}
                        >
                          + Add
                        </span>
                      )}
                    </>
                  ),
                },
                {
                  width: 300,
                  title: 'Template',
                  field: '',
                  alignment: 'center',
                  render: (row) => {
                    const findCustomeDoc = customDocuments?.findIndex(
                      (x) => x.id === row.id
                    );
                    if (row.templateDocument)
                      return (
                        <Button
                          size='small'
                          ignoreExistingClassNames
                          className={styles.addBtn}
                          type='submit'
                          data-testid={`download-file-${document.id}`}
                          onClick={() => downloadTemplate(row)}
                        >
                          View
                        </Button>
                      );
                    if (findCustomeDoc !== -1 && !isDisabled)
                      return (
                        <Button
                          size='small'
                          ignoreExistingClassNames
                          className={styles.addBtn}
                          type='submit'
                          data-testid={`add-file-${row.id}`}
                          onClick={() => {
                            handleOpen(stage, row);
                            setDocumentData(row);
                          }}
                        >
                          Add
                        </Button>
                      );
                    return null;
                  },
                },
                {
                  width: 100,
                  title: '',
                  field: '',
                  render: (row, rowIndex) => {
                    const ids = [];
                    customDocumentIds.forEach((x) =>
                      x.customDocumentIds.map((n) => ids.push(n))
                    );

                    if (ids.indexOf(row.id) !== -1 && !isDisabled)
                      return (
                        <IconButton
                          color='primary'
                          className={styles.deleteIcon}
                          onClick={() => {
                            setDocToDelete({ stage: stage.id, id: row.id });
                            setIsWarningOpen(true);
                          }}
                        >
                          <DeleteIcon style={{ fontSize: '20px' }} />
                        </IconButton>
                      );
                    return null;
                  },
                },
              ];

              return (
                <div key={stage.id}>
                  <div className={styles.header}>
                    <span className={styles.stage}>{stage.name}*</span>
                    <span className={styles.targetdate}>Target Date</span>
                    <CustomDatePicker
                      disabled={isDisabled}
                      markIfUnselected={highlightMandatoryFields}
                      autoOk
                      inputVariant='outlined'
                      value={targetDate}
                      onChange={(date) => updateTargetDate(date, index)}
                      inputProps={{
                        className: clsx(
                          styles.select,
                          styles.dateInput,
                          isDisabled && styles.disabledDateInput
                        ),
                      }}
                      emptyLabel='dd/mm/yyyy'
                      defaultDate={moment().format(DATE_FORMAT.DD_MM_YYYY)}
                      format='DD/MM/yyyy'
                      data-testid={`date-picker-div-${index + 1}`}
                    />
                  </div>
                  <DocumentTable
                    key={stage.id}
                    columns={columns}
                    rows={documents}
                    customDocuments={customDocuments}
                  />
                </div>
              );
            }
          )}

          {attachment ? (
            <CustomFormGroup
              header={stageHeader(
                availableAttachmentDocuments,
                setAvailableAttachmentDocuments
              )}
              body={renderApprovalAttachmentElement()}
            />
          ) : null}

          {links.terminate ? (
            <>
              <div className={styles.header}>
                <span className={styles.stage}>Assignment</span>
              </div>
              <div className={styles.content} id='scrollToBlock'>
                <div
                  style={{ padding: '0.5em' }}
                  className={styles.documentsContainer}
                >
                  <div className={styles.formRow}>
                    <label className={styles.label}>R&#64;R Waiver*</label>
                    <CustomSelect
                      name='r-and-r-waiver'
                      isDisabled={isDisabled}
                      markIfUnselected={highlightMandatoryFields}
                      options={yesAndNoOptions}
                      className={clsx(styles.select, styles.sel1)}
                      value={rAndRWaiver}
                      menuPosition='fixed'
                      onChange={(selection) => {
                        dispatch({
                          type: 'update',
                          field: 'rAndRWaiver',
                          value: selection,
                        });
                        if (selection.value) removeStage('R@R');
                        else addStage('R@R');
                        if (highlightMandatoryFields)
                          console.log(
                            selection.currentTarget.parentNode('.css')
                          );
                      }}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : null}

          <CustomFormGroup header='Remarks' body={renderRemarksElement()} />

          {isPopupOpen && (
            <DocumentsModal
              isPopupOpen={isPopupOpen}
              handleClose={handleClose}
              sendDocData={sendDocData}
              submitFile={submitFile}
              isTemplatePanelOpen={showTemplatePanel}
            />
          )}
        </>
      )}
      {isTerminatePopupOpen && (
        <TerminateModal
          isPopupOpen={isTerminatePopupOpen}
          handleClose={handleTerminatePopupClose}
          terminatePpap={handleTerminatePpap}
        />
      )}
      <WarningModal
        open={isWarningOpen}
        handleClose={() => setIsWarningOpen(false)}
        confirmDelete={() => confirmDelete()}
      />
      {isPopupDeleteOpen && (
        <DeleteModal
          isPopupDeleteOpen={isPopupDeleteOpen}
          handleDeleteClose={handleDeleteClose}
          confirmAttachmentDelete={() =>
            confirmAttachmentDelete(setAvailableAttachmentDocuments)
          }
        />
      )}
    </div>
  );

  const sqEnggActionButtons = {
    secondaryActions: [
      {
        name: 'TERMINATE',
        classNames: { btn: styles.terminateButton },
        actionFn: () => handleTerminatePopupOpen(),
        showButton: !isDisabled,
      },
      {
        name: 'SAVE AS DRAFT',
        classNames: { btn: styles.saveAsDraftButton },
        actionFn: () => handleSaveAsDraftPpap(),
        showButton: !isDisabled,
      },
    ],
    primaryAction: {
      name: 'INITIATE',
      actionFn: () => runPreSubmissionChecks() && handleInitiatePpap(),
      showButton: !isDisabled,
      isDisable: !mandatoryFields,
    },
  };

  const sqLeadActionButtons = {
    secondaryActions: [
      {
        name: 'REVISE',
        classNames: { btn: styles.reviseButton },
        actionFn: () => handleRevise(),
        showButton: requirementLinks && requirementLinks.REVISE,
      },
    ],
    primaryAction: {
      name: 'APPROVE',
      actionFn: () => handleApprove(),
      showButton: requirementLinks && requirementLinks.APPROVE,
    },
  };

  return children({
    content,
    actionButtons: isApprovalPending
      ? sqLeadActionButtons
      : sqEnggActionButtons,
  });
}

ProcessDocument.propTypes = {
  ppap: PropTypes.any,
  partCategory: PropTypes.any,
  systemPpapLevel: PropTypes.any,
  overwritePpapLevel: PropTypes.any,
  ppapReason: PropTypes.any,
  highlightMandatoryFields: PropTypes.bool,
  setHighlightMandatoryFields: PropTypes.func,
  reloadData: PropTypes.func,
  children: PropTypes.func.isRequired,
};

function TerminateModal({ isPopupOpen, handleClose, terminatePpap }) {
  return (
    <Dialog
      open={isPopupOpen}
      className={styles.popContainer}
      classes={{
        paper: styles.popupBox,
      }}
      data-testid='terminate-popup'
    >
      <>
        <DialogTitle>
          <span className={styles.title}>
            <span className={styles.txt}>Termination confirmation</span>
          </span>
        </DialogTitle>
        <DialogContent className={styles.popupContent}>
          <span style={{ lineHeight: '1.5em' }}>
            Are you sure you would like to terminate?
            <br />
            Once confirmed you will not able to revert back
          </span>
        </DialogContent>
        <DialogActions>
          <Button
            className={clsx(styles.actionButton, styles.transparentButton)}
            onClick={handleClose}
          >
            CANCEL
          </Button>
          <Button
            className={clsx(styles.actionButton, styles.primaryActionButton)}
            variant='primary'
            onClick={(e) => {
              e?.preventDefault();
              handleClose();
              terminatePpap();
            }}
          >
            CONFIRM
          </Button>
        </DialogActions>
      </>
    </Dialog>
  );
}

TerminateModal.propTypes = {
  isPopupOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  terminatePpap: PropTypes.func.isRequired,
};

export default ProcessDocument;

function DeleteModal({
  isPopupDeleteOpen,
  handleDeleteClose,
  confirmAttachmentDelete,
}) {
  return (
    <Dialog
      open={isPopupDeleteOpen}
      className={styles.popContainer}
      classes={{
        paper: styles.popupBox,
      }}
      data-testid='reset-popup'
    >
      <>
        <DialogTitle>
          <span className={styles.title}>
            <span className={styles.txt}>Confirm Delete</span>
          </span>
        </DialogTitle>
        <DialogContent className={styles.content}>
          <span>Are you sure you want to delete the file?</span>
        </DialogContent>
        <DialogActions>
          <Button
            className={clsx(styles.actionButton, styles.transparentButton)}
            onClick={handleDeleteClose}
          >
            CANCEL
          </Button>
          <Button
            className={clsx(styles.actionButton, styles.primaryActionButton)}
            variant='primary'
            onClick={(e) => {
              e?.preventDefault();
              handleDeleteClose();
              confirmAttachmentDelete();
            }}
            data-testid='delete-confirm'
          >
            YES
          </Button>
        </DialogActions>
      </>
    </Dialog>
  );
}

DeleteModal.propTypes = {
  isPopupDeleteOpen: PropTypes.bool.isRequired,
  handleDeleteClose: PropTypes.func.isRequired,
  confirmAttachmentDelete: PropTypes.func.isRequired,
};
