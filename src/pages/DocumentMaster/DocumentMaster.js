/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import styles from './DocumentMaster.module.css';
import BackButton from '../../components/BackButton/BackButton';
import Table from '../../components/Table/Table';
import { API } from '../../apis/api';
import { buildErrorMessage } from '../../apis/calls';
import { usePopupManager } from '../../providers/PopupManager/PopupManager';
import { CustomTab } from '../../atomicComponents';
import {
	RESOURCE_TYPE,
	API_RESOURCE_URLS,
	MESSAGE_TYPE,
	DISPLAY_MESSAGES,
	USER_OPERATIONS,
} from '../../constants';
import { withAllowedOperationsProvider } from '../../hocs';
import { AddDocument, GridLoadingSpinner } from '../../components';
import WarningModal from '../../components/WarningModal/WarningModal';

function DocumentMaster() {
	const { showInternalError, showPopup } = usePopupManager();
	const history = useHistory();
	const [rowsData, setRowsData] = useState({
		loading: false,
		data: [],
		filteredData: [],
	});
	const [documentCount, setDocumentCount] = useState(0);
	const [ppapStages, setPpapStages] = useState([]);
	const [documentData, setDocumentData] = useState(null);
	const [selectedData, setselectedData] = useState(null);
	const [loading, setLoader] = useState(false);
	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const [isWarningOpen, setIsWarningOpen] = useState(false);
	const [selectedRows, setSelectedRows] = useState({});

	const openWarning = (selectedRow) => {
		setIsWarningOpen(true);
		setSelectedRows(selectedRow[0]);
	};

	const handleOpen = () => setIsPopupOpen(true);
	const handleClose = () => setIsPopupOpen(false);
	const ROW_HEIGHT = 38;

	const downloadFile = async (row) => {
		const { id, template } = row;
		try {
			const response = await API.get(
				API_RESOURCE_URLS.getPpapStageDocumentDownload(id),
			);
			const { presignedUrl } = response.data;

			if (presignedUrl) {
				const res = await axios.get(presignedUrl, {
					responseType: 'blob',
				});
				const a = document.createElement('a');
				const href = window.URL.createObjectURL(res.data);
				a.href = href;
				a.download = template;
				a.click();
			}
		} catch (error) {
			console.error(buildErrorMessage(error));
			showPopup({
				type: MESSAGE_TYPE.FAILURE,
				contextText: 'Document download failed.',
			});
		}
	};
	
	const baseDefaultColumns = [
		{
			width: 200,
			title: 'Name',
			field: 'name',
			enableSearch: true,
			enableFilter: true,
		},
		{
			width: 190,
			title: 'Template',
			field: 'template',
			enableSearch: true,
			enableFilter: true,
			render: (row) => (
				<div className={styles.rowHover} onClick={() => downloadFile(row)}>
					{row.template}
				</div>
			),
		},
		{
			width: 160,
			title: 'Stage',
			field: 'stage',
			enableSearch: true,
			enableFilter: true,
		},
		{
			width: 160,
			title: 'Commodity',
			field: 'Commodity',
			enableSearch: true,
			enableFilter: true,
		},
		{
			width: 160,
			title: 'Type',
			field: 'documentType',
			enableSearch: true,
			enableFilter: true,
		},
		{
			width: 160,
			title: 'Updated at',
			field: 'documentCreationDate',
			enableSearch: true,
			enableFilter: true,
		},
		{
			width: 160,
			title: 'Updated by',
			field: 'updatedBy',
			enableSearch: true,
			enableFilter: true,
		},
		{
			width: 160,
			title: 'PPAP Level',
			field: 'updatedBy',
			enableSearch: true,
			enableFilter: true,
		},
		{
			width: 160,
			title: 'IS Mandatory',
			field: 'updatedBy',
			enableSearch: true,
			enableFilter: true,
		},
	];

	const redirectToApplicationLandingPage = () => {
		history.push('/');
	};

	const setCount = (count) => {
		setDocumentCount(count);
	};

	const documentList = (documentsList) => {
		const processedDocumentList = documentsList.map(({ ...document }) => {
			const documentCreationDate = document.updatedAt
				? moment(document.updatedAt).format('DD/MM/YYYY')
				: null;
			const documentTemplate = document.document.templateDocument
				? document.document.templateDocument.documentName
				: null;
			return {
				id: document.id,
				...document,
				name: document.document.name,
				stage: document.ppapStage.name,
				template: documentTemplate,
				updatedBy: document?.updatedBy?.name,
				documentCreationDate,
			};
		});
		return processedDocumentList;
	};

	const loadAllDocuments = async () => {
		try {
			setRowsData((prev) => ({
				...prev,
				loading: true,
			}));

			const response = await API.get(API_RESOURCE_URLS.STAGE_DOCUMENTS);

			const { data: documentsList } = response;
			const processedDocumentList = documentList(documentsList);
			setselectedData(null);
			setDocumentData(null);
			setRowsData({
				data: processedDocumentList,
				filteredData: processedDocumentList,
				loading: false,
			});
		} catch (error) {
			showInternalError(error);
			console.error(buildErrorMessage(error));
			setRowsData({
				data: [],
				filteredData: [],
				loading: false,
			});
		}
	};

	const getPPAPStages = async () => {
		try {
			const response = await API.get(API_RESOURCE_URLS.PPAP_STAGES);
			const { data } = response;
			const formattedData = data.map((item) => ({
				value: item.id,
				label: item.name,
			}));
			setPpapStages(formattedData);
		} catch (error) {
			console.error(buildErrorMessage(error));
		}
	};

	const sendDocData = async (fields) => {
		let updatedFields = null;
		let inputFields = null;
		
		  if(selectedData && selectedData.id){
			  const { document } = selectedData;
			  const { templateDocument } = document;

				updatedFields = {
					id: selectedData.id,
					ppapStageId: fields.stage.value,
					document: {
						id: document.id,
						name: fields.name,
						templateDocument: templateDocument ? {...templateDocument} : undefined
					},
					documentType: fields.type.value
				}
		  }else{
			inputFields = {
				ppapStageId: fields.stage.value,
				document: {
				  name: fields.name,
				},
				documentType: fields.type.value
			  }
		  }

			try {
			let response = null;
			if(selectedData && selectedData.id){
				const { links } = selectedData;
				const updateUrl = links.find(x => x.rel === 'update');
				
				response = await API.put(updateUrl.href, updatedFields)
			}else{
				response = await API.post(API_RESOURCE_URLS.PPAP_STAGE_DOCUMENT, inputFields);
			}
			const { data } = response;
			
			if(data) setDocumentData(data);
		  } catch (error) {
			  console.error(buildErrorMessage(error));
		  }
	}

	const getErrors = (code) => {
		let message = DISPLAY_MESSAGES.DOCUMENT_SUBMIT_FAILURE;

		if (code === '401' || code === '403')
			message = DISPLAY_MESSAGES.AUTHORISATION_ERROR;
		else if (code === '504') message = DISPLAY_MESSAGES.NETWORK_ERROR;
		else if (code === '500' || code === '502' || code === '503')
			message = DISPLAY_MESSAGES.PRIMARY_ERROR;

		return message;
	};

	const submitFile = async (file) => {
		if(!file){
			showPopup({
				type: MESSAGE_TYPE.SUCCESS,
				contextText: `Document ${selectedData ? 'updated' : 'submitted'} successfully.`,
			});
			loadAllDocuments();
			return
		}

		const { document } = documentData;
		const { _links: links } = document;
		setLoader(true);
		try {
		  const response = await API.get(`${links.UPLOAD.href.replace(/{documentName}/g, file.name)}`);
		  const { data } = response;
		  const { presignedUrl } = data;
		 
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
	
			const acknowledgeResponse = await API.put(`${links.ACKNOWLEDGE.href}`);
			if(acknowledgeResponse){
				setLoader(false);
				showPopup({
				type: MESSAGE_TYPE.SUCCESS,
				contextText: `Document ${selectedData ? 'updated' : 'submitted'} successfully.`,
				});

				handleClose();
				loadAllDocuments();
			}
		  }
		} catch (error) {
			setLoader(false);
			handleClose();
			const err = buildErrorMessage(error);
			const statusCode = err.substr(err.length - 3);

			console.error(buildErrorMessage(error));

			if (error.response?.status === 415) {
				showPopup({
				  type: MESSAGE_TYPE.FAILURE,
				  contextText: 'Unable to upload the file.',
				  info: 'Provided format is not supported.',
				});
			  } else {
				showPopup({
				  type: MESSAGE_TYPE.FAILURE,
				  contextText: getErrors(statusCode),
				  info: 'Document upload failed.',
				});
			  }
		}
	};

	const confirmDelete = async () => {
		const { links } = selectedRows;
		const deleteLink = links.find(({ rel }) => rel === 'delete');
		setLoader(true);
		try {
			await API.delete(deleteLink.href);
			showPopup({
				type: MESSAGE_TYPE.SUCCESS,
				contextText: 'Document deleted successfully.',
			});
			setLoader(false);
			loadAllDocuments();
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

	  const openEditDialog = () => {
		setIsPopupOpen(true);
	  }

	useEffect(() => {
		if (ppapStages && ppapStages.length === 0) getPPAPStages();
	}, [ppapStages]);

	const deleteDocument = async (data) => {
	    const { document } = data;
		const { links } = document;
		const deleteUrl = links.find(x => x.rel === 'DELETE');

		try {
			const response = await API.delete(deleteUrl.href);
	
			if( response && response.data){
				setDocumentData(response.data);
				showPopup({
					type: MESSAGE_TYPE.SUCCESS,
					contextText: 'Document deleted successfully',
				});
				setselectedData(null)
			}
		} catch (error) {
				console.error(buildErrorMessage(error));
		}
	}

	useEffect(() => {
		loadAllDocuments();
	}, []);
	
	return (
		<>
			<div className={styles.container} style={{ boxSizing: 'border-box' }}>
				{loading && (
					<div className={styles.gridLoader}>
						<GridLoadingSpinner />
					</div>
				)}
				<div className={styles.backButtonLastRefreshedDateWrapper}>
					<BackButton
						action="Process"
						handleClick={redirectToApplicationLandingPage}
					/>
				</div>
				<div className={styles.tabAndDatePickerWrapper}>
					<div style={{ width: '15%' }}>
						<CustomTab isSelected count={documentCount} title="Documents" />
					</div>
					<div
						style={{
							width: '84%',
							background: '#FFFFFF 0% 0% no-repeat',
							boxShadow: '0px 3px 6px #00000029',
							borderRadius: '4px',
							opacity: 1,
						}}
					/>
				</div>
				<div className={styles.tableView} style={{ flex: 0.97 }}>
					<Table
						columns={[...baseDefaultColumns]}
						defaultColumns={[...baseDefaultColumns]}
						rowHeight={ROW_HEIGHT}
						rows={rowsData.data}
						secondaryActions={[
							{
								name: 'DELETE',
								actionFn: (selectedRow) => openWarning(selectedRow),
								backgroundColor: '#C96B6B',
								authOperation: USER_OPERATIONS.CREATE_PPAP_STAGE_DOCUMENT,
								shouldEnable: (selectedRow) => selectedRow.length === 1,
							},
							{ 
								name: 'Edit',
								authOperation: USER_OPERATIONS.CREATE_PPAP_STAGE_DOCUMENT,
								shouldEnable: selected => selected.length === 1,
								actionFn: selected => {
									setselectedData(selected[0]);
									openEditDialog();
									} ,
							}
						]}
						primaryAction={{
							name: 'Add Document',
							authOperation: USER_OPERATIONS.CREATE_PPAP_STAGE_DOCUMENT,
							shouldEnable: () => true,
							actionFn: () => {
								handleOpen();
								setselectedData(null);
							},
						}}
						setAsnCount={setCount}
						isDataLoading={rowsData.loading}
						actionButtons
					/>
				</div>
			</div>
			<AddDocument
				isPopupOpen={isPopupOpen}
				handleClose={handleClose}
				sendDocData={sendDocData}
				submitFile={submitFile}
				ppapStages={ppapStages}
				selectedData={selectedData}
				deleteDocument={deleteDocument}
			/>
			<WarningModal
				open={isWarningOpen}
				rowsData={selectedRows}
				handleClose={() => setIsWarningOpen(false)}
				confirmDelete={() => confirmDelete()}
			/>
		</>
	);
}

export default withAllowedOperationsProvider(
	DocumentMaster,
	RESOURCE_TYPE.PROJECT,
	RESOURCE_TYPE.PPAP_STAGE_DOCUMENT,
);
