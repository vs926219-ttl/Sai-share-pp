/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-useless-escape */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
import axios from 'axios';
import DeleteIcon from '@material-ui/icons/Delete';
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from "@material-ui/core";
import { Button } from '@tmlconnected/avant-garde-components-library';
import styles from './ProcessStage.module.css';
import { DATE_FORMAT, DISPLAY_MESSAGES, MESSAGE_TYPE, PPAP_STATE, stateStringMap } from '../../../constants';
import { API } from '../../../apis/api';
import { buildErrorMessage } from '../../../apis/calls';
import { usePopupManager } from '../../../providers/PopupManager/PopupManager';
import { CustomDatePicker, CustomFormGroup, CustomSelect, ValidatingTextField } from '../../FormComponents';
import { DocumentTable, Remarks, GridLoadingSpinner } from '../..';

function ProcessStage({
  ppap,
  highlightMandatoryFields,
  setHighlightMandatoryFields,
  reloadData,
  state,
  children
}) {
  
  const { showInternalError, showPopup } = usePopupManager();
  const [targetDate, setTargetDate] = useState(null);
  const [stageDocuments, setStageDocuments] = useState([]);
  const [additionalStageDocuments, setAdditionalStageDocuments] = useState([]);
  const [stageAttributies, setStageAttributes] = useState([]);
  const [additionalAttributies, setAdditionalAttributes] = useState([]);
  const [stageLinks, setStageLinks] = useState({});
  const [loading, setLoader] = useState(false);
  const [remark, setRemark] = useState('');
  const [comments, setComments] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);  
  const [deleteInfo, setDeleteInfo] = useState({deleteUrl:null, documentsList: null, setDocumentsList: null}); 
  const isSubmitPending = !!stageLinks.SUBMIT;
  const isReviewPending = !!(stageLinks.APPROVAL || stageLinks.REVISION)

  const handleOpen = () => setIsPopupOpen(true);
  const handleClose = () => {
    setIsPopupOpen(false);
    setDeleteInfo({deleteUrl:null, documentsList: null, setDocumentsList: null});
  };
  
  const [hover, setHover] = useState({ isHover: false, id: null });
  const onHover = (id)=> {
    setHover({ isHover: true, id });
  };
  const onLeave = () => {
    setHover({ isHover: false });
  };

  const confirmDelete = async (setState) => {
   setLoader(true)
    try {
      if(deleteInfo && deleteInfo.deleteUrl){
        const response = await API.delete(deleteInfo.deleteUrl);
        
        if(response) setLoader(false);

        const { data } = response;
        const { document, _links } = data;
       
        const updatedDocuments = deleteInfo.documentsList.map((item) => {
         
          if (item.document.id === document.id)
            return { ...item, _links }
          return { ...item }
        });
      
        deleteInfo.setDocumentsList(updatedDocuments);
        showPopup({
          type: MESSAGE_TYPE.SUCCESS,
          contextText: "Document deleted successfully.",
        });
      }
      setLoader(false)
    } catch (error) {
      console.error(buildErrorMessage(error));
      showPopup({
        type: MESSAGE_TYPE.FAILURE,
        contextText: DISPLAY_MESSAGES.DELETE_FILE,
        info: "Document delete failed.",
        error,
      });
      setLoader(false)
    }
  };

  const INPUT_TYPES = {
    INTEGER: 'integer',
    BOOLEAN: 'boolean',
    NUMBER: 'number'
  }

  const yesAndNoOptions = [
    { value: true, label: "Yes" },
    { value: false, label: "No" },
  ];

  const { project, _links: links } = ppap;
 
  const updateField = (receivedField, value, arr, setState) => {
    const updatedAttributies = arr.map((attribute) => {
      if (attribute.field === receivedField)
        return { ...attribute, value }
      return { ...attribute }
    });

    setState(updatedAttributies)
  }

  const getErrors = (code) => {
    let message = DISPLAY_MESSAGES.STAGE_REQUIREMENT_SUBMIT_FAILURE;

    if (code === '401' || code === '403')
      message = DISPLAY_MESSAGES.AUTHORISATION_ERROR
    else if (code === '504')  
      message = DISPLAY_MESSAGES.NETWORK_ERROR
    else if (code === '500' || code === '502' || code === '503')  
      message = DISPLAY_MESSAGES.PRIMARY_ERROR

    return message  
  }
  
  const uploadFile = async (file, row, documentsList, setDocumentsList) => {
    const { _links: documentLinks } = row;
    const api = documentLinks.UPLOAD.href.replace(
      /{documentName}/g,
      file.name,
    );
    setLoader(true);
    try {
      const response = await API.get(api);
      const { data } = response;
      const { presignedUrl, _links: acknowledgeLink } = data;
     
      if (presignedUrl && file) {
        await axios.put(
          presignedUrl,
          file,
          {
            headers: {
              'Content-Type': file.type,
            },
          },
        );

        const acknowledgeResponse = await API.put(acknowledgeLink.ACKNOWLEDGE.href);

        showPopup({
          type: MESSAGE_TYPE.SUCCESS,
          contextText: "Document uploaded successfully.",
        });

        const { data } = acknowledgeResponse;
        const { document, submission, _links } = data;
        if(acknowledgeResponse) setLoader(false);
        const updatedStageDocuments = documentsList.map((item) => {
          if (item.document.id === document.id)
            return { ...item, submission, _links }
          return { ...item }
        })
        setDocumentsList(updatedStageDocuments)
      }
    } catch (error) {
      const err = buildErrorMessage(error);
      const statusCode = err.substr(err.length - 3);
      
      console.error(buildErrorMessage(error));
      if (error.response?.status === 415) {
        setLoader(false);
				showPopup({
					type: MESSAGE_TYPE.FAILURE,
					contextText: "Unable to upload the file.",
          info: "Provided format is not supported."
				  });
			}else{
        setLoader(false);
        showPopup({
          type: MESSAGE_TYPE.FAILURE,
          contextText: getErrors(statusCode),
          info: "Document upload failed.",
        });
			} 
    }
  };
  const handleFileUpload = (event, row, documentsList, setDocumentsList) => {
    uploadFile(event.target.files[0], row, documentsList, setDocumentsList);
  };

  const downloadTemplate = async (row) => {
    const { document: stageDocument } = row;
    const { _links: links, templateDocument } = stageDocument;
    setLoader(true);
    try {
      const response = await API.get(links.TEMPLATE_DOWNLOAD_URL.href);
      const { presignedUrl } = response.data;
    
      if(presignedUrl){
        const res = await axios.get(
            presignedUrl,
            {
              responseType: 'blob'
            }
          );
         
          const a = document.createElement("a");
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
        info: "Document download failed.",
      });
    }
  }

  const downloadFile = async (row) => {
    const { _links: links, submission } = row;
    const { uploadKey } = submission;
    setLoader(true);
    try {
      const response = await API.get(links.DOWNLOAD.href);
      const { presignedUrl } = response.data;
    
      if(presignedUrl){
        const res = await axios.get(
            presignedUrl,
            {
              responseType: 'blob'
            }
          );

          const a = document.createElement("a");
          const href = window.URL.createObjectURL(res.data);
          a.href = href;
          a.download = submission.documentName;
          a.click();
          setLoader(false);
      }
    } catch (error) {
      console.error(buildErrorMessage(error));
      setLoader(false);
      showPopup({
        type: MESSAGE_TYPE.FAILURE,
        contextText: DISPLAY_MESSAGES.DOWNLOAD_FAIL,
        info: "Document download failed.",
      });
    }
  }

  const getStageColumns = (documentsList, setDocumentsList) => [
		{
			width: 2,
			title: '',
			field: '',
			render: (_, rowIndex) => rowIndex + 1,
		},
		{
			width: 180,
			title: 'Documentation',
			field: 'documentName',
		},
		{
			width: 130,
			title: 'Template',
			field: '',
      render: (row) => {
        const { document } = row;
        const { _links: links, templateDocument } = document
        if (links && links.TEMPLATE_DOWNLOAD_URL)
					return (
							<Button
				      size="small"
				      ignoreExistingClassNames
				      className={styles.smallBtn}
				      type="submit"
				      data-testid={`download-file-${document.id}`}
				      onClick={() => downloadTemplate(row)}
				    >
				      DOWNLOAD
				    </Button>
					);
          return null;
        },
		},
		{
			width: 200,
			title: 'Upload',
			field: '',
			render: (row) => {
				const { _links: links, document, submission} = row;
				if (links && links.UPLOAD)
					return (
						<Button
							size="small"
							ignoreExistingClassNames
							className={styles.smallBtn}
						>
							<>
								<span
									style={{
										width: '4em',
									}}
									className={styles.shortName}
								>
									UPLOAD
								</span>
								<input
									className={styles.uploadFileInput}
									type="file"
									id="upload-file"
									data-testid={`upload-file-${document.id}`}
									accept=".pdf,.xls,.xlsx,.odt,.ppt,.pptx,.txt,.doc,.docx,.jpg,.jpeg,.png"
									onClick={(e) => e.stopPropagation()}
									onChange={(e) => {
										const elem = e.target;
										handleFileUpload(e, row, documentsList, setDocumentsList);
										elem.value = '';
									}}
								/>
							</>
						</Button>
					);

          if (links && links.DOWNLOAD)
          return (
            <div
              className={styles.hoverWrapper}
              onMouseEnter={() => onHover(submission.id)}
              onMouseLeave={onLeave}
            >
              <Button
                className={clsx(styles.download)}
                ignoreExistingClassNames
                size="small"
                type="submit"
                data-testid={`download-file-${document.id}`}
                onClick={() => downloadFile(row)}
              >
                <span className={styles.shortName}>
                  {submission.documentName}
                </span>
              </Button>
              {hover.isHover && hover.id === submission.id && submission.id && (
                <span className={styles.hoverText}>
                  {submission.documentName}
                </span>
              )}
            </div>
          );
        return null;
			},
		},
		{
			width: 120,
			title: 'Status',
			field: '',
			render: (row) => {
				const { _links: links } = row;
				if (links && links.DOWNLOAD)
					return <span style={{ color: '#18A523' }}>Complete</span>;
				return <span style={{ color: '#707070' }}>Pending</span>;
			},
		},
		{
			width: 50,
			title: '',
			field: '',
			alignment: 'center',
			render: (row) => {
				const {_links: links, document} = row;
				if (links && links.DELETE)
					return (
						<IconButton
							color="primary"
							className={styles.deleteIcon}
							onClick={() => {
								setDeleteInfo({
									deleteUrl: links.DELETE.href,
									documentsList,
									setDocumentsList,
								});
								handleOpen();
							}}
							data-testid={`delete-file-${document.id}`}
						>
							<DeleteIcon style={{ fontSize: 20 }} />
						</IconButton>
					);
				return null;
			},
		},
	];

  const stageAtrributesColumns = [
    {
      width: 2,
      title: "",
      field: "",
      render: (_, rowIndex) => rowIndex + 1,
    },
    {
      width: 250,
      title: "Parameters",
      field: "description",
    },
    {
      width: 300,
      title: "Details",
      field: "",
      render: (row) => {
        const { field, value, type, required } = row;

        if (type === INPUT_TYPES.NUMBER)
          return (
            <ValidatingTextField
              isDisabled={!isSubmitPending}
              disabled={!isSubmitPending}
              validationFn={(count) => {
                if (required) return count > 0
                return true
              }}
              markIfEmpty={required && highlightMandatoryFields}
              variant="outlined"
              size="small"
              type="number"
              value={value}
              onChange={(e) => updateField(field, e.target.value, stageAttributies, setStageAttributes)}
              onKeyPress={(e) => {
                if (e?.key === '-' || e?.key === '+') {
                  e?.preventDefault();
                }
              }}
              className={styles.textField}
              inputProps={{
                className: clsx(
                  styles.input,
                  !isSubmitPending && styles.disabledDateInput
                ),
                step: 1,
                min: 0,
                "data-testid": `${field}-input`,
              }}
            />
          )
        return (
          <CustomSelect
            name={`${field}-select`}
            isDisabled={!isSubmitPending}
            markIfUnselected={required && highlightMandatoryFields}
            options={yesAndNoOptions}
            className={clsx(styles.select, styles.sel1)}
            value={value}
            menuPosition="fixed"
            onChange={(selection) => updateField(field, selection, stageAttributies, setStageAttributes)}
          />
        )
      }
    }, 
  ]

  const additionalAttributesColumns = [
    {
      width: 2,
      title: "",
      field: "",
      render: (_, rowIndex) => rowIndex + 1,
    },
    {
      width: 150,
      title: "",
      field: "description",
    },
    {
      title: "",
      field: "",
      render: (row) => {
        const { field, value, type, required } = row;

        if (type === INPUT_TYPES.NUMBER)
          return (
            <ValidatingTextField
              isDisabled={!isReviewPending}
              disabled={!isReviewPending}
              validationFn={(count) => {
                if (required) return count > 0
                return true
              }}
              markIfEmpty={required && highlightMandatoryFields}
              variant="outlined"
              size="small"
              type="number"
              value={value}
              onChange={(e) => updateField(field, e.target.value, additionalAttributies, setAdditionalAttributes)}
              onKeyPress={(e) => {
                if (e?.key === '-' || e?.key === '+') {
                  e?.preventDefault();
                }
              }}
              className={styles.textField}
              inputProps={{
                className: clsx(
                  styles.textInput,
                  !isReviewPending && styles.disabledDateInput
                ),
                step: 1,
                min: 0,
                "data-testid": `${field}-input`,
              }}
            />
          )
        return (
          <CustomSelect
            name={`${field}-select`}
            isDisabled={!isReviewPending}
            markIfUnselected={required && highlightMandatoryFields}
            options={yesAndNoOptions}
            className={clsx(styles.select, styles.sel1)}
            value={value}
            menuPosition="fixed"
            onChange={(selection) => updateField(field, selection, additionalAttributies, setAdditionalAttributes)}
          />
        )
      }
    }, 
  ]

  const getMandatoryFields = (attributes) => {
    const fields = attributes.reduce(
      (prevAttribute, currentAttribute) => {
        const { field, value, type } = currentAttribute;
        if (type === INPUT_TYPES.BOOLEAN)
          return {
            ...prevAttribute,
            [field]:
              value?.value === true || value?.value === false
                ? value.value
                : null,
          };
        return { ...prevAttribute, [field]: Number(value) || null };
      },
      {},
    );

    return fields;
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

  const selectedField = getMandatoryFields(stageAttributies);
	const mandatoryFields = validateFields(selectedField);

  const runPreSubmissionChecks = () => {
		const selectedFields = getMandatoryFields(stageAttributies);
		const areFieldsValid = validateFields(selectedFields);

		if (!areFieldsValid) {
			setHighlightMandatoryFields(true);
			const el = document.querySelector('#scrollToBlock');
			el?.scrollIntoView();
			return false;
		}
		return true;
	};

  const handleSaveAsDraft = async () => {
    const attributes = isSubmitPending ? stageAttributies : additionalAttributies;
    const selectedFields = getMandatoryFields(attributes);

    try {
      await API.patch(stageLinks.DRAFT.href, {
        remark,
        attributes: { ...selectedFields }
      });
      showPopup({
        type: MESSAGE_TYPE.SUCCESS,
        contextText: `${stateStringMap[state]} stage has been saved in draft state.`,
      });
      setHighlightMandatoryFields(false);
      reloadData();
    } catch (error) {
      console.error(buildErrorMessage(error));
      showPopup({
        type: MESSAGE_TYPE.FAILURE,
        contextText: DISPLAY_MESSAGES.STAGE_REQUIREMENT_SUBMIT_FAILURE,
        info: `${stateStringMap[state]} stage Submission failed.`,
        error,
      });
    }
  }

  const handleSubmitStageRequirement = async () => {
    const selectedFields = getMandatoryFields(stageAttributies);

    try {
      await API.post(stageLinks.SUBMIT.href, {
        remark,
        attributes: { ...selectedFields }
      });
      showPopup({
        type: MESSAGE_TYPE.SUCCESS,
        contextText: `${stateStringMap[state]} stage has been submitted successfully.`,
      });
      setHighlightMandatoryFields(false);
      reloadData();
    } catch (error) {
      console.error(buildErrorMessage(error));
      if (
				error.response.data[0].message ===
				'#/OpenIssuesClosed: false is not a valid enum value'
			) {
				showPopup({
					type: MESSAGE_TYPE.FAILURE,
					contextText: DISPLAY_MESSAGES.STAGE_REQUIREMENT_SUBMIT_FAILURE,
					info: 'Please resolve all open issues before submitting the PPAP.',
				});
			} else {
				showPopup({
					type: MESSAGE_TYPE.FAILURE,
					contextText: 'Unable to submit.',
					info: `${stateStringMap[state]} stage Submission failed.`,
					error,
				});
			}
    }
  }

  
  const handleReviseStage = async () => {
    const selectedFields = getMandatoryFields(additionalAttributies);

    try {
      await API.post(stageLinks.REVISION.href,{
        remark,
        attributes: { ...selectedFields }
      });
      showPopup({
        type: MESSAGE_TYPE.SUCCESS,
        contextText: `${stateStringMap[state]} has been revised successfully`,
      });
      setHighlightMandatoryFields(false);
      reloadData();
    } catch (error) {
      console.error(buildErrorMessage(error));
      showPopup({
        type: MESSAGE_TYPE.FAILURE,
        contextText: DISPLAY_MESSAGES.PIST_APPROVAL_FAILURE,
        info: `${stateStringMap[state]} revision failed.`,
        error,
      });
    }
  }

  const selectedSqField = getMandatoryFields(additionalAttributies);
	const mandatorySqFields = validateFields(selectedSqField);

  const handleApproval = async() => {
    console.log('here1')
    const selectedFields = getMandatoryFields(additionalAttributies);

    try {
      await API.post(stageLinks.APPROVAL.href, {
        remark,
        attributes: { ...selectedFields }
      });
     showPopup({
      type: MESSAGE_TYPE.SUCCESS,
      contextText: `${stateStringMap[state]} stage has been approved successfully.`,
     });
     setHighlightMandatoryFields(false);
     reloadData();
     } catch (error) {
     console.error(buildErrorMessage(error));
     showPopup({
      type: MESSAGE_TYPE.FAILURE,
      contextText: DISPLAY_MESSAGES.STAGE_REQUIREMENT_SUBMIT_FAILURE,
      info: `${stateStringMap[state]} stage Submission failed.`,
      error,
    });
  }
}

  const loadStageData = async () => {
		try {
      const response = await API.get(links[state].href);
      

			const { data } = response;
      
			return data;
		} catch (error) {
			showInternalError(error);
			console.error(buildErrorMessage(error));
			return {};
		}
	};

  const getDocuments = (documents, setState) => {
    const updatedDocuments = documents.map((document) => ({
      ...document,
      documentName: document.document.name,
    }));
    
    setState(updatedDocuments);
  }

  const getAttributes = (attributes = {}, attributesSchema, setState) => {
    const { properties, required } = attributesSchema;
    if (properties) {
      const attributiesFromApi = Object.entries(properties).map((prop) => {
        const [key, value] = prop;
        const isKeyRequired = required.find((parameter) => key === parameter);
        const attributeValue =
          typeof attributes[key] === 'number' ||
          typeof attributes[key] === 'boolean'
            ? attributes[key]
            : null;
        
        if (value.type === INPUT_TYPES.BOOLEAN) {
          const [yes, no] = yesAndNoOptions;
          let newVal = null;
          if (attributeValue === true)
            newVal = yes;
          if (attributeValue === false)
            newVal = no;
          
          return {
            ...value,
            field: key,
            value: newVal,
            required: !!isKeyRequired,
            description: isKeyRequired ? `${value.description} *` : value.description,
          };
        }
        
        return {
          ...value,
          field: key,
          value: attributeValue || "",
          required: !!isKeyRequired,
          description: isKeyRequired ? `${value.description} *` : value.description,
        };
      });
  
      setState(attributiesFromApi);
    }
  }

  const getRemarksAndReview = (remarks = [], reviews = []) => {
    const commentsFromApi = [...remarks, ...reviews];
    commentsFromApi.sort((a, b) => a.createdAt < b.createdAt ? 1 : -1);
    setComments(commentsFromApi)
  }

  const getStageData = async () => {
    const stageDataFromApi = await loadStageData();
    const {
      targetDate: targetDateFromApi,
      externalDocumentRequirements,
      internalDocumentRequirements,
      externalAttributes,
      externalAttrsSchema,
      internalAttributes,
      internalAttrsSchema,
      _links: stageLinksFromApi
    } = stageDataFromApi;
    
    setTargetDate(moment(targetDateFromApi).format(DATE_FORMAT.ISO))
    getDocuments(externalDocumentRequirements, setStageDocuments)
    if (internalDocumentRequirements && internalDocumentRequirements.length)
      getDocuments(internalDocumentRequirements, setAdditionalStageDocuments)

    getAttributes(externalAttributes, externalAttrsSchema, setStageAttributes)
    if (internalAttrsSchema)
      getAttributes(internalAttributes, internalAttrsSchema, setAdditionalAttributes)
    getRemarksAndReview(stageDataFromApi.remarks, stageDataFromApi.reviews);
    setStageLinks(stageLinksFromApi)
  }
 
  useEffect(() => {
    if(ppap.id && state){
      getStageData();
    }
  }, [ppap.id, state])

  if (ppap && !ppap.id)
    return children(null);

  const renderStageDocumentsElement = () => (
    <>
      <DocumentTable
        columns={getStageColumns(stageDocuments, setStageDocuments)}
        rows={stageDocuments}
      />
      <DocumentTable
        columns={stageAtrributesColumns}
        rows={stageAttributies}
        isInputBlock
      />
    </>
  )

  const renderAdditionalDetailsElement = () => (
    <DocumentTable
      columns={additionalAttributesColumns}
      rows={additionalAttributies}
    />
  )

  const renderApprovalAttachmentElement = () => (
    <DocumentTable
      columns={getStageColumns(additionalStageDocuments, setAdditionalStageDocuments)}
      rows={additionalStageDocuments}
    />
  )

  const stageHeader = () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span>{stateStringMap[state]}</span>
      <span className={styles.targetdate}>Target Date</span>

      <CustomDatePicker
        disabled
        autoOk
        inputVariant="outlined"
        value={targetDate}
        inputProps={{
          className: clsx(
            styles.select,
            styles.dateInput,
            styles.disabledDateInput
          ),
        }}
        helperText=''
        emptyLabel="dd/mm/yyyy"
        defaultDate={moment().format(DATE_FORMAT.DD_MM_YYYY)}
        format="DD/MM/yyyy"
      />
    </div>
  )

  const renderRemarksElement = () => (
    <Remarks
      disableInput={!isSubmitPending && !isReviewPending}
      comments={comments}
      getRemark={(value) => setRemark(value)}
    />
  )

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
          state === PPAP_STATE.TERMINATE && styles.terminate
        )}
      >
        {/* {project?.name} */}
      </h4>
      {ppap.id &&
      <>
      <CustomFormGroup header={stageHeader()} body={renderStageDocumentsElement()} />
      {
        additionalAttributies && additionalAttributies.length
          ? <CustomFormGroup header='Designated Tool / Process details' body={renderAdditionalDetailsElement()} />
          : null
      }
      {
        additionalStageDocuments && additionalStageDocuments.length
          ? <CustomFormGroup header='Approval Attachment' body={renderApprovalAttachmentElement()} />
          : null
      }
      <CustomFormGroup header='Remarks' body={renderRemarksElement()} />
      </>
    }
      <DeleteModal
        isPopupOpen={isPopupOpen}
        handleClose={handleClose}
        confirmDelete={() => confirmDelete(setStageDocuments)}
      />
    </div>
  );
    
  const supplierActionButtons = {
    secondaryActions: [
      {
        name: 'SAVE AS DRAFT',
        classNames: { btn: styles.saveAsDraftButton },
        actionFn: () => handleSaveAsDraft(),
        showButton: !!stageLinks.DRAFT
      }
    ],
    primaryAction: {
      name: 'SUBMIT',
      actionFn: () => runPreSubmissionChecks() && handleSubmitStageRequirement(),
      showButton: !!stageLinks.SUBMIT,
      isDisable: !mandatoryFields
    }
  }

  const sqEngineerActionButtons = {
    secondaryActions: [
      {
        name: 'REVISE',
        classNames: { btn: styles.reviseButton },
        actionFn: () => handleReviseStage(),
        showButton: !!stageLinks.REVISION
      },
      {
        name: 'SAVE AS DRAFT',
        classNames: { btn: styles.saveAsDraftButton },
        actionFn: () => handleSaveAsDraft(),
        showButton: !!stageLinks.DRAFT
      }
    ],
    primaryAction: {
      name: 'APPROVE',
      actionFn: () => handleApproval(),
      showButton: !!stageLinks.APPROVAL,
      isDisable: !mandatorySqFields
    }
  }

  return children({
    content,
    actionButtons: isSubmitPending ? supplierActionButtons : sqEngineerActionButtons
  });
}

ProcessStage.propTypes = {
  ppap: PropTypes.object,
  highlightMandatoryFields: PropTypes.bool,
  setHighlightMandatoryFields: PropTypes.func,
  reloadData: PropTypes.func,
  state: PropTypes.string,
  children: PropTypes.func,
}

export default ProcessStage;


function DeleteModal({ isPopupOpen, handleClose, confirmDelete }) {
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
            <span className={styles.txt}>Confirm Delete</span>
          </span>
        </DialogTitle>
        <DialogContent className={styles.content}>
          <span>
            Are you sure you want to delete the file?
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
              handleClose();
              confirmDelete();
            }}
            data-testid='delete-confirm'
          >
            YES
          </Button>
        </DialogActions>
      </>
    </Dialog>
  )
}

DeleteModal.propTypes = {
  isPopupOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  confirmDelete: PropTypes.func.isRequired
}
