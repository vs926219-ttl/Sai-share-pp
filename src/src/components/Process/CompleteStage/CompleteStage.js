/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-useless-escape */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
import axios from 'axios';
import { Button } from '@tmlconnected/avant-garde-components-library';
import styles from './CompleteStage.module.css';
import { CustomDatePicker, CustomFormGroup, CustomSelect, ValidatingTextField } from '../../FormComponents';
import { DATE_FORMAT, stateStringMap, MESSAGE_TYPE, DISPLAY_MESSAGES } from '../../../constants';
import { API } from '../../../apis/api';
import { usePopupManager } from '../../../providers/PopupManager/PopupManager';
import { buildErrorMessage } from '../../../apis/calls';
import { DocumentTable, Remarks } from '../..';

function CompleteStage({
    ppap,
    highlightMandatoryFields,
    setHighlightMandatoryFields,
    reloadData,
    comingState
}) {
    const INPUT_TYPES = {
        INTEGER: 'integer',
        BOOLEAN: 'boolean',
        NUMBER: 'number'
    }
    const yesAndNoOptions = [
        { value: true, label: "Yes" },
        { value: false, label: "No" },
    ];

    const { showInternalError, showPopup } = usePopupManager();
    const { project, state, _links: links } = ppap;

    const [targetDate, setTargetDate] = useState(null);
    const [stageDocuments, setStageDocuments] = useState([]);
    const [additionalStageDocuments, setAdditionalStageDocuments] = useState([]);
    const [stageAttributies, setStageAttributes] = useState([]);
    const [additionalAttributies, setAdditionalAttributes] = useState([]);
    const [loading, setLoader] = useState(false);
    const [comments, setComments] = useState([]);
    const [stageLinks, setStageLinks] = useState({});
    const [remark, setRemark] = useState('');
    const [hover, setHover] = useState({ isHover: false, id: null });

    const disabledRemark = !!ppap.state;
    
    const onHover = (id)=> {
      setHover({ isHover: true, id });
    };
    const onLeave = () => {
      setHover({ isHover: false });
    };

    const stageHeader = () => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>{stateStringMap[comingState]}</span>
    
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

      const loadStageData = async () => {
		try {
			const response = await API.get(links[comingState].href,
			);

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
          documentName: document.document.name
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
        if (internalDocumentRequirements)
          getDocuments(internalDocumentRequirements, setAdditionalStageDocuments)
    
        getAttributes(externalAttributes, externalAttrsSchema, setStageAttributes)
        if (internalAttrsSchema)
          getAttributes(internalAttributes, internalAttrsSchema, setAdditionalAttributes)
        getRemarksAndReview(stageDataFromApi.remarks, stageDataFromApi.reviews);
        setStageLinks(stageLinksFromApi)
      }

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
          const err = buildErrorMessage(error);
          const statusCode = err.substr(err.length - 3);
          
          console.error(buildErrorMessage(error));
          setLoader(false);
          showPopup({
            type: MESSAGE_TYPE.FAILURE,
            contextText: getErrors(statusCode),
            info: "Document download failed.",
          });
        }
      }

      const stageAtrributesColumns = [
        {
          width: 2,
          title: "",
          field: "",
          render: (_, rowIndex) => rowIndex + 1,
        },
        {
          width: 150,
          title: "Parameters",
          field: "description",
        },
        {
          title: "Details",
          field: "",
          render: (row) => {
            const { field, value, type, required } = row;
    
            if (type === INPUT_TYPES.NUMBER)
              return (
                <ValidatingTextField
                  isDisabled
                  disabled
                  validationFn={(count) => {
                    if (required) return count > 0
                    return true
                  }}
                  markIfEmpty={required && highlightMandatoryFields}
                  variant="outlined"
                  size="small"
                  type="number"
                  value={value}
                  onKeyPress={(e) => {
                    if (e?.key === '-' || e?.key === '+') {
                      e?.preventDefault();
                    }
                  }}
                  className={styles.textField}
                  inputProps={{
                    className: styles.disabledDateInput,
                    step: 1,
                    min: 0,
                    "data-testid": `${field}-input`,
                  }}
                />
              )
            return (
              <CustomSelect
                name={`${field}-select`}
                isDisabled
                markIfUnselected={required && highlightMandatoryFields}
                options={yesAndNoOptions}
                className={clsx(styles.select, styles.sel1)}
                value={value}
                menuPosition="fixed"
            />
            )
          }
        }, 
      ]

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
          title: 'Download',
          field: '',
          render: row => {
            const { _links: links, document, submission } = row;
            if (links && links.DOWNLOAD)
              return (
                <div
                className={styles.hoverWrapper}
                onMouseEnter={() => onHover(submission.id)}
                onMouseLeave={onLeave}
              >
                <Button
                  size="small"
                  ignoreExistingClassNames
                  className={clsx(styles.download)}
                  type="submit"
                  data-testid={`download-file-${document.id}`}
                  onClick={() => downloadFile(row)}
                >
                 <span  className={styles.shortName}>{submission.documentName}</span>
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
          alignment: 'center',
          render: row => {
            const { _links: links } = row;
              if (links && links.DOWNLOAD)
            return <span style={{ color: '#18A523' }}>Complete</span>
          return <span style={{ color: '#707070' }}>Pending</span>
          }
        },
        {
          width: 120,
          title: 'Updated at',
          field: '',
          alignment: 'center',
          render: row => {
            const { _links: links, submission } = row;
            return <span>{moment(submission?.uploadedAt).format("DD/MM/YYYY")}</span>
          }
        }
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
                  isDisabled
                  disabled
                  validationFn={(count) => {
                    if (required) return count > 0
                    return true
                  }}
                  markIfEmpty={required && highlightMandatoryFields}
                  variant="outlined"
                  size="small"
                  type="number"
                  value={value}
                  onKeyPress={(e) => {
                    if (e?.key === '-' || e?.key === '+') {
                      e?.preventDefault();
                    }
                  }}
                  className={styles.textField}
                  inputProps={{
                    className: styles.disabledDateInput,
                    step: 1,
                    min: 0,
                    "data-testid": `${field}-input`,
                  }}
                />
              )
            return (
              <CustomSelect
                name={`${field}-select`}
                isDisabled
                markIfUnselected={required && highlightMandatoryFields}
                options={yesAndNoOptions}
                className={clsx(styles.select, styles.sel1)}
                value={value}
                menuPosition="fixed"
              />
            )
          }
        }, 
      ]

      const renderStageDocumentsElement = () => (
        <>
          <DocumentTable
            columns={getStageColumns(stageDocuments, setStageDocuments)}
            rows={stageDocuments}
          />
          <DocumentTable
            columns={stageAtrributesColumns}
            rows={stageAttributies}
          />
        </>
      )

      const renderApprovalAttachmentElement = () => (
        <DocumentTable
          columns={getStageColumns(additionalStageDocuments, setAdditionalStageDocuments)}
          rows={additionalStageDocuments}
        />
      )

      const renderAdditionalDetailsElement = () => (
        <DocumentTable
          columns={additionalAttributesColumns}
          rows={additionalAttributies}
        />
      )

      const renderRemarksElement = () => (
        <Remarks
          disableInput={disabledRemark}
          comments={comments}
          getRemark={(value) => setRemark(value)}
        />
      )

      useEffect(() => {
        if(ppap.id)
        getStageData();
      }, [ppap.id])

    return (
        <div className={styles.infoWrapper}>
        
        <CustomFormGroup header={stageHeader()} body={renderStageDocumentsElement()} />
        {
            additionalAttributies && additionalAttributies.length
            ? <CustomFormGroup header='Additional Details' body={renderAdditionalDetailsElement()} />
            : null
        }
        {
            additionalStageDocuments && additionalStageDocuments.length
            ? <CustomFormGroup header='Approval Attachment' body={renderApprovalAttachmentElement()} />
            : null
        }
        <CustomFormGroup header='Remarks' body={renderRemarksElement()} />
        </div>
    );
}

CompleteStage.propTypes = {
    ppap: PropTypes.object,
    highlightMandatoryFields: PropTypes.bool,
    setHighlightMandatoryFields: PropTypes.func,
    reloadData: PropTypes.func,
    comingState: PropTypes.string
  }

  
export default CompleteStage;
