/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable consistent-return */
import React from 'react';
import {
	render,
	fireEvent,
	within,
	waitFor,
	getTestAuthPolicy,
	screen,
} from '../../../test-utils';
import { API } from '../../../apis/api';
import { API_RESOURCE_URLS } from '../../../constants';
import CreateProcessForm from '../CreateProcessForm';

jest.mock('react-virtualized', () => {
	const ReactVirtualized = jest.requireActual('react-virtualized');
	return {
		...ReactVirtualized,
		AutoSizer: ({ children }) => children({ height: 1000, width: 1000 }),
	};
});

beforeEach(() => {
	API.post.mockReset();
	API.get.mockReset();

	API.get.mockImplementation((url) => {
		if (url.endsWith(API_RESOURCE_URLS.getAllPlants())) {
			return Promise.resolve({ data: testPlants });
		}
		if (url.endsWith(API_RESOURCE_URLS.getAllParts())) {
			return Promise.resolve({ data: testParts });
		}
		if (url.endsWith(API_RESOURCE_URLS.getAqCommodity())) {
			return Promise.resolve({ data: testAqCommodity });
		}
		if (url.endsWith(API_RESOURCE_URLS.getPurchaseCommodity())) {
			return Promise.resolve({ data: testPurchaseCommodity });
		}
		if(url.endsWith(API_RESOURCE_URLS.PPAP_REASONS)) {
			return Promise.resolve({ data: testPpapReasons });
		  }
		if (url.endsWith(API_RESOURCE_URLS.getSuppliers())) {
			return Promise.resolve({ data: testSuppliers });
		}
		if (url.endsWith(API_RESOURCE_URLS.PROJECTS)) {
			return Promise.resolve({ data: testProjects });
		}
		if (url.endsWith(API_RESOURCE_URLS.PURCHASE_ORDER)) {
			return Promise.resolve({ data: testPoList });
		}
		if (url.includes(API_RESOURCE_URLS.getKamDetails(testSuppliers[0].code))) {
			return Promise.resolve({ data: testKamDetails });
		}
	});
});

const testPlants = [
	{ code: '1001', name: 'CV Pune', businessUnits: [{ name: 'CVBU' }] },
	{ code: '1002', name: "CV C'wad Fdy", businessUnits: [{ name: 'CVBU' }] },
];

const testParts = [
	{ number: '573609130109', description: 'PIPE ASSY,AIR FILTER TO HOSE' },
];

const testAqCommodity = [
	{ id: 'cv-aq-body', name: 'CV AQ Body' },
	{
		id: 'cv-aq-casting-forging-machining',
		name: 'CV AQ Casting, Forging & Machining',
	},
];

const testPurchaseCommodity = [
	{ id: 'powertrain', name: 'Central Powertrain' },
	{ id: 'high-value-purchase', name: 'Central High Value Purchase' },
];

const testSuppliers = [
	{
		code: 'Y00480',
		groupCode: 'Y00480',
		id: '4da04efa-4abd-45cf-bad1-70d119a55444',
		name: 'ABC COMPONENTS (P) LTD',
		address: {
			city: 'TestCity1',
			district: '',
			pincode: '123456',
			value: 'Test-address-1234',
		},
	},
];

const testKamDetails = {
	name: 'Joe Armstrong',
	contactNumber: '9127447334',
	emailId: 'ep-esakha-supplier+a06127k01@sahaj.ai',
};

