/* eslint-disable object-shorthand */
/* eslint-disable prefer-const */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import clsx from 'clsx'
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import { Button } from '@tmlconnected/avant-garde-components-library';
import styles from "./DocumentsModal.module.css";
import { ValidatingTextField } from '../../FormComponents'

function DocumentsModal({ isPopupOpen, handleClose, sendDocData, submitFile, isTemplatePanelOpen }) {
  const [documentName, setDocumentName] = useState(null);
  const [highlightMandatoryFields, setHighlightMandatoryFields] = useState(false);
  const [resetAllVisitedFields, setResetAllVisitedFields] = useState(false);
  const [showTemplatePanel, setShowTemplatePanel] = React.useState(false);
  const [file, setFile] = React.useState(null)

  const getSelectedFields = () => ({
    name: documentName,
  });

  const resetState = () => {
    setHighlightMandatoryFields(null);
    setResetAllVisitedFields(false);
  }

  const validateFields = (fields) => {
    const requiredFields = {...fields}
    const hasMissingRequiredFields = Object.values(requiredFields).some(
      (field) => !field
    );
   
    if (hasMissingRequiredFields) {
      return false;
    }
    return true;
  };

  const runPreSubmissionChecks = () => {
    const selectedFields = getSelectedFields();
    const areFieldsValid = validateFields(selectedFields);
    
    if (!areFieldsValid) {
      setHighlightMandatoryFields(true);
      return false;
    }
    return true;
  };

  const handleSubmitData = async () => {
    const isValid = runPreSubmissionChecks();
    const selectedFields = getSelectedFields();
    
    if(isValid){
      sendDocData(selectedFields);
      setShowTemplatePanel(true);
    } 
  }

  const handleSubmitTemplate = async () => {
    submitFile(file);
    handleClose();
    setShowTemplatePanel(false);
    setFile(null);
    resetState();
  }

useEffect(() => {
  if (resetAllVisitedFields)
      resetState();
}, [resetAllVisitedFields])  

useEffect(() => {
  setShowTemplatePanel(isTemplatePanelOpen);
}, [isTemplatePanelOpen])  

return (
      <Dialog
        open={isPopupOpen}
        maxWidth='sm'
        fullWidth
      >
        <>
          <DialogTitle>
            <span className={styles.title}>
              <span className={styles.txt}>Additional Document</span>
            </span>
          </DialogTitle>
          <DialogContent>
            {!showTemplatePanel && (  
            <div className={styles.formRow} style={{background: '#e5e0e0',padding: '30px 10px'}}>
                <label className={styles.label}>Name*</label>
                <ValidatingTextField
                    style={{width:'60%'}}
                    isMandatory
                    validationFn={(value) => value.length > 0}
                    markIfEmpty={highlightMandatoryFields}
                    resetAllVisitedFields={resetAllVisitedFields}
                    validationHelperText="Name is required"
                    variant="outlined"
                    size="small"
                    value={documentName}
                    onChange={(e) => setDocumentName(e.target.value)}
                    placeholder="Insert document name"
                    className={styles.textField}
                    inputProps={{
                        className: styles.textInput,
                        "data-testid": "doc-name-input",
                    }}
                    FormHelperTextProps={{
                        className: styles.helperText,
                    }}
                />
            </div>
            )}

            {showTemplatePanel && (    
              <div className={styles.formRow} style={{background: '#e5e0e0',padding: '30px 10px'}}>
                  <label className={styles.label}>Template</label>
                  {!file && 
                    <div style={{flexGrow: 1}}>
                      <Button
                        size="small"
                        ignoreExistingClassNames
                        className={styles.smallBtn}
                      >
                        <>
                          <span className={styles.blueText}>UPLOAD</span>
                          <input
                            className={styles.uploadFileInput}
                            type="file"
                            id="upload-file"
                            accept=".pdf,.xls,.xlsx,.odt,.ppt,.pptx,.txt,.doc,.docx,.jpg,.jpeg,.png"
                            data-testid={`upload-file-${document.id}`}
                            onClick={e => e.stopPropagation()}
                            onChange={e => {
                              const elem = e.target;
                              setFile(e.target.files[0]);
                              elem.value = '';
                            }}
                          />
                        </>
                      </Button>
                    </div>
                  }

                  {file && 
                    <div className={styles.templateBlock}>
                      <span className={styles.blueText}>{file ? file.name : ''}</span>
                      <IconButton
                        color="primary"
                        className={styles.deleteIcon}
                        onClick={() => {
                          setFile(null);
                          
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  }
                </div>
            )}
          </DialogContent>
          <DialogActions style={{padding: '10px 25px'}}>
            {!showTemplatePanel && ( 
              <>
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
                    // handleClose();
                    // onConfirm({documents: mandatoryList, stage: stage});
                    runPreSubmissionChecks();
                    handleSubmitData();
                  }}
                >
                  SAVE AND NEXT
                </Button>
              </>
            )}

            {showTemplatePanel && (    
              <Button
              className={clsx(
                styles.actionButton,
                styles.primaryActionButton,
              )}
              variant="primary"
              onClick={(e) => {
                e?.preventDefault();
                handleSubmitTemplate();
                }}
              data-testid='save-confirm'
            >
              SUBMIT
            </Button>
            )}
          </DialogActions>
        </>
      </Dialog>
    )
  }

  DocumentsModal.propTypes = {
    isPopupOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    sendDocData: PropTypes.func.isRequired,
    submitFile: PropTypes.func.isRequired,
    isTemplatePanelOpen: PropTypes.bool
}  

export default DocumentsModal;