/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable object-shorthand */
/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
/* eslint-disable prefer-const */
/* eslint-disable dot-notation */
/* eslint-disable no-nested-ternary */
import React, { useEffect, useState, useReducer } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from '@material-ui/core';
import { MdReplay } from 'react-icons/md';
import { Button } from '@tmlconnected/avant-garde-components-library';
import styles from './CreateProcessForm.module.css';
import {
	CustomFormGroup,
	CustomSelect,
	ValidatingTextField,
} from '../FormComponents';
import {
	API_RESOURCE_URLS,
	DISPLAY_MESSAGES,
	MESSAGE_TYPE,
	RESOURCE_TYPE,
	USER_OPERATIONS,
	Regex,
	EDIT_STATUS
} from '../../constants';
import { API } from '../../apis/api';
import { buildErrorMessage } from '../../apis/calls';
import Table from '../Table/Table';
import { usePopupManager } from '../../providers/PopupManager/PopupManager';
import { AuthChecker} from '../../atomicComponents';
import { withAllowedOperationsProvider } from '../../hocs';

const initialState = {
	plant: null,
	part: null,
	ppapReason: null,
	aqCommodity: null,
	purchaseCommodity: null,
	supplierCode: null,
	supplierDetails: null,
	supplierName: '',
	supplierLocation: '',
	supplierKamDetails: null,
	supplierRepresentativeName: '',
	supplierRepresentativeContactNo: '',
	supplierRepresentativeEmailId: '',
	selectedProject: null,
	selectedPO: null,
	inputFields: {
		purchaseBuyerName: '',
	},
	errors: {},
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

function CreateProcessForm({ redirectToProcessPage }) {
	const ROW_HEIGHT = 38;
	const [rowsData, setRowsData] = useState({
		loading: false,
		data: [],
		filteredData: [],
	});
	const [poData, setPOData] = useState({
		loading: false,
		data: [],
		filteredData: [],
		last: false,
		number: 0,
	});
	const [state, dispatch] = useReducer(reducer, initialState);
	const { showInternalError } = usePopupManager();
	const { showPopup } = usePopupManager();

	const {
		plant,
		ppapReason,
		part,
		aqCommodity,
		purchaseCommodity,
		supplierCode,
		supplierDetails,
		supplierName,
		supplierLocation,
		supplierKamDetails,
		supplierRepresentativeName,
		supplierRepresentativeContactNo,
		supplierRepresentativeEmailId,
		selectedProject,
		selectedPO,
		inputFields,
		errors,
	} = state;

	const [plants, getPlants] = useState({ loading: false, data: [] });
	const [parts, getParts] = useState({ loading: false, data: [] });
	const [availablePpapReasons, setAvailablePpapReasons] = useState({ loading: false, data: [] });
	const [aqCommodities, getAqCommodity] = useState({
		loading: false,
		data: [],
	});
	const [purchaseCommodities, getPurchaseCommodity] = useState({
		loading: false,
		data: [],
	});
	const [suppliers, getSuppliers] = useState({ loading: false, data: [] });
	const [kamDetails, setSuppliersKamDetails] = useState({});
	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const [resetAllVisitedFields, setResetAllVisitedFields] = useState(false);
	const [highlightMandatoryFields, setHighlightMandatoryFields] = useState(
		false,
	);
	const [hover, setHover] = useState({ isHover: false, name: null });
	const onHover = (name) => {
		setHover({ isHover: true, name: name });
	};

	const onLeave = () => {
		setHover({ isHover: false, name: null });
	};

	const BG_COLOR = '#fffef8';
	const [backgroundColors, setBackgroundColors] = useState({
		processInfoBg: true,
		supplierInfoBg: false,
		poInfoBg: false,
		projectsInfoBg: false,
	});
	const {
		processInfoBg,
		supplierInfoBg,
		poInfoBg,
		projectsInfoBg,
	} = backgroundColors;

	const changeBackgroundColor = (field) =>
		setBackgroundColors((prev) => {
			const newBackgroundColors = {};
			// eslint-disable-next-line no-restricted-syntax
			for (const [key, value] of Object.entries(prev)) {
				if (key === field) newBackgroundColors[key] = true;
				else newBackgroundColors[key] = false;
			}
			return newBackgroundColors;
		});

	const loadData = async (setState, url, params) => {
		try {
			const response = await API.get(url, {
				params,
			});

			setState({ loading: false, data: response.data });
		} catch (error) {
			console.error(buildErrorMessage(error));
		}
	};
	const loadPlants = async () =>
		loadData(getPlants, API_RESOURCE_URLS.getAllPlants());
	const loadParts = async () =>
		loadData(getParts, API_RESOURCE_URLS.getAllParts(), {
			plantCode: plant ? plant.value : null,
		});
	const loadAqCommodity = async () =>{
		loadData(getAqCommodity, API_RESOURCE_URLS.getAqCommodity(),{
			plantCode: plant ? plant.value : null,
		})};
	const loadPurchaseCommodity = async () =>{
		loadData(getPurchaseCommodity, API_RESOURCE_URLS.getPurchaseCommodity(),{
			plantCode: plant ? plant.value : null,
		})};
	const loadSupliers = async () =>
		loadData(getSuppliers, API_RESOURCE_URLS.getSuppliers(), {
			plantCode: plant ? plant.value : null,
			partNumber: part ? part.value : null,
		});
	const loadPpapReasons = async () =>
	    loadData(setAvailablePpapReasons, API_RESOURCE_URLS.PPAP_REASONS);
	const handleOpen = () => setIsPopupOpen(true);
	const handleClose = () => setIsPopupOpen(false);
	const resetFields = () => setResetAllVisitedFields(true);

	const loadSupliersRepresentative = async () => {
		const getSupplierCode = suppliers?.data.map(({ code }) => ({
			code,
		}));
		const suppliersCode = getSupplierCode.map((row) => row.code).toString();
		try {
			const response = await API.get(
				API_RESOURCE_URLS.getKamDetails(suppliersCode),
			);
			const { data } = response;
			setSuppliersKamDetails({ data });
		} catch (error) {
			console.error(buildErrorMessage(error));
			if (error.response?.status === 404) {
				showPopup({
					type: MESSAGE_TYPE.FAILURE,
					contextText:
						'KAM information for selected supplier is missing. Please contact SRM Helpdesk team to initiate the KAM information update. KAM information is mandatory to initiate PPAP.',
				});
			}
		}
	};

	const processProjectList = (projectList) => {
		let processedProjectList = projectList.map(({ ...project }) => {
			const allPlants = project.plants.map((item) => item.name);
			const allVehicleLines = project.vehicleLines;
			const projectCreationDate = moment(project.createdAt).format(
				'DD/MM/YYYY',
			);
			return {
				id: project.id,
				...project,
				allPlants,
				allVehicleLines,
				projectCreationDate,
			};
		});
		const allPlantsList = [];
		const allVehicleLineList = [];
		processedProjectList.forEach(({ allPlants, vehicleLines }) => {
			allPlantsList.push(...allPlants);
			allVehicleLineList.push(...vehicleLines);
		});

		processedProjectList = processedProjectList.map(({ ...project }) => ({
			...project,
			allPlants: [...new Set(allPlantsList)],
			allVehicleLines: [...new Set(allVehicleLineList)],
		}));
		return processedProjectList;
	};
	const loadAllProjects = async () => {
		try {
			setRowsData((prev) => ({
				...prev,
				loading: true,
			}));

			const response = await API.get(API_RESOURCE_URLS.PROJECTS, {
				params: {
					editStatus: EDIT_STATUS.COMPLETE,
				},
			  });

			const { data: projectList } = response;
			const processedProjectList = processProjectList(projectList);

			setRowsData({
				data: processedProjectList,
				filteredData: processedProjectList,
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

	useEffect(() => {
		resetAllInputs();
		loadPlants();
	}, []);

	useEffect(() => {
			loadParts();
			if(plant?.value){
			loadPpapReasons();
			loadAqCommodity();
			loadPurchaseCommodity();
			}
	}, [plant]);

	useEffect(() => {
		if (supplierCode) {
			loadSupliersRepresentative();
		}
	}, [supplierCode]);

	useEffect(() => {
		loadSupliers();
	}, [plant, part]);

	useEffect(() => {
		if (supplierCode) {
			loadAllProjects();
		}
	}, [supplierCode]);

	const formatOptionsForPlantsSelect = (...options) =>
		options.map(({ value, label }) => ({ value, label }));

	const getPlantsOptions = () =>
		formatOptionsForPlantsSelect(
			...plants.data.map(({ name, code }) => ({
				value: code,
				label: `${name} - ${code}`,
			})),
		);
	const getPartsOptions = () =>
		formatOptionsForPlantsSelect(
			...parts.data.map(({ number }) => ({
				value: number,
				label: number,
			})),
		);
	const getAqCommodityOptions = () =>
		formatOptionsForPlantsSelect(
			...aqCommodities.data.map(({ id, name }) => ({
				value: id,
				label: name,
			})),
		);
	const getPurchaseCommodityOptions = () =>
		formatOptionsForPlantsSelect(
			...purchaseCommodities.data.map(({ id, name }) => ({
				value: id,
				label: name,
			})),
		);
	const getSuppliersOptions = () =>
		formatOptionsForPlantsSelect(
			...suppliers.data.map(({ name, code }) => ({
				value: code,
				label: `${code} - ${name}`,
			})),
		);
	const formatOptionsForPpapReason = (...options) =>
		options.map(({ value, label }) => ({ value, label }));
	const getPpapReasonOptions = () =>
		formatOptionsForPpapReason(
			...availablePpapReasons.data.map(({ id, reason }) => ({
				label: reason,
				value: id,
			}))
		);


	const getSupplierDetails = () => {
		if (suppliers && suppliers.data && supplierCode) {
			const findSupplier = suppliers.data.find(
				(x) => x.code === supplierCode.value,
			);
			if (findSupplier) {
				dispatch({
					type: 'update',
					field: 'supplierDetails',
					value: findSupplier,
				});
				dispatch({
					type: 'update',
					field: 'supplierName',
					value: findSupplier.name,
				});

				const address = {
					value:
						findSupplier.address[
							Object.keys(findSupplier.address).sort().pop()
						],
					...findSupplier.address,
				};
				dispatch({
					type: 'update',
					field: 'supplierLocation',
					value: Object.values(address)
						.filter((x) => x !== '')
						.join(','),
				});
			}
		}
	};

	const getSupplierKamDetails = () => {
		if (kamDetails && kamDetails.data) {
			dispatch({
				type: 'update',
				field: 'supplierKamDetails',
				value: kamDetails.data,
			});
			dispatch({
				type: 'update',
				field: 'supplierRepresentativeName',
				value: kamDetails.data.name,
			});
			dispatch({
				type: 'update',
				field: 'supplierRepresentativeContactNo',
				value: kamDetails.data.contactNumber,
			});
			dispatch({
				type: 'update',
				field: 'supplierRepresentativeEmailId',
				value: kamDetails.data.emailId,
			});
		}
	};

	const baseDefaultColumns = [
		{
			width: 140,
			title: 'Project Code',
			field: 'code',
			enableSearch: true,
			enableFilter: true,
		},
		{
			width: 150,
			title: 'Project Name',
			field: 'name',
			enableSearch: true,
			enableFilter: true,
		},
		{
			width: 150,
			title: 'Busi. Unit',
			field: 'businessUnit',
			enableSearch: true,
			enableFilter: true,
		},
		{
			width: 150,
			title: 'Plant',
			field: 'allPlants',
			enableSearch: true,
			enableFilter: true,
			filterFn: (row, value) =>
				row.plants.map(({ name }) => name).some((i) => i.includes(value)),
			// eslint-disable-next-line no-unused-vars
			render: (row, index, prop) => (
				<div
					className={styles.ellipsisText}
					onMouseEnter={(e) =>
						prop.openEllipsisPopupForEventWithText(
							e,
							row.plants.map((item) => item.name).toString(),
						)
					}
					onMouseLeave={() => prop.closeEllipsisPopup()}
					style={{ textAlign: 'left' }}
				>
					{row.plants.map((item) => item.name).toString()}
				</div>
			),
		},
		{
			width: 150,
			title: 'Vehicle Line',
			field: 'allVehicleLines',
			enableSearch: true,
			enableFilter: true,
			filterFn: (row, value) => row.vehicleLines.some((i) => i.includes(value)),
			// eslint-disable-next-line no-unused-vars
			render: (row, index, prop) => (
				<div
					className={styles.ellipsisText}
					onMouseEnter={(e) =>
						prop.openEllipsisPopupForEventWithText(
							e,
							row.vehicleLines.toString(),
						)
					}
					onMouseLeave={() => prop.closeEllipsisPopup()}
					style={{ textAlign: 'left' }}
				>
					{row.vehicleLines.toString()}
				</div>
			),
		},
		{
			width: 180,
			title: 'Project Start Date',
			field: 'projectCreationDate',
			enableSearch: true,
			enableFilter: true,
		},
	];

	const baseDefaultColumnsOfPO = [
		{
			width: 140,
			title: 'PO Number',
			field: 'number',
			enableSearch: true,
			enableFilter: true,
		},
		{
			width: 200,
			title: 'Plant Info',
			field: 'plantName',
			enableSearch: true,
			enableFilter: true,
		},
		{
			width: 200,
			title: 'Part Description',
			field: 'partDesc',
			enableSearch: true,
			enableFilter: true,
		},
		{
			width: 180,
			title: 'PO Created Date',
			field: 'processCreationDate',
			enableSearch: true,
			enableFilter: true,
		},
	];

	const processPoList = (poList) => {
		const processedPoList = poList.map(({ ...po }) => {
			const plantName = po.plant.name;
			const partDesc = po.part.description;
			const id = po.number;
			const processCreationDate = moment(po.createdAt).format('DD/MM/YYYY');
			return {
				...po,
				id,
				plantName,
				partDesc,
				processCreationDate,
			};
		});
		return processedPoList;
	};

	const loadPO = async () => {
		try {
			setPOData((prev) => ({
				...prev,
				loading: true,
			}));

			const response = await API.get(API_RESOURCE_URLS.PURCHASE_ORDER, {
				params: {
					supplierId: supplierDetails ? supplierDetails.id : null,
					partNumber: part ? part.value : null,
					plantCode: plant ? plant.value : null,
					page: poData.number,
				},
			});
			const processedPoList = processPoList(response.data.content);

			setPOData((prev) => ({
				...prev,
				data: [...prev.data, ...processedPoList],
				filteredData: [...prev.filteredData, ...processedPoList],
				loading: false,
				last: response.data.last,
			}));
		} catch (error) {
			showInternalError(error);
			console.error(buildErrorMessage(error));
			setPOData({
				number: 0,
				data: [],
				filteredData: [],
				loading: false,
				last: false,
			});
		}
	};

	const handleValidation = (event, field) => {
		let err = errors;
		const { value } = event.target;

		switch (field) {
			case 'purchaseBuyerName':
				err['purchaseBuyerName'] = value
					? RegExp(Regex.name).test(value)
						? ''
						: 'Name is invalid'
					: 'Name is required';
				break;

			case 'suppRepresentativeName':
				err['suppRepresentativeName'] = value
					? RegExp(Regex.name).test(value)
						? ''
						: 'Name is invalid'
					: 'Name is required';
				break;

			case 'suppRepresentativeEmail':
				err['suppRepresentativeEmail'] = value
					? RegExp(Regex.email).test(value)
						? ''
						: 'Email is invalid'
					: 'Email is required';
				break;

			case 'suppRepresentativeContact':
				err['suppRepresentativeContact'] = value
					? RegExp(Regex.phone).test(value)
						? ''
						: 'Contact is invalid'
					: 'Contact is required';
				break;

			default:
				break;
		}
		dispatch({ type: 'update', field: 'errors', value: err });
	};

	const handleChange = (e, field) => {
		let fields = inputFields;
		fields[field] = e.target.value;
		dispatch({ type: 'update', field: 'inputFields', value: fields });
		handleValidation(e, field);
	};

	useEffect(() => {
		getSupplierDetails();
	}, [supplierCode]);

	useEffect(() => {
		getSupplierKamDetails();
	}, [kamDetails]);

	useEffect(() => {
		if (plant && part && supplierDetails) {
			loadPO();
		}
	}, [plant, part, supplierDetails, poData.number]);

	const renderProcessInfo = () => (
		<div
			className={styles.formGroup}
			style={{ backgroundColor: processInfoBg ? BG_COLOR : null }}
			onClick={() => changeBackgroundColor('processInfoBg')}
		>
			<div className={styles.formGroupRow}>
				<div className={styles.formRow}>
					<label className={styles.label}>Plant*</label>
					<CustomSelect
						name="plant"
						isMandatory
						markIfUnselected={highlightMandatoryFields}
						resetAllVisitedFields={resetAllVisitedFields}
						options={getPlantsOptions()}
						className={clsx(styles.select, styles.sel1)}
						value={plant}
						isMulti={false}
						isClearable
						onChange={(e) => {
							dispatch({ type: 'update', field: 'plant', value: e });
							if (part)
								dispatch({ type: 'update', field: 'part', value: null });
							if (supplierCode) resetSupplier();
							if (poData.data.length) resetTableData();
						}}
					/>
				</div>
				<div className={styles.formRow}>
					<label className={styles.label}>Part no*</label>
					<CustomSelect
						name="part"
						isMandatory
						markIfUnselected={highlightMandatoryFields}
						resetAllVisitedFields={resetAllVisitedFields}
						options={getPartsOptions()}
						className={clsx(styles.select, styles.sel1)}
						value={part}
						isMulti={false}
						isClearable
						onChange={(e) => {
							dispatch({ type: 'update', field: 'part', value: e });
							if (supplierCode) resetSupplier();
							if (poData.data.length) resetTableData();
						}}
					/>
				</div>
				<div className={styles.formRow}>
					<label className={styles.label}>PPAP Reason*</label>
                  <CustomSelect
                    name="ppap-reason"
					isMandatory
                    markIfUnselected={highlightMandatoryFields}
					resetAllVisitedFields={resetAllVisitedFields}
                    options={getPpapReasonOptions()}
                    className={clsx(styles.select, styles.sel1)}
                    value={ppapReason}
                    onChange={(selection) => dispatch({ type: 'update', field: 'ppapReason', value: selection })} />

				</div>
			</div>
			<div className={styles.formGroupRow}>
				<div className={styles.formRow}>
					<label className={styles.label}>Purchase commodity*</label>
					<CustomSelect
						name="purchaseCommodity"
						isMandatory
						markIfUnselected={highlightMandatoryFields}
						resetAllVisitedFields={resetAllVisitedFields}
						options={getPurchaseCommodityOptions()}
						className={clsx(styles.select, styles.sel1)}
						value={purchaseCommodity}
						isMulti={false}
						isClearable
						onChange={(e) =>
							dispatch({ type: 'update', field: 'purchaseCommodity', value: e })
						}
					/>
				</div>
				<div className={styles.formRow} style={{ position: 'relative' }}>
					<label className={styles.label}>Purchase buyer name*</label>
					<ValidatingTextField
						style={{ width: '60%' }}
						isMandatory
						validationFn={(value) => value.length > 0}
						markIfEmpty={highlightMandatoryFields}
						resetAllVisitedFields={resetAllVisitedFields}
						validationHelperText="error occured"
						variant="outlined"
						size="small"
						value={inputFields.purchaseBuyerName}
						onChange={(e) => handleChange(e, 'purchaseBuyerName')}
						placeholder="Enter purchase buyer name"
						className={styles.textField}
						inputProps={{
							className: styles.textInput,
							'data-testid': 'buyer-name-input',
						}}
						FormHelperTextProps={{
							className: styles.helperText,
						}}
					/>
					{errors && errors['purchaseBuyerName'] && (
						<span className={styles.error}>{errors['purchaseBuyerName']}</span>
					)}
				</div>
				<div className={styles.formRow}>
					<label className={styles.label}>AQ commodity*</label>
					<CustomSelect
						name="aqCommodity"
						isMandatory
						markIfUnselected={highlightMandatoryFields}
						resetAllVisitedFields={resetAllVisitedFields}
						options={getAqCommodityOptions()}
						className={clsx(styles.select, styles.sel1)}
						value={aqCommodity}
						isMulti={false}
						isClearable
						onChange={(e) =>
							dispatch({ type: 'update', field: 'aqCommodity', value: e })
						}
					/>
				</div>
			</div>
		</div>
	);

	const renderSupplier = () => (
		<div
			className={styles.formGroup}
			style={{ backgroundColor: supplierInfoBg ? BG_COLOR : null }}
			onClick={() => changeBackgroundColor('supplierInfoBg')}
		>
			<div className={styles.formGroupRow}>
				<div className={styles.formRow}>
					<label className={styles.label}>Supplier code*</label>
					<CustomSelect
						name="supplierCode"
						isMandatory
						markIfUnselected={highlightMandatoryFields}
						resetAllVisitedFields={resetAllVisitedFields}
						options={getSuppliersOptions()}
						className={clsx(styles.select, styles.sel1)}
						value={supplierCode}
						isMulti={false}
						isClearable
						onChange={(e) => {
							dispatch({ type: 'update', field: 'supplierCode', value: e });
							if (supplierCode) resetSupplier();
							if (poData.data.length) resetTableData();
						}}
					/>
				</div>
				<div className={styles.formRow}>
					<label className={styles.label}>Supplier name</label>
					<div style={{ width: '60%' }} className={styles.disableInput}>
						{supplierName}
					</div>
				</div>
				<div className={styles.formRow}>
					<label className={styles.label}>Supplier location</label>
					<div style={{ position: 'relative', width: '60%' }}>
						<div
							onMouseEnter={() => onHover('supplierLocation')}
							onMouseLeave={onLeave}
							role="button"
							tabIndex="-3"
							className={styles.disableInput}
						>
							{supplierLocation}
						</div>
						{hover.isHover &&
							hover.name === 'supplierLocation' &&
							supplierLocation && (
								<span className={styles.hoverText}> {supplierLocation} </span>
							)}
					</div>
				</div>
			</div>
			<div className={styles.formGroupRow}>
				<h4>Supplier Representative (KAM)</h4>
			</div>
			<div className={styles.formGroupRow}>
				<div className={styles.formRow}>
					<label className={styles.label}>Name</label>
					<div
						style={{ width: '60%' }}
						className={styles.disableInput}
						data-testid="representative-name-input"
					>
						{supplierRepresentativeName}
					</div>
				</div>
				<div className={styles.formRow}>
					<label className={styles.label}>Contact no.</label>
					<div
						style={{ width: '60%' }}
						className={styles.disableInput}
						data-testid="representative-contact-input"
					>
						{supplierRepresentativeContactNo}
					</div>
				</div>
				<div className={styles.formRow}>
					<label className={styles.label}>Email id</label>
					<div style={{ position: 'relative', width: '60%' }}>
						<div
							onMouseEnter={() => onHover('supplierLocation')}
							onMouseLeave={onLeave}
							role="button"
							tabIndex="-3"
							className={styles.disableInput}
							data-testid="representative-email-input"
						>
							{supplierRepresentativeEmailId}
						</div>
						{hover.isHover &&
							hover.name === 'supplierLocation' &&
							supplierLocation && (
								<span className={styles.hoverText}>
									{' '}
									{supplierRepresentativeEmailId}{' '}
								</span>
							)}
					</div>
				</div>
			</div>
		</div>
	);

	const renderPO = () => (
		<div
			className={styles.tableView}
			style={{ flex: 0.97, backgroundColor: poInfoBg ? BG_COLOR : null }}
			onClick={() => changeBackgroundColor('poInfoBg')}
		>
			{poData && poData.data && poData.data.length > 0 && (
				<>
					<Table
						columns={[...baseDefaultColumnsOfPO]}
						defaultColumns={[...baseDefaultColumnsOfPO]}
						rowHeight={ROW_HEIGHT}
						rows={poData.data}
						removeRowSelection
						isDataLoading={poData.loading}
						setAsnCount={null}
						classNames={{
							tableContainerClassName: styles.tableContainerClassName,
						}}
						hideActionButtons
						showRadioButton
						tableName="purchaseOrder"
						onSelect={(e) => {
							dispatch({
								type: 'update',
								field: 'selectedPO',
								value: e.number,
							});
						}}
						pagination={{
							last: poData.last,
							setCurrentPageNumber: setPOData,
						}}
					/>
				</>
			)}

			{(!poData || poData.data.length === 0) && (
				<div style={{ margin: '10px' }}>No data found</div>
			)}

			{highlightMandatoryFields && !selectedPO && (
				<p className={styles.errormsg}>Please select PO</p>
			)}
		</div>
	);

	const renderProjects = () => (
		<div
			className={styles.tableView}
			style={{ flex: 0.97, backgroundColor: projectsInfoBg ? BG_COLOR : null }}
			onClick={() => changeBackgroundColor('projectsInfoBg')}
		>
			{rowsData && rowsData.data && rowsData.data.length > 0 && (
				<Table
					columns={[...baseDefaultColumns]}
					defaultColumns={[...baseDefaultColumns]}
					rowHeight={ROW_HEIGHT}
					rows={rowsData.data}
					removeRowSelection
					isDataLoading={rowsData.loading}
					setAsnCount={null}
					classNames={{
						tableContainerClassName: styles.tableContainerClassName,
					}}
					hideActionButtons
					showRadioButton
					tableName="projects"
					onSelect={(e) =>
						dispatch({ type: 'update', field: 'selectedProject', value: e.id })
					}
				/>
			)}

			{(!rowsData || rowsData.data.length === 0) && (
				<div style={{ margin: '10px' }}>No data found</div>
			)}
			{highlightMandatoryFields && !selectedProject && (
				<p className={styles.errormsg}>Please select Project</p>
			)}
		</div>
	);

	const getSelectedFields = () => ({
		projectId: selectedProject,
		poNumber: selectedPO,
		reasonId: ppapReason && ppapReason?.value,
		commodityGroupId: purchaseCommodity && purchaseCommodity.value,
		aqCommodityGroupId: aqCommodity && aqCommodity.value,
		purchaseBuyerName: inputFields?.purchaseBuyerName,
		kamContactDetails: {
			// id: inputFields,
			name: supplierRepresentativeName,
			contactNumber: supplierRepresentativeContactNo,
			emailId: supplierRepresentativeEmailId,
		},
	});

	const validateFields = (fields) => {
		const requiredFields = { ...fields, ...fields.kamContactDetails };
		const hasMissingRequiredFields = Object.values(requiredFields).some(
			(field) => !field,
		);
		const hasError = Object.values(errors).some((err) => err);

		if (hasMissingRequiredFields || hasError) {
			return false;
		}
		return true;
	};

	const selectedField = getSelectedFields();
	const mandatoryFields = validateFields(selectedField);

	const runPreSubmissionChecks = () => {
		const selectedFields = getSelectedFields();
		const areFieldsValid = validateFields(selectedFields);

		if (!areFieldsValid) {
			setHighlightMandatoryFields(true);
			return false;
		}
		return true;
	};

	const handleSubmit = async () => {
		const selectedFields = getSelectedFields();
		try {
			await API.post(`${API_RESOURCE_URLS.PROCESS}`, {
				...selectedFields,
			});
			showPopup({
				type: MESSAGE_TYPE.SUCCESS,
				contextText: 'Process has been created successfully.',
			});
			redirectToProcessPage();
		} catch (error) {
			console.error(buildErrorMessage(error));
			showPopup({
				type: MESSAGE_TYPE.FAILURE,
				contextText: DISPLAY_MESSAGES.PPAP_INITIATION_FAILURE,
				info: 'Process Creation failed.',
				error,
			});
		}
	};

	const resetTableData = () => {
		// setRowsData(prev => ({
		//   ...prev,
		//   data: prev.data.map(row =>
		//     row.isSelected === true ? { ...row, isSelected: false } : row,
		//   ),
		// }));
		// setPOData(prev => ({
		//   ...prev,
		//   data: prev.data.map(row =>
		//     row.isSelected === true ? { ...row, isSelected: false } : row,
		//   ),
		// }));

		setRowsData({
			loading: false,
			data: [],
			filteredData: [],
		});
		setPOData({
			loading: false,
			data: [],
			filteredData: [],
			last: false,
			number: 0,
		});
		dispatch({ type: 'update', field: 'selectedPO', value: null });
		dispatch({ type: 'update', field: 'selectedProject', value: null });
	};

	const resetSupplier = () => {
		dispatch({ type: 'update', field: 'supplierCode', value: null });
		dispatch({ type: 'update', field: 'supplierDetails', value: null });
		dispatch({ type: 'update', field: 'supplierName', value: '' });
		dispatch({ type: 'update', field: 'supplierLocation', value: '' });
		dispatch({ type: 'update', field: 'supplierKamDetails', value: null });
		dispatch({
			type: 'update',
			field: 'supplierRepresentativeName',
			value: '',
		});
		dispatch({
			type: 'update',
			field: 'supplierRepresentativeContactNo',
			value: '',
		});
		dispatch({
			type: 'update',
			field: 'supplierRepresentativeEmailId',
			value: '',
		});
	};

	const resetAllInputs = () => {
		const inputs = {
			purchaseBuyerName: '',
		};
		dispatch({ type: 'update', field: 'inputFields', value: inputs });
		dispatch({ type: 'update', field: 'errors', value: {} });
	};

	const resetState = () => {
		dispatch({ type: 'reset' });
		resetAllInputs();
		resetTableData();
		setHighlightMandatoryFields(null);
		setResetAllVisitedFields(false);
		changeBackgroundColor('processInfoBg');
	};

	useEffect(() => {
		if (resetAllVisitedFields) resetState();
	}, [resetAllVisitedFields]);

	return (
		<>
			<div className={styles.formContainer}>
				<CustomFormGroup header="Process Info" body={renderProcessInfo()} />
				<CustomFormGroup header="Supplier Info" body={renderSupplier()} />
				<CustomFormGroup header="PO Info" body={renderPO()} />
				<CustomFormGroup header="Project Info" body={renderProjects()} />
			</div>

			<div className={styles.actionBar}>
				<Button
					className={clsx(styles.actionButton, styles.resetButton)}
					variant="tertiary"
					onClick={handleOpen}
				>
					RESET
				</Button>
				<AuthChecker operation={USER_OPERATIONS.CREATE_PPAP}>
					{(isAuthorized) => (
						<Button
							className={clsx(styles.actionButton, styles.primaryActionButton)}
							variant="primary"
							onClick={() => runPreSubmissionChecks() && handleSubmit()}
							disabled={!isAuthorized || !supplierRepresentativeName || !mandatoryFields}
							data-testid="confirm-action"
						>
							SUBMIT
						</Button>
					)}
				</AuthChecker>
			</div>
			<ResetModal
				isPopupOpen={isPopupOpen}
				handleClose={handleClose}
				resetFields={resetFields}
			/>
		</>
	);
}

function ResetModal({ isPopupOpen, handleClose, resetFields }) {
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
						<MdReplay style={{ height: '18px', width: '18px' }} />
						<span className={styles.txt}>Reset</span>
					</span>
				</DialogTitle>
				<DialogContent className={styles.content}>
					<span>Are you sure you want to reset the form?</span>
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
						variant="primary"
						onClick={(e) => {
							e?.preventDefault();
							handleClose();
							resetFields();
						}}
					>
						YES
					</Button>
				</DialogActions>
			</>
		</Dialog>
	);
}

CreateProcessForm.propTypes = {
	redirectToProcessPage: PropTypes.func,
};

ResetModal.propTypes = {
	isPopupOpen: PropTypes.bool.isRequired,
	handleClose: PropTypes.func.isRequired,
	resetFields: PropTypes.func.isRequired,
};

export default withAllowedOperationsProvider(
	CreateProcessForm,
	RESOURCE_TYPE.PPAP,
);