const testProjects = [
	{
		id: '4da2f105-e92d-4978-bf23-94655cb77dcf',
		code: '123456',
		name: 'test',
		plants: [
			{ code: '1001', name: 'CV Pune', businessUnits: [{ name: 'CVBU' }] },
		],
		vehicleLines: ['ARIA'],
		businessUnit: 'CVBU',
		projectMilestoneTimelines: [
			{ projectMilestone: 'ALPHA', timeline: '2021-12-02' },
			{ projectMilestone: 'BETA', timeline: '2021-12-22' },
			{ projectMilestone: 'PO', timeline: '2021-12-23' },
			{ projectMilestone: 'PP', timeline: '2021-12-24' },
			{ projectMilestone: 'SOP', timeline: '2021-12-25' },
		],
		vehicleProjections: [
			{ count: 98, year: '2021' },
			{ count: 100, year: '2022' },
			{ count: 100, year: '2023' },
			{ count: 100, year: '2024' },
			{ count: 100, year: '2025' },
		],
		remarks: 'test',
		createdBy: 'tmldev',
		createdAt: 1640076117041,
	},
];

const testPoList = {
	content: [
		{
			number: '3540049182',
			createdAt: 1628793000,
			supplier: {
				id: 'Test-ID-1234',
				code: 'A1234',
				groupCode: 'A1234',
				name: 'TEST LTD UNIT 1',
				address: {
					value: 'Test-address-3',
					city: 'TestCity3',
					district: '',
					pincode: '832108',
				},
			},
			part: { number: '123400065', description: 'TEST PANEL ASSY,AB' },
			description: 'TEST PANEL ASSY,AB',
			commodityGroups: [{ id: 'cv-body', name: 'CV Body' }],
			plant: {
				code: '1001',
				name: 'AB-XYZ',
				businessUnits: [{ name: 'CVBU' }],
			},
		},
		{
			number: '3540049171',
			createdAt: 1628706600,
			supplier: {
				id: '694cd540-1e4a-4a5f-b4d3-1448d2baae97',
				code: 'F61221',
				groupCode: 'F61220',
				name: 'FLEETGUARD FILTERS PVT LTD',
				address: {
					value: 'PLOT NO 304 ANDAR KISIM DON IIAT MOUZA RAM CHANDRA PUR',
					city: 'JAMSHEDPUR',
					district: 'KHARSWAN',
					pincode: '832108',
				},
			},
			part: { number: '570109130344', description: 'PIPE ASSY' },
			description: 'PIPE ASSY',
			commodityGroups: [{ id: 'powertrain', name: 'Central Powertrain' }],
			plant: {
				code: '2001',
				name: 'CV Jamshedpur',
				businessUnits: [{ name: 'CVBU' }],
			},
		},
	],
	last: true,
};
const testBuyerName = 'testBuyer';
const testPpapReasons = [
	{ id: 1, reason: "Change in Part Processing" },
	{ id: 2, reason: "Change to Optional Construction or Material" },
	{ id: 3, reason: "Correction of Discrepancy" },
	{ id: 4, reason: "Engineering Change(s)" },
	{ id: 5, reason: "Initial Submission" },
	{ id: 6, reason: "Re-PPAP" },
	{ id: 7, reason: "Sub Supplier or Material Source Change" },
	{ id: 8, reason: "Tooling Inactive > than 1 year" },
	{
	  id: 9,
	  reason: "Tooling: Transfer, Replacement,Refurbishment or Additional",
	},
  ];

const selections = [
	['plant', `${testPlants[0].name} - ${testPlants[0].code}`],
	['part', testParts[0].number],
	['ppap-reason', testPpapReasons[0].reason],
	['purchaseCommodity', testPurchaseCommodity[0].name],
	['supplierCode', `${testSuppliers[0].code} - ${testSuppliers[0].name}`],
	['aqCommodity', testAqCommodity[0].name],
];

const inputs = [['buyer-name-input', testBuyerName]];

const redirectToApplicationLandingPage = jest.fn();

const clickOptionForReactSelect = async ({ selectName, option }) => {
	const input = document.querySelector(`.select-${selectName}__control input`);
	const controlComp = document.querySelector(`.select-${selectName}__control`);
	fireEvent.focus(input);
	fireEvent.mouseDown(controlComp);
	const menu = document.querySelector(`.select-${selectName}__menu`);
	const { findByText } = within(menu);
	fireEvent.click(await findByText(option));
};

