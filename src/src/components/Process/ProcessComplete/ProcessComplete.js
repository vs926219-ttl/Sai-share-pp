/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-unused-vars */
import React from "react";
import PropTypes from "prop-types";
import { PPAP_COMPLETE_STATE } from '../../../constants';
import { CompleteStage } from '../..'
import styles from './ProcessComplete.module.css';

function ProcessComplete({ppap, highlightMandatoryFields, setHighlightMandatoryFields, reloadData, children}) {
  const {_links: links } = ppap;
  
  const content = (
    <div className={styles.infoWrapper}>
        <h4 className={styles.projectName}>
            <span style={{ color: '#18A523', marginLeft:'10px' }}>Complete</span>
        </h4>
        {
          ppap.id &&
          PPAP_COMPLETE_STATE.map(key => (Object.keys(links).indexOf(key) !== -1) 
            && <CompleteStage 
              ppap={ppap}
              highlightMandatoryFields={highlightMandatoryFields}
              setHighlightMandatoryFields={setHighlightMandatoryFields}
              reloadData={reloadData}
              comingState={key}
            />
          ).filter(x => x)
        }
    </div>
  )

  return children({ content })
}
ProcessComplete.propTypes = {
  ppap: PropTypes.object,
  highlightMandatoryFields: PropTypes.bool,
  setHighlightMandatoryFields: PropTypes.func,
  reloadData: PropTypes.func,
  comingState: PropTypes.string
};

export default ProcessComplete;
