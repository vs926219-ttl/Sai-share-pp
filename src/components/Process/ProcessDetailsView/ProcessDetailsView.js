/* eslint-disable no-nested-ternary */
import React, { useReducer, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ProcessBasicInfo, ProcessTabs, ProcessToolbar, ProjectDetails, Panel, ToolbarContainer, ProcessDocument, ApqpTimingChart, ActionButtons, ProcessStage, ProcessComplete } from '../..';
import { AuthChecker } from '../../../atomicComponents';
import styles from './ProcessDetailsView.module.css';
import { PPAP_STATE, PPAP_COMPLETE_STATE, USER_OPERATIONS } from '../../../constants';

const initialState = {
  partCategory: null,
  systemPpapLevel: null,
  overwritePpapLevel: null,
  ppapReason: null
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

function ProcessDetailsView({
  ppap,
  setReload,
  hambugerOpen,
  redirectToCreateProcess,
}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    partCategory,
    partCategoryDescription,
    systemPpapLevel,
    systemPpapLevelDescription,
    overwritePpapLevel,
    ppapReason,
  } = state;

  const [highlightMandatoryFields, setHighlightMandatoryFields] = useState(
    false
  );
  const [ppapStage, setPpapStage] = useState('');

  const { _links: links, requirement} = ppap.data;
  const { _links: requirementsLinks } = requirement || {};

  const isApproveRequirement = !!requirementsLinks?.APPROVE;
  const isPpapInitiated = !!(links?.initiate || (requirement && requirementsLinks?.initiate) || isApproveRequirement);
  const isPpapTerminated = ppap.data.state === PPAP_STATE.TERMINATE;

  const reloadData = () => {
    dispatch({type: 'reset'});
    setReload(true);
  };

  const processDocumentsProps = {
    ppap: ppap.data,
    partCategory,
    systemPpapLevel,
    overwritePpapLevel,
    ppapReason,
    highlightMandatoryFields,
    setHighlightMandatoryFields,
    reloadData,
  }

  const ppapStageProps = {
    ppap: ppap.data,
    state: ppapStage,
    highlightMandatoryFields,
    setHighlightMandatoryFields,
    reloadData
  }

  const completeStagesProps = {
    ppap: ppap.data,
    highlightMandatoryFields,
    setHighlightMandatoryFields,
    reloadData,
  }

  const [selectedProcessTab, setProcessDetailsTab] = useState(0);
  const [arePpapStageStarted, setArePpapStageStarted] = useState(false);
  const [isPpapCompleted, setIsPpapCompleted] = useState(false); 

 const handleProcessTabChange = (value) => {
		if (
			value === PPAP_STATE.INITIATE ||
			PPAP_COMPLETE_STATE.includes(value) ||
			value === PPAP_STATE.COMPLETE
		) {
			if (PPAP_COMPLETE_STATE.includes(value)) {
				setArePpapStageStarted(true);
				setIsPpapCompleted(false);
        setPpapStage(value)
			} else if (value === PPAP_STATE.COMPLETE) {
				setIsPpapCompleted(true);
				setArePpapStageStarted(false);
        setPpapStage('')
			} else {
				setIsPpapCompleted(false);
				setArePpapStageStarted(false);
        setPpapStage('')
			}
			setProcessDetailsTab(2);
		} else if (value === PPAP_STATE.APQP) {
      setIsPpapCompleted(false);
      setArePpapStageStarted(false);
			setProcessDetailsTab(3);
		} else {
      setIsPpapCompleted(false);
      setArePpapStageStarted(false);
      setPpapStage('')
			setProcessDetailsTab(0);
		}
 };

  const processDetailstabs = [
		{
			label: 'Basic Info',
			title: 'Basic Info',
			count: null,
			withOutCount: true,
			component: ProcessBasicInfo,
			props: {
				ppap: ppap.data,
				handleProcessTabChange,
			},
		},
		{
			label: 'Project Details',
			title: 'Project Details',
			count: null,
			withOutCount: true,
			component: ProjectDetails,
			props: {
				ppap: ppap.data,
			},
		},
		{
			label: 'Documentation',
			title: 'Documentation',
			count: null,
			withOutCount: true,
			component: isPpapCompleted
				? ProcessComplete
				: arePpapStageStarted
				? ProcessStage
				: ProcessDocument,
			props: isPpapCompleted
				? completeStagesProps
				: arePpapStageStarted
				? ppapStageProps
				: processDocumentsProps,
		},
		{
			label: 'APQP Timing chart',
			title: 'APQP Timing chart',
			count: null,
			withOutCount: true,
			hideTab: isPpapInitiated || (isPpapTerminated && !isPpapInitiated),
			component: ApqpTimingChart,
			props: {
				ppap: ppap.data,
				highlightMandatoryFields,
				setHighlightMandatoryFields,
				reloadData,
			},
		},
	];
	
   const secondaryActions = [
     {
       name: 'NEW PROCESS',
       actionFn: () => redirectToCreateProcess(),
       classNames: { btn: styles.newProcessButton },
       showButton: !hambugerOpen,
     },
   ];

  useEffect(() => {
    if(ppap.data.id){
    setHighlightMandatoryFields(false);
    handleProcessTabChange(ppap.data.state)
    }
  }, [ppap.data.id]);

  return (
    <div className={styles.processDetailsView}  style={{marginLeft:  hambugerOpen ? '1em' : '0em'}}>
      <ToolbarContainer classNames={[styles.tabsContainer]}>
        <ProcessToolbar
          inputFields={{
            partCategory,
            partCategoryDescription,
            systemPpapLevel,
            systemPpapLevelDescription,
            overwritePpapLevel,
            ppapReason,
          }}
          ppap={ppap.data}
          highlightMandatoryFields={highlightMandatoryFields}
          dispatch={dispatch}
          hambugerOpen={hambugerOpen}
        />
      </ToolbarContainer>
      <div
        className={styles.processDetailsTabsContainer}
      >
        <ProcessTabs
          classNames={{
            tabWrapper: styles.tabWrapper,
            selected: styles.selected,
            notSelected: styles.notSelected,
          }}
          tabs={processDetailstabs.filter((tab) => !tab.hideTab)}
          selectedTab={selectedProcessTab}
          handleTabChange={(tabvalue)=>setProcessDetailsTab(tabvalue)}
        />
      </div>
      <div className={styles.boxShadow} />
      {processDetailstabs.map((tab, index) => {
        if (!tab.hideTab)
          return (
            <Panel value={selectedProcessTab} index={index}>
              <tab.component {...tab.props}>
                {(data) => (
                  <>
                    <div className={styles.processDetails}>
                      {data && data.content ? data.content : null}
                    </div>
                    <div className={styles.actionBar}>
                      <AuthChecker operation={USER_OPERATIONS.CREATE_PPAP}>
                        {(isAuthorized) =>
                          isAuthorized && (
                            <ActionButtons secondaryActions={secondaryActions} />
                          )
                        }
                      </AuthChecker>
                      {data && data.actionButtons && (
                        <ActionButtons {...data.actionButtons} />
                      )}
                    </div>
                  </>
                )}
              </tab.component>
            </Panel>
          );
        return null
      })}
    </div>
  );
}

ProcessDetailsView.propTypes = {
  ppap: PropTypes.object,
  setReload: PropTypes.func,
  setTodoList: PropTypes.func,
  setOverviewList: PropTypes.func,
  hambugerOpen: PropTypes.bool,
  redirectToCreateProcess:PropTypes.func,
};

export default ProcessDetailsView;