const setTarget = (getByTestId, testId, value) => {
	// const dayTargetInput = getByTestId(testId);
	// fireEvent.change(dayTargetInput, {
		// target: { value },
	// });
};

describe('to test authorization', () => {
	it('CONFIRM button should be disabled for read only', () => {
		const testAuthPolicy = getTestAuthPolicy('read-only');
		const testAuthUser = {
			email: 'apollo-tyres@at.com',
			isLoaded: true,
			name: 'Apollo Tyres',
			userID: '5ee5fd04-8b36-4873-8b44-18f84ead166a',
		};

		const { getByRole } = render(
			<CreateProcessForm
				redirectToApplicationLandingPage={redirectToApplicationLandingPage}
			/>,
			{
				wrapperProps: {
					testAuthPolicy,
					testAuthUser,
				},
			},
		);

		expect(getByRole('button', { name: /SUBMIT/ })).toBeDisabled();
	});
n
	it.skip('CONFIRM button should be enabled process', async () => {
		const testAuthPolicy = getTestAuthPolicy('process');
		const testAuthUser = {
			email: 'punesqengineer@pb.tml',
			isLoaded: true,
			name: 'Pune-Plant SQ Engineer',
			userID: '8289eb80-b90f-41ae-a7ed-03309d536718',
		};

		const { getByRole, getByTestId, findByTestId } = render(
			<CreateProcessForm
				redirectToApplicationLandingPage={redirectToApplicationLandingPage}
			/>,
			{
				wrapperProps: {
					testAuthPolicy,
					testAuthUser,
				},
			},
		);

		for (const selection of selections) {
			const [selectName, option] = selection;
			await clickOptionForReactSelect({
				selectName,
				option,
			});
		}

    // console.log("hehehheeehhehe----------", selectName);

		// for (const input of inputs) {
		// 	const [testId, value] = input;
		// 	setTarget(getByTestId, testId, value);
		// }
		// console.log("----------", testId);

		fireEvent.click(getByTestId('radio-row-3540049182'));
		fireEvent.click(
			await findByTestId('radio-row-4da2f105-e92d-4978-bf23-94655cb77dcf'),
		);
		
		expect(getByRole('button', { name: /SUBMIT/ }).closest('button')).toBeEnabled();
	});
});

it.skip('should be able to select values for fields and submit', async () => {
	const testAuthPolicy = getTestAuthPolicy('process');
	const testAuthUser = {
		email: 'punesqengineer@pb.tml',
		isLoaded: true,
		name: 'Pune-Plant SQ Engineer',
		userID: '8289eb80-b90f-41ae-a7ed-03309d536718',
	};

	const { getByTestId, getByText, findByTestId } = render(
		<CreateProcessForm
			redirectToApplicationLandingPage={redirectToApplicationLandingPage}
		/>,
		{
			wrapperProps: {
				testAuthPolicy,
				testAuthUser,
			},
		},
	);

	for (const selection of selections) {
		const [selectName, option] = selection;
		await clickOptionForReactSelect({
			selectName,
			option,
		});
	}

	for (const input of inputs) {
		const [testId, value] = input;
		setTarget(getByTestId, testId, value);
	}

	fireEvent.click(getByTestId('radio-row-3540049182'));

	fireEvent.click(
		await findByTestId('radio-row-4da2f105-e92d-4978-bf23-94655cb77dcf'),
	);

	const confirmButton = getByText('SUBMIT');

	fireEvent.click(confirmButton);

	// NOTE: debug with try catch around the expect to see the proper assertion failure message if any
	await waitFor(() =>
		expect(API.post).toHaveBeenCalledWith(API_RESOURCE_URLS.PROCESS, {
			projectId: testProjects[0].id,
			poNumber: testPoList.content[0].number,
			commodityGroupId: testPurchaseCommodity[0].id,
			aqCommodityGroupId: testAqCommodity[0].id,
			reasonId: testPpapReasons[0].id,
			purchaseBuyerName: testBuyerName,
			kamContactDetails: testKamDetails,
		}),
	);
});

