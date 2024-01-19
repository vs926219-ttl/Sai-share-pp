/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-unused-expressions */
import React, {useState, useEffect} from "react";
import clsx from "clsx";
import moment from "moment";
import PropTypes from "prop-types";
import styles from "./ProcessBasicInfo.module.css";
import { PPAP_STATE } from "../../../constants";
import { API } from '../../../apis/api';
import { buildErrorMessage } from '../../../apis/calls';

function ProcessBasicInfo({ ppap, children, handleProcessTabChange }) {
  
  const [ppapStatus, setCurrentStatus] = useState(null);
  const stages = [
    { label: "Initiate", value: PPAP_STATE.INITIATE },
    { label: "APQP", value: PPAP_STATE.APQP },
    { label: "PIST", value: PPAP_STATE.PIST },
    { label: "PIPC", value: PPAP_STATE.PIPC },
    { label: "Run at rate", value: PPAP_STATE.RUN_AT_RATE },
    { label: "PSW", value: PPAP_STATE.PSW },
    { label: "Complete", value: PPAP_STATE.COMPLETE },
    { label: "Terminate", value: PPAP_STATE.TERMINATE },
  ];

  const { _links: links, requirement } = ppap;

  if (!links?.RUN_AT_RATE) {
	stages.splice(4, 1);
  }

  const loadStageData = async () => {
	try {
	const response = await API.get(links[ppap.state].href);
		const { data } = response;
		setCurrentStatus(data.status.replace(/_/g, " ").toLowerCase());
	} catch (error) {
		console.error(buildErrorMessage(error));
	}
  };
  
  useEffect(() => {
    if(ppap && (ppap.state !== PPAP_STATE.INITIATE) && (ppap.state !== PPAP_STATE.APQP)){
		loadStageData();
	}else if(ppap && ppap.state === PPAP_STATE.INITIATE){
		setCurrentStatus(requirement.status.replace(/_/g, " ").toLowerCase());
	}else if(ppap && ppap.state === PPAP_STATE.APQP){
		setCurrentStatus(ppap.apqpTimingChart.status.replace(/_/g, " ").toLowerCase());
	}
  }, [ppap.id])

  if (ppap && !ppap.id)
    return children({})

	const content = (
		<div className={styles.infoWrapper}>
			<div className={styles.blockContainer}>
				<h4
					className={clsx(
						styles.projectName,
						ppap?.state === PPAP_STATE.TERMINATE && styles.terminate,
					)}
				>
					{ppap?.project?.name}
				</h4>
				<div className={styles.stagesWrapper}>
					<div style={{marginRight: 30}}>			
						<label style={{ fontWeight: 'bold' }}>Stage</label>
						<ul className={styles.stagesList}>
							{stages.map((stage, index) => (
								<button
									type="button"
									disabled={
										stages.findIndex((states) => states.value === ppap.state) <
											index || ppap?.state === PPAP_STATE.TERMINATE  
									}
									className={clsx(
										stages.findIndex((states) => states.value === ppap.state) === index && styles.activeState,
										stages.findIndex((states) => states.value === ppap.state) > index && styles.completedState,
										ppap?.state === PPAP_STATE.TERMINATE &&
											stage.value === PPAP_STATE.TERMINATE &&
											styles.terminateState,
										ppap?.state === PPAP_STATE.COMPLETE &&
											stage.value === PPAP_STATE.COMPLETE &&
											styles.completeState,
									)}
									onClick={() => handleProcessTabChange(stage.value)}
								>
								{stage.label}
								</button>
							))}
						</ul>
					</div>
					{ppapStatus && (
						<div className={styles.statusWrapper}>
							<label style={{ fontWeight: 'bold' }}>Status</label>
							<span className={styles.ppapStatus}>{ppapStatus[0].toUpperCase() + ppapStatus.slice(1)}</span>
						</div>
					)}
				</div>
			</div>
			<div className={styles.row}>
				<div className={styles.formGroup}>
					<label>PPAP number: </label>
					<p>{ppap?.id}</p>
				</div>
				<div className={styles.formGroup}>
					<label>PO number: </label>
					<p>{ppap?.purchaseOrder?.number}</p>
				</div>
				<div className={styles.formGroup}>
					{ppap?.requirement?.initiatedAt ? (
						<>
							<label>PPAP date: </label>
							<p>
								{moment(ppap?.requirement?.initiatedAt).format('DD/MM/YYYY')}
							</p>
						</>
					) : null}
				</div>
				<div className={styles.formGroup}>
					<label>PO date: </label>
					<p>{moment(ppap?.purchaseOrder?.createdAt).format('DD/MM/YYYY')}</p>
				</div>
				<div className={styles.formGroup}>
					<label>Part number: </label>
					<p>{ppap?.part?.number}</p>
				</div>
				<div className={styles.formGroup}>
					<label>Part description: </label>
					<p>{ppap?.part?.description}</p>
				</div>
				<div className={styles.formGroup}>
					<label>Drawing number: </label>
					<p>{ppap?.part?.drawingNumber}</p>
				</div>
				<div className={styles.formGroup}>
					<label>Revision level: </label>
					<p>{ppap?.purchaseOrder?.revisionLevel}</p>
				</div>
				<div className={styles.formGroup}>
					<label>Part group: </label>
					<p>{ppap?.part?.partGroup?.id}</p>
				</div>
				<div className={styles.formGroup}>
					<label>Plant: </label>
					<p>{ppap?.plant?.name}</p>
				</div>
				<div className={styles.formGroup}>
					<label>Plant code: </label>
					<p>{ppap?.plant?.code}</p>
				</div>
				<div className={styles.formGroup}>
					<label>Purchase commodity: </label>
					<p style={{ width: '140px' }}>{ppap?.commodityGroup}</p>
				</div>
				<div className={styles.formGroup}>
					<label>Purchase buyer name: </label>
					<p>{ppap?.purchaseBuyerName}</p>
				</div>
				<div className={styles.formGroup}>
					<label>AQ commodity: </label>
					<p style={{ width: '140px' }}>{ppap?.aqCommodityGroup}</p>
				</div>
				<div className={styles.formGroup}>
					<label>Part category: </label>
					<p>{ppap?.requirement?.partCategory?.name}</p>
				</div>
				<div className={styles.formGroup}>
					{ppap?.requirement?.level?.description ? (
						<>
							<label>Level description: </label>
							<p>{ppap?.requirement?.level?.description}</p>
						</>
					) : null}
				</div>
				<div className={styles.formGroup}>
					{ppap?.requirement?.overriddenLevel?.description? (
						<>
							<label>Override level description: </label>
							<p>{ppap?.requirement?.overriddenLevel?.description}</p>
						</>
					) : null}
				</div>
			</div>
			<div className={styles.blockContainer} style={{ paddingBottom: 20 }}>
				<label style={{ fontWeight: 'bold' }}>KAM</label>
			</div>
			<div className={styles.row}>
				<div className={styles.formGroup}>
					<label>Supplier code: </label>
					<p>{ppap?.supplier?.code}</p>
				</div>
				<div className={styles.formGroup}>
					<label>Supplier: </label>
					<p>{ppap?.supplier?.name}</p>
				</div>
				<div className={styles.formGroup}>
					<label>Supplier location: </label>
					<p>
						{ppap?.supplier?.address?.value}, {ppap?.supplier?.address?.city},{' '}
						{ppap?.supplier?.address?.district},{' '}
						{ppap?.supplier?.address?.pincode}
					</p>
				</div>

				<div className={styles.formGroup}>
					<label>Name: </label>
					<p>{ppap?.kamContactDetails?.name}</p>
				</div>
				<div className={styles.formGroup}>
					<label>Contact: </label>
					<p>{ppap?.kamContactDetails?.contactNumber}</p>
				</div>
				<div className={styles.formGroup}>
					<label>Email: </label>
					<p>{ppap?.kamContactDetails?.emailId}</p>
				</div>
			</div>
			<div style={{ height: 30 }} />
		</div>
	);

  return children({ content })
}
ProcessBasicInfo.propTypes = {
  ppap: PropTypes.any,
  children: PropTypes.func.isRequired
};

export default ProcessBasicInfo;
