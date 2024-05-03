/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable object-shorthand */
import React, { useState, useEffect, useReducer } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import {
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { Button } from '@tmlconnected/avant-garde-components-library';
import { API_RESOURCE_URLS } from '../../constants';
import { API } from '../../apis/api';
import styles from "./AddDocument.module.css";
import { ValidatingTextField, CustomSelect } from "../FormComponents";

const initialState = {
  name: null,
  type: null,
  stage: null
}

const reducer = (state, action) => {
  switch (action.type) {
    case "update":
      return {
        ...state,
        [action.field]: action.value,
      };
    case "reset":
      return {
        ...state,
        ...initialState,
      };
    default:
      return state;
  }
};

function AddDocument({
  isPopupOpen,
  handleClose,
  sendDocData,
  submitFile,
  ppapStages,
  selectedData,
  deleteDocument,
}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [commodity, setCommodity] = useState(null);
  const [ppaapLevel, setPpaapLevel] = useState(null);
  const [highlightMandatoryFields, setHighlightMandatoryFields] = useState(
    false
  );
  const [resetAllVisitedFields, setResetAllVisitedFields] = useState(false);
  const [showTemplatePanel, setShowTemplatePanel] = React.useState(false);
  const [file, setFile] = React.useState(null);
  const [hover, setHover] = useState({ isHover: false, name: null });
  const onHover = (name) => {
    setHover({ isHover: true, name });
  };
  const onLeave = () => {
    setHover({ isHover: false, name: null });
  };

  const { name, type, stage } = state;

  const resetState = () => {
    setHighlightMandatoryFields(null);
    setResetAllVisitedFields(false);
    dispatch({ type: "reset" });
  };

  const getTypes = [
    { value: "INTERNAL", label: "Internal" },
    { value: "EXTERNAL", label: "External" },
  ];

  const [commodityOptions, setCommodityOptions] = useState([]);

  async function getCommodityData() {
    try {
      const res = await API.get(API_RESOURCE_URLS.getPurchaseCommodity());
      // console.log("getCommodityData", res.data);
      return res.data.map(item => ({
        value: item.id,
        label: item.name
      }));
    } catch (error) {
      console.error("Error fetching commodity data:", error);
      return []; // return an empty array in case of an error
    }
  }
  
 useEffect(() => {
  getCommodityData().then(options => {
    setCommodityOptions(options);
  });
}, []);

const [ppaapLevelOptions, setPpaapLevelOptions] = useState([]);

async function getPpaapLevelData() {
  try {
    const res = await API.get(API_RESOURCE_URLS.getPpaapLevel());
    // console.log("getPpaapLevelData", res.data);
    return res.data.map(item => ({
      value: item.code,
      label: item.level
    }));
  } catch (error) {
    console.error("Error fetching PPAP level data:", error);
    return []; // return an empty array in case of an error
  }
}

useEffect(() => {
  getPpaapLevelData().then(options => {
    setPpaapLevelOptions(options);
  });
}, []);

useEffect(()=>{
  getPpaapLevelData();
})


  const getSelectedFields = () => ({
    name: name,
    type: type,
    stage: stage,
  });

  const validateFields = (fields) => {
    const requiredFields = { ...fields };
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

    if (isValid) {
      sendDocData(selectedFields);
      setShowTemplatePanel(true);
    }
  };

  const handleSubmitTemplate = async () => {
    submitFile(file);
    handleClose();
    setShowTemplatePanel(false);
    setFile(null);
    resetState();
  };

  useEffect(() => {
    if (resetAllVisitedFields) resetState();
  }, [resetAllVisitedFields]);

  const patchData = () => {
    dispatch({ type: "update", field: "name", value: selectedData.name });
    dispatch({
      type: "update",
      field: "type",
      value: getTypes.find((item) => item.value === selectedData.documentType),
    });
    dispatch({
      type: "update",
      field: "stage",
      value: ppapStages.find((item) => item.label === selectedData.stage),
    });
  };

  useEffect(() => {
    if (selectedData) patchData();
  }, [selectedData]);
  
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
            <span className={styles.txt}>
              {selectedData?.name ? "Edit" : "Add"}{" "}
              {showTemplatePanel ? "Template" : "Document"}
            </span>
          </span>
        </DialogTitle>
        <DialogContent
          className={styles.content}
          style={{ paddingLeft: "10px", paddingRight: "10px",paddingBottom:"2px" }}
        >
          {!showTemplatePanel && (
            <div style={{ background: "#e5e0e0", padding: 15 }}>
              <div className={styles.formGroupRow}>
                <div className={styles.formRow}>
                  <label className={styles.label}>Name*</label>
                  <div
                    className={styles.hoverWrapper}
                    onMouseEnter={() => onHover(selectedData?.name)}
                    onMouseLeave={onLeave}
                  >
                    <ValidatingTextField
                      style={{ width: "140%" }}
                      isMandatory
                      validationFn={(value) => value.length > 0}
                      markIfEmpty={highlightMandatoryFields}
                      resetAllVisitedFields={resetAllVisitedFields}
                      validationHelperText="error occured"
                      variant="outlined"
                      size="small"
                      value={name}
                      onChange={(e) =>
                        dispatch({
                          type: "update",
                          field: "name",
                          value: e.target.value,
                        })
                      }
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
                    {hover.isHover &&
                      hover.name === selectedData?.name &&
                      selectedData?.name && (
                        <span className={styles.hoverText}>
                          {selectedData?.name}
                        </span>
                      )}
                  </div>
                </div>
              </div>
              <div className={styles.formGroupRow}>
                <div className={styles.formRow}>
                  <label className={styles.label}>Stage*</label>
                  <CustomSelect
                    name="stage"
                    isMandatory
                    markIfUnselected={highlightMandatoryFields}
                    resetAllVisitedFields={resetAllVisitedFields}
                    options={ppapStages}
                    className={styles.selectStage}
                    menuPosition="fixed"
                    value={stage}
                    isMulti={false}
                    isClearable
                    onChange={(e) =>
                      dispatch({ type: "update", field: "stage", value: e })
                    }
                  />
                </div>
                <div className={styles.formRow}>
                  <label className={styles.label}>PPAP Level*</label>
                  <CustomSelect
                    name="ppaap level"
                    isMandatory
                    markIfUnselected={highlightMandatoryFields}
                    resetAllVisitedFields={resetAllVisitedFields}
                    options={ppaapLevelOptions}
                    className={styles.selectStage}
                    menuPosition="fixed"
                    value={ppaapLevel}
                    isMulti={false}
                    isClearable
                    // onChange={(e) =>
                      // dispatch({ type: "update", field: "stage", value: e })
                    // }
                    onChange={(e) => setPpaapLevel(e)}
                  />
                </div>
               
              </div>
              <div className={styles.formGroupRow}>
              <div className={styles.formRow}>
                  <label className={styles.label}>Type*</label>
                  <CustomSelect
                    name="type"
                    isMandatory
                    markIfUnselected={highlightMandatoryFields}
                    resetAllVisitedFields={resetAllVisitedFields}
                    options={getTypes}
                    menuPosition="fixed"
                    className={clsx(styles.selectType)}
                    value={type}
                    isMulti={false}
                    isClearable
                    onChange={(e) =>
                      dispatch({ type: "update", field: "type", value: e })
                    }
                  />
              </div>

              <div className={styles.formRow}>
                  <label className={styles.label} id="ctm-commodity" style={{paddingRight:'7px'}}>Commodity1</label>
                  <CustomSelect
  name="commodity"
  isMandatory
  markIfUnselected={highlightMandatoryFields}
  resetAllVisitedFields={resetAllVisitedFields}
  options={commodityOptions} // Use the commodityOptions state here
  menuPosition="fixed"
  className={clsx(styles.selectType)}
  value={commodity}
  // isMulti
  isClearable
  onChange={(e) => setCommodity(e)}
  // onChange={(e) =>
  //   dispatch({ type: "update", field: "type", value: e })
  // }
/>
                </div>
                            


                <div className={styles.formRow}>
                    <label className={styles.label}>Mandatory</label>
                    <Checkbox
                    size="small"
                    className
                    inputProps={{ 'data-testid': 'ismandatory' }}
                  />
                </div>
              </div>
            </div>
          )}

          {showTemplatePanel && (
            <div
              className={styles.formRow}
              style={{ background: "#e5e0e0", padding: 10 }}
            >
              <label className={styles.label}>Template</label>
              {!file &&
                (!selectedData ||
                  !selectedData?.document?.templateDocument) && (
                  <div style={{ flexGrow: 1 }}>
                    <Button
                      size="small"
                      ignoreExistingClassNames
                      className={styles.smallBtn}
                    >
                      <>
                        <span>UPLOAD</span>
                        <input
                          className={styles.uploadFileInput}
                          type="file"
                          id="upload-file"
                          data-testid={`upload-file-${document.id}`}
                          accept=".pdf,.xls,.xlsx,.odt,.ppt,.pptx,.txt,.doc,.docx,.jpg,.jpeg,.png"
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => {
                            const elem = e.target;
                            setFile(e.target.files[0]);
                            elem.value = "";
                          }}
                        />
                      </>
                    </Button>
                  </div>
                )}

              {(file ||
                (selectedData && selectedData?.document?.templateDocument)) && (
                <div className={styles.templateBlock}>
                  <span>{file ? file.name : selectedData.template}</span>
                  <IconButton
                    color="primary"
                    className={styles.deleteIcon}
                    onClick={() => {
                      setFile(null);
                      if(selectedData){
                        deleteDocument(selectedData);
                      }
                      // deleteDocument(selectedData);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              )}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          {!showTemplatePanel && (
            <>
              <Button
                className={clsx(styles.actionButton, styles.transparentButton)}
                onClick={() => {
                  handleClose();
                  dispatch({ type: "reset" });
                }}
              >
                CANCEL
              </Button>
              <Button
                className={clsx(
                  styles.actionButton,
                  styles.primaryActionButton
                )}
                variant="primary"
                onClick={(e) => {
                  e?.preventDefault();
                  runPreSubmissionChecks();
                  handleSubmitData();
                }}
                data-testid="save-next"
              >
                SAVE AND NEXT
              </Button>
            </>
          )}

          {showTemplatePanel && (
            <Button
              className={clsx(styles.actionButton, styles.primaryActionButton)}
              variant="primary"
              onClick={(e) => {
                e?.preventDefault();
                handleSubmitTemplate();
              }}
              data-testid="save-confirm"
            >
              SUBMIT
            </Button>
          )}
        </DialogActions>
      </>
    </Dialog>
  );
}

AddDocument.propTypes = {
  isPopupOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  sendDocData: PropTypes.func.isRequired,
  submitFile: PropTypes.func.isRequired,
  ppapStages: PropTypes.array.isRequired,
  selectedData: PropTypes.any,
  deleteDocument: PropTypes.func.isRequired,
};

export default AddDocument;