describe('testing for mandatory fields checks', () => {
	beforeEach(() => {
		API.post.mockReset();
		API.get.mockReset();

		API.get.mockImplementation((url) => {
			if (url.endsWith(API_RESOURCE_URLS.getAllPlants())) {
				return Promise.resolve({ data: testPlants });
			}
			if (url.endsWith(API_RESOURCE_URLS.getAllParts())) {
				return Promise.resolve({ data: testParts });
			}
			if (url.endsWith(API_RESOURCE_URLS.getAqCommodity())) {
				return Promise.resolve({ data: testAqCommodity });
			}
			if(url.endsWith(API_RESOURCE_URLS.PPAP_REASONS)) {
				return Promise.resolve({ data: testPpapReasons });
			  }
			if (url.endsWith(API_RESOURCE_URLS.getPurchaseCommodity())) {
				return Promise.resolve({ data: testPurchaseCommodity });
			}
			if (url.endsWith(API_RESOURCE_URLS.getSuppliers())) {
				return Promise.resolve({ data: testSuppliers });
			}
			if (url.endsWith(API_RESOURCE_URLS.PROJECTS)) {
				return Promise.resolve({ data: testProjects });
			}
			if (url.endsWith(API_RESOURCE_URLS.PURCHASE_ORDER)) {
				return Promise.resolve({ data: testPoList });
			}
			if (url.endsWith(API_RESOURCE_URLS.getKamDetails())) {
				return Promise.resolve({ data: testKamDetails });
			}
		});
	});

	it.each(selections.map((selection) => selection[0]))(
		'should not submit if %s is not selected',
		async (selectionToExclude) => {
			const testAuthPolicy = getTestAuthPolicy('process');
			const testAuthUser = {
				email: 'punesqengineer@pb.tml',
				isLoaded: true,
				name: 'Pune-Plant SQ Engineer',
				userID: '8289eb80-b90f-41ae-a7ed-03309d536718',
			};

			const { getByTestId, getByText, findByTestId } = render(
				<CreateProcessForm
					redirectToApplicationLandingPage={redirectToApplicationLandingPage}
				/>,
				{
					wrapperProps: {
						testAuthPolicy,
						testAuthUser,
					},
				},
			);

			const limitedSelections = selections.filter(
				selection => selectionToExclude === 'plant'
				  ? (selection[0] !== 'purchaseCommodity' && selection[0] !==  'aqCommodity')
				  : selection[0] !== selectionToExclude,
			  );

			for (const selection of limitedSelections) {
				const [selectName, option] = selection;
				await clickOptionForReactSelect({
					selectName,
					option,
				});
			}

			for (const input of inputs) {
				const [testId, value] = input;
				setTarget(getByTestId, testId, value);
			}

			if (
				selectionToExclude !== 'plant' &&
				selectionToExclude !== 'part' &&
				selectionToExclude !== 'supplierCode'
			) {
				fireEvent.click(getByTestId('radio-row-3540049182'));
				fireEvent.click(
					await findByTestId('radio-row-4da2f105-e92d-4978-bf23-94655cb77dcf'),
				);
			}

			const confirmButton = getByText('SUBMIT');

			fireEvent.click(confirmButton);

			await waitFor(() => expect(API.post).not.toHaveBeenCalledWith());
		},
	);

	it.each(inputs.map((input) => input[0]))(
		'should not submit if %s is empty',
		async (inputToExclude) => {
			const testAuthPolicy = getTestAuthPolicy('process');
			const testAuthUser = {
				email: 'punesqengineer@pb.tml',
				isLoaded: true,
				name: 'Pune-Plant SQ Engineer',
				userID: '8289eb80-b90f-41ae-a7ed-03309d536718',
			};

			const { getByTestId, getByText, findByTestId } = render(
				<CreateProcessForm
					redirectToApplicationLandingPage={redirectToApplicationLandingPage}
				/>,
				{
					wrapperProps: {
						testAuthPolicy,
						testAuthUser,
					},
				},
			);

			const limitedInputs = inputs.filter(
				(input) => input[0] !== inputToExclude,
			);

			for (const selection of selections) {
				const [selectName, option] = selection;
				await clickOptionForReactSelect({
					selectName,
					option,
				});
			}

			for (const input of limitedInputs) {
				const [testId, value] = input;
				setTarget(getByTestId, testId, value);
			}

			fireEvent.click(getByTestId('radio-row-3540049182'));

			fireEvent.click(
				await findByTestId('radio-row-4da2f105-e92d-4978-bf23-94655cb77dcf'),
			);

			const confirmButton = getByText('SUBMIT');

			fireEvent.click(confirmButton);

			await waitFor(() => expect(API.post).not.toHaveBeenCalledWith());
		},
	);

	it('should not submit if po number is not selected', async () => {
		const testAuthPolicy = getTestAuthPolicy('process');
		const testAuthUser = {
			email: 'punesqengineer@pb.tml',
			isLoaded: true,
			name: 'Pune-Plant SQ Engineer',
			userID: '8289eb80-b90f-41ae-a7ed-03309d536718',
		};

		const { getByTestId, getByText, findByTestId } = render(
			<CreateProcessForm
				redirectToApplicationLandingPage={redirectToApplicationLandingPage}
			/>,
			{
				wrapperProps: {
					testAuthPolicy,
					testAuthUser,
				},
			},
		);

		for (const selection of selections) {
			const [selectName, option] = selection;
			await clickOptionForReactSelect({
				selectName,
				option,
			});
		}

		for (const input of inputs) {
			const [testId, value] = input;
			setTarget(getByTestId, testId, value);
		}

		const confirmButton = getByText('SUBMIT');

		fireEvent.click(confirmButton);

		await waitFor(() => expect(API.post).not.toHaveBeenCalledWith());
	});

	it('should not submit if project is not selected', async () => {
		const testAuthPolicy = getTestAuthPolicy('process');
		const testAuthUser = {
			email: 'punesqengineer@pb.tml',
			isLoaded: true,
			name: 'Pune-Plant SQ Engineer',
			userID: '8289eb80-b90f-41ae-a7ed-03309d536718',
		};

		const { getByTestId, getByText } = render(
			<CreateProcessForm
				redirectToApplicationLandingPage={redirectToApplicationLandingPage}
			/>,
			{
				wrapperProps: {
					testAuthPolicy,
					testAuthUser,
				},
			},
		);

		for (const selection of selections) {
			const [selectName, option] = selection;
			await clickOptionForReactSelect({
				selectName,
				option,
			});
		}

		for (const input of inputs) {
			const [testId, value] = input;
			setTarget(getByTestId, testId, value);
		}

		fireEvent.click(getByTestId('radio-row-3540049182'));

		const confirmButton = getByText('SUBMIT');

		fireEvent.click(confirmButton);

		await waitFor(() => expect(API.post).not.toHaveBeenCalledWith());
	});
});

it('should reset values when users press yes button', async () => {
	const testAuthPolicy = getTestAuthPolicy('process');
	const testAuthUser = {
		email: 'punesqengineer@pb.tml',
		isLoaded: true,
		name: 'Pune-Plant SQ Engineer',
		userID: '8289eb80-b90f-41ae-a7ed-03309d536718',
	};

	const { getByTestId, getByRole } = render(
		<CreateProcessForm
			redirectToApplicationLandingPage={redirectToApplicationLandingPage}
		/>,
		{
			wrapperProps: {
				testAuthPolicy,
				testAuthUser,
			},
		},
	);

	const [testId, value] = inputs[0];
	setTarget(getByTestId, testId, value);

	fireEvent.click(getByRole('button', { name: /RESET/ }));
	expect(getByTestId('reset-popup')).toBeInTheDocument();

	fireEvent.click(getByRole('button', { name: /YES/ }));

	// expect(getByTestId(testId)).toHaveTextContent('');
});
