/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */
/* eslint-disable consistent-return */
import React from 'react';
import { render, fireEvent, waitFor } from '../../../../test-utils';
import { API } from '../../../../apis/api';
import { ActionButtons } from '../../..';
import ProcessStage from '../ProcessStage';

const setTarget = (getByTestId, testId, value) => {
  const dayTargetInput = getByTestId(testId);
  fireEvent.change(dayTargetInput, {
    target: { value },
  });
};

describe('test save as draft while PIST submission', () => {
  const testPpap = {
		id: 44,
		purchaseOrder: {
			number: '3540049182',
			createdAt: 1628793000,
		},
		supplier: {
			id: '606bb4b9-c88b-4d3d-b094-2388e69e256e',
			code: 'A13130',
			groupCode: 'A13130',
			name: 'AUTOPROFILES LTD UNIT 1',
			address: {
				value: 'PLOT NO-C-33 C-34 &C-35PHASEIVINDUSTRIAL AREA GAMARIA',
				city: 'JAMSHEDPUR',
				district: '',
				pincode: '832108',
			},
		},
		part: {
			revisionId: 'd7a733a0-5f04-4aef-b614-c3ad80b2ca2c',
			number: '268062610106',
			description: 'TOE PANEL ASSY,LH',
			partGroup: {
				id: 'ZZZZZZ',
				description: 'Default for DENIS',
			},
			drawingNumber: '268062610106',
			revisionLevel: 'NR',
			gross: {
				value: 0,
				unit: 'KG',
			},
			net: {
				value: 0,
				unit: 'KG',
			},
			createdAt: 1618857000,
		},
		plant: {
			code: '2001',
			name: 'CV Jamshedpur',
			businessUnits: [
				{
					name: 'CVBU',
				},
			],
		},
		commodityGroup: 'Central Electric Hybrid',
		aqCommodityGroup: 'CV AQ Chassis',
		purchaseBuyerName: 'errtyui',
		project: {
			id: '58442544-66c5-43b5-adad-88edb6c27009',
			code: 'ABC123',
			name: 'Abc123',
			plants: [
				{
					code: '2001',
					name: 'CV Jamshedpur',
					businessUnits: [
						{
							name: 'CVBU',
						},
					],
				},
			],
			vehicleLines: ['ARIA'],
			businessUnit: 'CVBU',
			projectMilestoneTimelines: [
				{
					projectMilestone: 'PP',
					timeline: '2022-05-02',
				},
				{
					projectMilestone: 'BETA',
					timeline: '2022-04-30',
				},
				{
					projectMilestone: 'SOP',
					timeline: '2022-05-03',
				},
				{
					projectMilestone: 'PO',
					timeline: '2022-05-01',
				},
				{
					projectMilestone: 'ALPHA',
					timeline: '2022-04-29',
				},
			],
			vehicleProjections: [
				{
					count: 10,
					year: '2028',
				},
				{
					count: 1,
					year: '2024',
				},
				{
					count: 10,
					year: '2022',
				},
				{
					count: 1,
					year: '2026',
				},
				{
					count: 1,
					year: '2027',
				},
			],
			remarks: '',
			createdBy: {
				name: 'pune-sq-engineer',
				username: 'pune-sq-engineer',
			},
			createdAt: 1651237958674,
			updatedBy: {
				name: 'pune-sq-engineer',
				username: 'pune-sq-engineer',
			},
			updatedAt: 1651237958674,
		},
		state: 'PIST',
		requirement: {
			id: 'ac494697-1400-4758-b609-399cef8fbd7b',
			ppapId: 44,
			partCategory: {
				name: 'Gray Box',
				description: 'Assembly - Customer Design, Child Part – Supplier Design',
				ppapSubmissionLevels: [
					{
						level: 'Level 4',
						description:
							'Production Warrant and other requirements as defined by TML',
					},
				],
			},
			level: {
				level: 'Level 4',
				description:
					'Production Warrant and other requirements as defined by TML',
			},
			overriddenLevel: {
				level: 'Level 4',
				description:
					'Production Warrant and other requirements as defined by TML',
			},
			reason: {
				id: 2,
				reason: 'Change to Optional Construction or Material',
			},
			stageRequirements: [
				{
					id: '29a8d3be-0447-482b-baf7-c1f1856fe547',
					stage: {
						id: 1,
						name: 'PIST',
					},
					targetDate: '2022-05-21',
					documents: [
						{
							id: '7323b641-dc89-4fbc-9f40-35ca1706be91',
							name: 'PFD',
						},
						{
							id: 'a2ecdf50-40df-40d8-9f11-47e6d43431d2',
							name: 'Prototype control plan',
							templateDocument: {
								id: '0335906a-770f-4c92-b47a-1349a8b3a3db',
								uploadKey: 'ppap/template/Prototype control plan/file2.txt',
								documentName: 'file2.txt',
								uploadedBy: {
									name: 'pune-sq-engineer',
									username: 'pune-sq-engineer',
								},
								uploadedAt: 1651240279929,
							},
							_links: {
								DOWNLOAD_URL: {
									href:
										'https://api.ep-dev.tatamotors.com/ppap/documents/a2ecdf50-40df-40d8-9f11-47e6d43431d2/template/download',
								},
							},
						},
						{
							id: '5ed11254-da87-4cbf-b689-6169d6646ffe',
							name: 'IRMR/PIST',
							templateDocument: {
								id: 'fad557fe-7f08-4cb6-89c8-5ec88237def2',
								uploadKey: 'ppap/template/IRMR/PIST/file1.txt',
								documentName: 'file1.txt',
								uploadedBy: {
									name: 'pune-sq-engineer',
									username: 'pune-sq-engineer',
								},
								uploadedAt: 1651240219346,
							},
							_links: {
								DOWNLOAD_URL: {
									href:
										'https://api.ep-dev.tatamotors.com/ppap/documents/5ed11254-da87-4cbf-b689-6169d6646ffe/template/download',
								},
							},
						},
						{
							id: 'f18c98f5-a08f-4cfb-bd75-3155a47722e2',
							name: 'PFMEA',
						},
					],
					customDocuments: [],
				},
				{
					id: 'c87e6427-0eae-459f-b457-c3d9f705b26a',
					stage: {
						id: 2,
						name: 'PIPC',
					},
					targetDate: '2022-05-19',
					documents: [
						{
							id: 'a2011c78-d722-4e26-8517-1efd108e412e',
							name: 'Measurement System Analysis (MSA)',
						},
						{
							id: '4e3645c2-508a-4c83-9bd7-e5fecfdaafcf',
							name: 'Pre-launch control plan',
						},
						{
							id: '6d7a816f-4f17-4e38-aaae-182646529728',
							name: 'CTQ cascade',
						},
						{
							id: '7323b641-dc89-4fbc-9f40-35ca1706be91',
							name: 'PFD',
						},
						{
							id: 'e1bee347-835b-476c-a7c1-69dd9fd6fcc3',
							name: 'Open Issue tracking list',
						},
						{
							id: 'b81e0630-7c40-40aa-9aa8-bac325c53b09',
							name: 'EPC results',
						},
						{
							id: '99c18a5d-9b71-499c-870a-c39e145dc263',
							name: 'Tooling & equipment review',
						},
						{
							id: 'd104a8db-81da-418b-ad4f-e44ce68f9441',
							name: 'DVP&R',
						},
						{
							id: '534a7a45-9841-4806-af10-2e8e04400271',
							name: 'Capability study(PIPC)',
						},
						{
							id: 'f18c98f5-a08f-4cfb-bd75-3155a47722e2',
							name: 'PFMEA',
						},
						{
							id: 'b371fe79-f28f-4250-ba11-05a5cd0261f7',
							name: 'Production run (IR & set up approval)',
						},
						{
							id: '5e5fca57-73b6-4b20-8ff8-94bec376d753',
							name: 'Logistics sheet',
						},
					],
					customDocuments: [],
				},
				{
					id: 'fe98161e-d777-429d-a559-c10fbed278e6',
					stage: {
						id: 4,
						name: 'PSW',
					},
					targetDate: '2022-05-26',
					documents: [
						{
							id: '7b8a2826-a0ec-4110-88b2-72b64add17b1',
							name: 'PSW Signoff',
						},
					],
					customDocuments: [],
				},
			],
			remarks: '',
			rAndRWaiver: true,
			editStatus: 'COMPLETE',
			initiatedBy: {
				name: 'pune-sq-engineer',
				username: 'pune-sq-engineer',
			},
			initiatedAt: 1652789468466,
			attachments: [],
			reviews: [
				{
					id: '5c3e1d1a-61f8-46c7-a6f6-aeb845f4999d',
					user: {
						name: 'pune-sq-engineer',
						username: 'pune-sq-engineer',
					},
					createdAt: 1652786186383,
					remark: '',
					status: 'DISAPPROVE',
				},
				{
					id: 'c3241ce7-f0c5-428c-b8bb-d939a2bce17f',
					user: {
						name: 'pune-sq-engineer',
						username: 'pune-sq-engineer',
					},
					createdAt: 1652788290343,
					remark: '',
					status: 'DISAPPROVE',
				},
				{
					id: '44d5038e-2413-4c0a-8f11-bebd92de0f8f',
					user: {
						name: 'pune-sq-engineer',
						username: 'pune-sq-engineer',
					},
					createdAt: 1652784123384,
					remark: '',
					status: 'DISAPPROVE',
				},
				{
					id: '7c4c9483-78c0-43cc-aa79-84fc86aaaefd',
					user: {
						name: 'tmldev',
						username: 'tmldev',
					},
					createdAt: 1652795166227,
					remark: '',
					status: 'APPROVE',
				},
				{
					id: 'ac8be30d-55cb-42cc-9252-6fc530331921',
					user: {
						name: 'pune-sq-lead-engineer',
						username: 'pune-sq-lead-engineer',
					},
					createdAt: 1652788701816,
					remark: '',
					status: 'DISAPPROVE',
				},
				{
					id: 'cd785174-e2c2-4b77-91a8-2b1125965343',
					user: {
						name: 'pune-sq-lead-engineer',
						username: 'pune-sq-lead-engineer',
					},
					createdAt: 1652786368228,
					remark: '',
					status: 'DISAPPROVE',
				},
			],
		},
		apqpTimingChart: {
			id: 'ea1a6cde-3144-4f96-a230-38b9d5de18e4',
			ppapId: 44,
			knownActivityGroupTimelines: [
				{
					group: {
						id: 'supplier-build-schedule',
						name: 'Supplier Build Schedule',
					},
					activityTimelines: [],
				},
				{
					group: {
						id: 'engineering',
						name: 'Engineering',
					},
					activityTimelines: [],
				},
				{
					group: {
						id: 'manufacturing-planning',
						name: 'Manufacturing Planning',
					},
					activityTimelines: [],
				},
				{
					group: {
						id: 'subcontractor-planning',
						name: 'Subcontractor Planning',
					},
					activityTimelines: [],
				},
				{
					group: {
						id: 'quality-planning',
						name: 'Quality Planning',
					},
					activityTimelines: [],
				},
				{
					group: {
						id: 'training',
						name: 'Training',
					},
					activityTimelines: [],
				},
				{
					group: {
						id: 'process-validation',
						name: 'Process Validation',
					},
					activityTimelines: [],
				},
			],
			additionalActivityTimelines: [],
			editStatus: 'COMPLETE',
			remarks: [],
			reviews: [
				{
					id: 'c84472ac-2d3f-416f-b4f7-2359e8de4380',
					user: {
						name: 'pune-sq-engineer',
						username: 'pune-sq-engineer',
					},
					createdAt: 1652795343636,
					remark: 'done',
					status: 'APPROVE',
				},
			],
		},
		kamContactDetails: {
			id: '3f0f8a70-d588-4a00-b564-9fee2e2dd4cf',
			name: 'tryerut',
			contactNumber: '9876654433',
			emailId: 'iopkju34@gmail.com',
		},
		createdBy: {
			name: 'pune-sq-engineer',
			username: 'pune-sq-engineer',
		},
		createdAt: 1652783635279,
		_links: {
			self: {
				href:
					'https://api.ep-dev.tatamotors.com/ppap/supplier/606bb4b9-c88b-4d3d-b094-2388e69e256e/ppap/44',
			},
			PIPC: {
				href:
					'https://api.ep-dev.tatamotors.com/ppap/supplier/606bb4b9-c88b-4d3d-b094-2388e69e256e/ppap/44/stage/e2b9433b-1689-4520-8b86-6108df345e5c',
			},
			PSW: {
				href:
					'https://api.ep-dev.tatamotors.com/ppap/supplier/606bb4b9-c88b-4d3d-b094-2388e69e256e/ppap/44/stage/8ecb80b2-cc28-4980-ae97-2d0966e4c314',
			},
			PIST: {
				href:
					'https://api.ep-dev.tatamotors.com/ppap/supplier/606bb4b9-c88b-4d3d-b094-2388e69e256e/ppap/44/stage/c6917d48-faf1-4ba2-b5dc-98c30691453e',
			},
		},
	};

  const testStageData = {
		id: 'c6917d48-faf1-4ba2-b5dc-98c30691453e',
		stage: {
			id: 1,
			name: 'PIST',
		},
		targetDate: '2022-05-21',
		externalAttrsSchema: {
			$id: 'pist_external',
			type: 'object',
			title: 'PIST_External_Attrs',
			$schema: 'https://json-schema.org/draft/2020-12/schema',
			required: [
				'CTQCount',
				'StatisticalControlledParamsCount',
				'PokaYokesCount',
				'OkCTQCount',
				'HighActionPriorityProcessesCount',
			],
			properties: {
				CTQCount: {
					type: 'number',
					description: 'No. of CTQs',
				},
				OkCTQCount: {
					type: 'number',
					description: 'No. of OK CTQs',
				},
				PokaYokesCount: {
					type: 'number',
					description: 'Count of Poka Yokes',
				},
				HighActionPriorityProcessesCount: {
					type: 'number',
					description: 'Count of High Action Priority Processes',
				},
				StatisticalControlledParamsCount: {
					type: 'number',
					description: 'Count of Statistical Controlled Parameters',
				},
			},
			additionalProperties: false,
		},
		externalDocumentRequirements: [
			{
				id: '331c9310-bec4-4689-9ea5-baaacdf62dbd',
				document: {
					id: '7323b641-dc89-4fbc-9f40-35ca1706be91',
					name: 'PFD',
				},
				_links: {
					UPLOAD: {
						href:
							'https://api.ep-dev.tatamotors.com/ppap/supplier/606bb4b9-c88b-4d3d-b094-2388e69e256e/ppap/44/stage/c6917d48-faf1-4ba2-b5dc-98c30691453e/documentRequirement/331c9310-bec4-4689-9ea5-baaacdf62dbd/upload?documentName={documentName}',
						templated: true,
					},
				},
			},
			{
				id: '55cf21ad-d5f2-4d4c-8fe6-e298e333a23d',
				document: {
					id: 'a2ecdf50-40df-40d8-9f11-47e6d43431d2',
					name: 'Prototype control plan',
					templateDocument: {
						id: '0335906a-770f-4c92-b47a-1349a8b3a3db',
						uploadKey: 'ppap/template/Prototype control plan/file2.txt',
						documentName: 'file2.txt',
						uploadedBy: {
							name: 'pune-sq-engineer',
							username: 'pune-sq-engineer',
						},
						uploadedAt: 1651240279929,
					},
					_links: {
						TEMPLATE_DOWNLOAD_URL: {
							href:
								'https://api.ep-dev.tatamotors.com/ppap/documents/a2ecdf50-40df-40d8-9f11-47e6d43431d2/template/download',
						},
					},
				},
				_links: {
					UPLOAD: {
						href:
							'https://api.ep-dev.tatamotors.com/ppap/supplier/606bb4b9-c88b-4d3d-b094-2388e69e256e/ppap/44/stage/c6917d48-faf1-4ba2-b5dc-98c30691453e/documentRequirement/55cf21ad-d5f2-4d4c-8fe6-e298e333a23d/upload?documentName={documentName}',
						templated: true,
					},
				},
			},
			{
				id: '862fe1a6-edd2-4c9f-ada4-3ff986645f49',
				document: {
					id: 'f18c98f5-a08f-4cfb-bd75-3155a47722e2',
					name: 'PFMEA',
				},
				_links: {
					UPLOAD: {
						href:
							'https://api.ep-dev.tatamotors.com/ppap/supplier/606bb4b9-c88b-4d3d-b094-2388e69e256e/ppap/44/stage/c6917d48-faf1-4ba2-b5dc-98c30691453e/documentRequirement/862fe1a6-edd2-4c9f-ada4-3ff986645f49/upload?documentName={documentName}',
						templated: true,
					},
				},
			},
			{
				id: '6f78b513-4e75-40e7-94ac-45cff78c7593',
				document: {
					id: '5ed11254-da87-4cbf-b689-6169d6646ffe',
					name: 'IRMR/PIST',
					templateDocument: {
						id: 'fad557fe-7f08-4cb6-89c8-5ec88237def2',
						uploadKey: 'ppap/template/IRMR/PIST/file1.txt',
						documentName: 'file1.txt',
						uploadedBy: {
							name: 'pune-sq-engineer',
							username: 'pune-sq-engineer',
						},
						uploadedAt: 1651240219346,
					},
					_links: {
						TEMPLATE_DOWNLOAD_URL: {
							href:
								'https://api.ep-dev.tatamotors.com/ppap/documents/5ed11254-da87-4cbf-b689-6169d6646ffe/template/download',
						},
					},
				},
				_links: {
					UPLOAD: {
						href:
							'https://api.ep-dev.tatamotors.com/ppap/supplier/606bb4b9-c88b-4d3d-b094-2388e69e256e/ppap/44/stage/c6917d48-faf1-4ba2-b5dc-98c30691453e/documentRequirement/6f78b513-4e75-40e7-94ac-45cff78c7593/upload?documentName={documentName}',
						templated: true,
					},
				},
			},
		],
		status: 'PENDING_SUBMISSION',
		remarks: [],
		reviews: [],
		_links: {
			DRAFT: {
				href:
					'https://api.ep-dev.tatamotors.com/ppap/supplier/606bb4b9-c88b-4d3d-b094-2388e69e256e/ppap/44/stage/c6917d48-faf1-4ba2-b5dc-98c30691453e',
			},
			SUBMIT: {
				href:
					'https://api.ep-dev.tatamotors.com/ppap/supplier/606bb4b9-c88b-4d3d-b094-2388e69e256e/ppap/44/stage/c6917d48-faf1-4ba2-b5dc-98c30691453e/submission',
			},
			PPAP: {
				href:
					'https://api.ep-dev.tatamotors.com/ppap/supplier/606bb4b9-c88b-4d3d-b094-2388e69e256e/ppap/44',
			},
			self: {
				href:
					'https://api.ep-dev.tatamotors.com/ppap/supplier/606bb4b9-c88b-4d3d-b094-2388e69e256e/ppap/44/stage/c6917d48-faf1-4ba2-b5dc-98c30691453e',
			},
		},
	};

  const testPartialFilledStageData = {
		id: 'c6917d48-faf1-4ba2-b5dc-98c30691453e',
		stage: {
			id: 1,
			name: 'PIST',
		},
		targetDate: '2022-05-21',
		externalAttrsSchema: {
			$id: 'pist_external',
			type: 'object',
			title: 'PIST_External_Attrs',
			$schema: 'https://json-schema.org/draft/2020-12/schema',
			required: [
				'CTQCount',
				'StatisticalControlledParamsCount',
				'PokaYokesCount',
				'OkCTQCount',
				'HighActionPriorityProcessesCount',
			],
			properties: {
				CTQCount: {
					type: 'number',
					description: 'No. of CTQs',
				},
				OkCTQCount: {
					type: 'number',
					description: 'No. of OK CTQs',
				},
				PokaYokesCount: {
					type: 'number',
					description: 'Count of Poka Yokes',
				},
				HighActionPriorityProcessesCount: {
					type: 'number',
					description: 'Count of High Action Priority Processes',
				},
				StatisticalControlledParamsCount: {
					type: 'number',
					description: 'Count of Statistical Controlled Parameters',
				},
			},
			additionalProperties: false,
		},
		externalAttributes: {
			CTQCount: 9,
			OkCTQCount: 8,
			PokaYokesCount: 8,
			HighActionPriorityProcessesCount: 9,
			StatisticalControlledParamsCount: 8,
		},
		externalDocumentRequirements: [
			{
				id: '55cf21ad-d5f2-4d4c-8fe6-e298e333a23d',
				document: {
					id: 'a2ecdf50-40df-40d8-9f11-47e6d43431d2',
					name: 'Prototype control plan',
					templateDocument: {
						id: '0335906a-770f-4c92-b47a-1349a8b3a3db',
						uploadKey: 'ppap/template/Prototype control plan/file2.txt',
						documentName: 'file2.txt',
						uploadedBy: {
							name: 'pune-sq-engineer',
							username: 'pune-sq-engineer',
						},
						uploadedAt: 1651240279929,
					},
					_links: {
						TEMPLATE_DOWNLOAD_URL: {
							href:
								'https://api.ep-dev.tatamotors.com/ppap/documents/a2ecdf50-40df-40d8-9f11-47e6d43431d2/template/download',
						},
					},
				},
				submission: {
					id: 'cd013e4f-d9e0-4438-bc2c-b50873623378',
					documentName: 'DummyFile.txt',
					fileName: 'DummyFile.txt',
				},
				_links: {
					DELETE: {
						href:
							'https://api.ep-dev.tatamotors.com/ppap/supplier/606bb4b9-c88b-4d3d-b094-2388e69e256e/ppap/44/stage/c6917d48-faf1-4ba2-b5dc-98c30691453e/documentRequirement/55cf21ad-d5f2-4d4c-8fe6-e298e333a23d',
					},
					DOWNLOAD: {
						href:
							'https://api.ep-dev.tatamotors.com/ppap/supplier/606bb4b9-c88b-4d3d-b094-2388e69e256e/ppap/44/stage/c6917d48-faf1-4ba2-b5dc-98c30691453e/documentRequirement/55cf21ad-d5f2-4d4c-8fe6-e298e333a23d/download',
					},
				},
			},
			{
				id: '331c9310-bec4-4689-9ea5-baaacdf62dbd',
				document: {
					id: '7323b641-dc89-4fbc-9f40-35ca1706be91',
					name: 'PFD',
				},
				submission: {
					id: '5d44d606-f6e5-46ff-9f8f-9649b075ec39',
					documentName: 'DummyFile.txt',
					fileName: 'DummyFile.txt',
				},
				_links: {
					DELETE: {
						href:
							'https://api.ep-dev.tatamotors.com/ppap/supplier/606bb4b9-c88b-4d3d-b094-2388e69e256e/ppap/44/stage/c6917d48-faf1-4ba2-b5dc-98c30691453e/documentRequirement/331c9310-bec4-4689-9ea5-baaacdf62dbd',
					},
					DOWNLOAD: {
						href:
							'https://api.ep-dev.tatamotors.com/ppap/supplier/606bb4b9-c88b-4d3d-b094-2388e69e256e/ppap/44/stage/c6917d48-faf1-4ba2-b5dc-98c30691453e/documentRequirement/331c9310-bec4-4689-9ea5-baaacdf62dbd/download',
					},
				},
			},
			{
				id: '6f78b513-4e75-40e7-94ac-45cff78c7593',
				document: {
					id: '5ed11254-da87-4cbf-b689-6169d6646ffe',
					name: 'IRMR/PIST',
					templateDocument: {
						id: 'fad557fe-7f08-4cb6-89c8-5ec88237def2',
						uploadKey: 'ppap/template/IRMR/PIST/file1.txt',
						documentName: 'file1.txt',
						uploadedBy: {
							name: 'pune-sq-engineer',
							username: 'pune-sq-engineer',
						},
						uploadedAt: 1651240219346,
					},
					_links: {
						TEMPLATE_DOWNLOAD_URL: {
							href:
								'https://api.ep-dev.tatamotors.com/ppap/documents/5ed11254-da87-4cbf-b689-6169d6646ffe/template/download',
						},
					},
				},
				submission: {
					id: 'af799ba8-cec6-4542-b016-65512fb0536b',
					documentName: 'DummyFile.txt',
					fileName: 'DummyFile.txt',
				},
				_links: {
					DELETE: {
						href:
							'https://api.ep-dev.tatamotors.com/ppap/supplier/606bb4b9-c88b-4d3d-b094-2388e69e256e/ppap/44/stage/c6917d48-faf1-4ba2-b5dc-98c30691453e/documentRequirement/6f78b513-4e75-40e7-94ac-45cff78c7593',
					},
					DOWNLOAD: {
						href:
							'https://api.ep-dev.tatamotors.com/ppap/supplier/606bb4b9-c88b-4d3d-b094-2388e69e256e/ppap/44/stage/c6917d48-faf1-4ba2-b5dc-98c30691453e/documentRequirement/6f78b513-4e75-40e7-94ac-45cff78c7593/download',
					},
				},
			},
			{
				id: '862fe1a6-edd2-4c9f-ada4-3ff986645f49',
				document: {
					id: 'f18c98f5-a08f-4cfb-bd75-3155a47722e2',
					name: 'PFMEA',
				},
				submission: {
					id: 'ea8119e5-e876-41a5-bd6c-14847c36ff07',
					documentName: 'DummyFile.txt',
					fileName: 'DummyFile.txt',
				},
				_links: {
					DELETE: {
						href:
							'https://api.ep-dev.tatamotors.com/ppap/supplier/606bb4b9-c88b-4d3d-b094-2388e69e256e/ppap/44/stage/c6917d48-faf1-4ba2-b5dc-98c30691453e/documentRequirement/862fe1a6-edd2-4c9f-ada4-3ff986645f49',
					},
					DOWNLOAD: {
						href:
							'https://api.ep-dev.tatamotors.com/ppap/supplier/606bb4b9-c88b-4d3d-b094-2388e69e256e/ppap/44/stage/c6917d48-faf1-4ba2-b5dc-98c30691453e/documentRequirement/862fe1a6-edd2-4c9f-ada4-3ff986645f49/download',
					},
				},
			},
		],
		status: 'PENDING_REVISION',
		remarks: [
			{
				id: 'b9b3613d-4cbb-4756-b785-a1134530306e',
				user: {
					name: 'tmldev',
					username: 'tmldev',
				},
				createdAt: 1652795921301,
				remark: 'done',
			},
		],
		reviews: [
			{
				id: '96f290ec-f7c7-4253-ac73-8d0553a3677d',
				user: {
					name: 'pune-sq-engineer',
					username: 'pune-sq-engineer',
				},
				createdAt: 1652797062890,
				remark: '',
				status: 'DISAPPROVE',
			},
		],
		_links: {
			DRAFT: {
				href:
					'https://api.ep-dev.tatamotors.com/ppap/supplier/606bb4b9-c88b-4d3d-b094-2388e69e256e/ppap/44/stage/c6917d48-faf1-4ba2-b5dc-98c30691453e',
			},
			SUBMIT: {
				href:
					'https://api.ep-dev.tatamotors.com/ppap/supplier/606bb4b9-c88b-4d3d-b094-2388e69e256e/ppap/44/stage/c6917d48-faf1-4ba2-b5dc-98c30691453e/submission',
			},
			PPAP: {
				href:
					'https://api.ep-dev.tatamotors.com/ppap/supplier/606bb4b9-c88b-4d3d-b094-2388e69e256e/ppap/44',
			},
			self: {
				href:
					'https://api.ep-dev.tatamotors.com/ppap/supplier/606bb4b9-c88b-4d3d-b094-2388e69e256e/ppap/44/stage/c6917d48-faf1-4ba2-b5dc-98c30691453e',
			},
		},
	};

  beforeEach(() => {
    API.get.mockReset();
    API.patch.mockReset();
  });

  it('should be able to select values for fields and submit', async () => {
    const inputFields = [
      ['CTQCount-input', 9],
      ['OkCTQCount-input', 8],
      ['PokaYokesCount-input', 8],
      ['HighActionPriorityProcessesCount-input', 9],
      ['StatisticalControlledParamsCount-input', 8],
      
    ]

    const finalAttributes = {
      CTQCount: 9,
      OkCTQCount: 8,
      PokaYokesCount: 8,
      HighActionPriorityProcessesCount: 9,
      StatisticalControlledParamsCount: 8,
    }

    const { _links: ppapLinks, state } = testPpap;

    API.get.mockImplementation(url => {
      if (url.endsWith(ppapLinks[state].href)) {
        return Promise.resolve({ data: testStageData });
      }
    });

    const { getByText, getByTestId} = render(
      <ProcessStage
        ppap={testPpap}
        highlightMandatoryFields={false}
        setHighlightMandatoryFields={jest.fn()}
        reloadData={jest.fn()}
        state='PIST'
      >
        {({ content, actionButtons }) => (
          <>
            <div>{content}</div>
            <div>
              <ActionButtons {...actionButtons} />
            </div>
          </>
        )}
      </ProcessStage>
    );

    await waitFor(() => expect(API.get).toHaveBeenCalledWith(ppapLinks[state].href));

    for (const input of inputFields) {
      const [ testId, value ] = input;
      setTarget(getByTestId, testId, value)
    }
    
    const saveAsDraftButton = getByText('SAVE AS DRAFT');
    fireEvent.click(saveAsDraftButton);

    await waitFor(() => {
      const { _links: links } = testStageData;

      expect(API.patch).toHaveBeenCalledWith(links.DRAFT.href, {
        remark: '',
        attributes: finalAttributes
      })
    });
  });

  it('should be able to select values for fields and submit for already saved PIST requirements', async () => {
    const inputFields = [
      ['PokaYokesCount-input', 8],
      ['HighActionPriorityProcessesCount-input', 9],
    ]

    const finalAttributes = {
      CTQCount: testPartialFilledStageData.externalAttributes.CTQCount,
      OkCTQCount: testPartialFilledStageData.externalAttributes.OkCTQCount,
      PokaYokesCount: 8,
      HighActionPriorityProcessesCount: 9,
      StatisticalControlledParamsCount: 8,
    }

    const { _links: ppapLinks, state } = testPpap;

    API.get.mockImplementation(url => {
      if (url.endsWith(ppapLinks[state].href)) {
        return Promise.resolve({ data: testPartialFilledStageData });
      }
    });

    const { getByText, getByTestId } = render(
      <ProcessStage
        ppap={testPpap}
        highlightMandatoryFields={false}
        setHighlightMandatoryFields={jest.fn()}
        reloadData={jest.fn()}
        state='PIST'
      >
        {({ content, actionButtons }) => (
          <>
            <div>{content}</div>
            <div>
              <ActionButtons {...actionButtons} />
            </div>
          </>
        )}
      </ProcessStage>
    );

    await waitFor(() => expect(API.get).toHaveBeenCalledWith(ppapLinks[state].href));

    for (const input of inputFields) {
      const [ testId, value ] = input;
      setTarget(getByTestId, testId, value)
    }
    
    const saveAsDraftButton = getByText('SAVE AS DRAFT');
    fireEvent.click(saveAsDraftButton);

    await waitFor(() => {
      const { _links: links } = testPartialFilledStageData;

      expect(API.patch).toHaveBeenCalledWith(links.DRAFT.href, {
        remark: '',
        attributes: finalAttributes
      })
    });
  });
});

describe('test submit PIST', () => {
  const testPpap = {
    id: 25,
    purchaseOrder: { number: "2840044776", createdAt: 1623177000 },
    supplier: {
      id: "cf9ed4bc-8644-4e90-aa5c-8c168c53f7fe",
      code: "I20313",
      groupCode: "I20310",
      name: "IMPERIAL AUTO INDUSTRIES LTD",
      address: {
        value: "PLOT NO 48,SECTOR IIIIE, PANTNAGAR",
        city: "RUDRAPUR",
        district: "",
        pincode: "263153",
      },
    },
    part: {
      revisionId: "8f3b865b-f20b-4f1b-9a56-43f1a39b7098",
      number: "573609130109",
      description: "PIPE ASSY,AIR FILTER TO HOSE",
      partGroup: { id: "ZZZZZZ", description: "Default for DENIS" },
      drawingNumber: "573609130109",
      revisionLevel: "B",
      gross: { value: 0.0, unit: "KG" },
      net: { value: 0.0, unit: "KG" },
      createdAt: 1545849000,
    },
    plant: {
      code: "1500",
      name: "CV Dharwad",
      businessUnits: [{ name: "CVBU" }],
    },
    commodityGroup: "Central High Value Purchase",
    aqCommodityGroup: "CV AQ Chassis",
    purchaseBuyerName: "Mahendra",
    project: {
      id: "d9aaa51b-8b2c-4a2c-bdaa-f7c2ef087803",
      code: "12345",
      name: "Hexa",
      plants: [
        { code: "1001", name: "CV Pune", businessUnits: [{ name: "CVBU" }] },
      ],
      vehicleLines: ["EAGLE", "CARS"],
      businessUnit: "CVBU",
      projectMilestoneTimelines: [
        { projectMilestone: "ALPHA", timeline: "2021-12-25" },
        { projectMilestone: "BETA", timeline: "2021-12-25" },
        { projectMilestone: "PO", timeline: "2021-12-30" },
        { projectMilestone: "PP", timeline: "2022-01-03" },
        { projectMilestone: "SOP", timeline: "2022-01-21" },
      ],
      vehicleProjections: [
        { count: 12345, year: "2021" },
        { count: 12, year: "2022" },
        { count: 12, year: "2023" },
        { count: 12, year: "2024" },
        { count: 12, year: "2025" },
      ],
      remarks: "New ",
      createdBy: {
		name: 'pune-sq-engineer',
		username: 'pune-sq-engineer'
	  },
      createdAt: 1640321029928,
    },
    state: "PIST",
    kamContactDetails: { id: "12ccb9e2-f102-43ef-a8dd-d65f402d2d8a" },
    createdBy: { name: "pune-sq-engineer" },
    createdAt: 1641360850573,
    _links: {
      self: {
        href:
          "https://api.ep-dev.tatamotors.com/esakha/ppap/25",
      },
      "R@R": {
        href:
          "https://api.ep-dev.tatamotors.com/esakha/supplier/81a00998-3b36-4bd6-b064-c1606b60eda4/ppap/25/stage/49774397-7a4f-452a-a595-934e9cb29f34",
      },
      PIPC: {
        href:
          "https://api.ep-dev.tatamotors.com/esakha/supplier/81a00998-3b36-4bd6-b064-c1606b60eda4/ppap/25/stage/d8c0548b-4b76-4328-ac8c-368745406185",
      },
      PSW: {
        href:
          "https://api.ep-dev.tatamotors.com/esakha/supplier/81a00998-3b36-4bd6-b064-c1606b60eda4/ppap/25/stage/392e4d92-055b-4b81-9250-f93ec6b10a5c",
      },
      PIST: {
        href:
          "https://api.ep-dev.tatamotors.com/esakha/supplier/81a00998-3b36-4bd6-b064-c1606b60eda4/ppap/25/stage/0a9e0cf6-a742-46d3-9030-a52ea35b690b",
      },
    },
  };

  const testStageData = {
    id: "0a9e0cf6-a742-46d3-9030-a52ea35b690b",
    stage: { id: 1, name: "PIST" },
    targetDate: "2022-02-10",
    externalAttrsSchema: {
      $id: "pist_external",
      type: "object",
      title: "PIST_External_Attrs",
      $schema: "https://json-schema.org/draft/2020-12/schema",
      required: [
        "CTQCount",
        "StatisticalControlledParamsCount",
        "PokaYokesCount",
        "OkCTQCount",
        "HighActionPriorityProcessesCount",
      ],
      properties: {
        CTQCount: { type: "number", description: "No. of CTQs" },
        OkCTQCount: { type: "number", description: "No. of OK CTQs" },
        PokaYokesCount: { type: "number", description: "Count of Poka Yokes" },
        HighActionPriorityProcessesCount: {
          type: "number",
          description: "Count of High Action Priority Processes",
        },
        StatisticalControlledParamsCount: {
          type: "number",
          description: "Count of Statistical Controlled Parameters",
        },
      },
      additionalProperties: false,
    },
    externalDocumentRequirements: [
      {
        id: "fba2587b-f290-42a4-807a-f93eb52b363a",
        document: { id: "aca44946-8919-48ae-9521-7217be86d43f", name: "PFMEA" },
        _links: {
          UPLOAD: {
            href:
              "https://api.ep-dev.tatamotors.com/esakha/supplier/81a00998-3b36-4bd6-b064-c1606b60eda4/ppap/113/stage/0a9e0cf6-a742-46d3-9030-a52ea35b690b/documentRequirement/fba2587b-f290-42a4-807a-f93eb52b363a/upload?documentName={documentName}",
            templated: true,
          },
        },
      },
      {
        id: "71c99c57-6321-4199-97e7-a6a5684b5a5c",
        document: {
          id: "bd1509e0-4c7b-4663-a91f-d66dac2932e5",
          name: "Tooling & equipment review",
        },
        _links: {
          UPLOAD: {
            href:
              "https://api.ep-dev.tatamotors.com/esakha/supplier/81a00998-3b36-4bd6-b064-c1606b60eda4/ppap/113/stage/0a9e0cf6-a742-46d3-9030-a52ea35b690b/documentRequirement/71c99c57-6321-4199-97e7-a6a5684b5a5c/upload?documentName={documentName}",
            templated: true,
          },
        },
      },
      {
        id: "40275f0a-b31c-48d9-8860-dd6917f79b0b",
        document: { id: "d42287e8-aaf3-4181-96cf-bc45a85f895c", name: "PFD" },
        _links: {
          UPLOAD: {
            href:
              "https://api.ep-dev.tatamotors.com/esakha/supplier/81a00998-3b36-4bd6-b064-c1606b60eda4/ppap/113/stage/0a9e0cf6-a742-46d3-9030-a52ea35b690b/documentRequirement/40275f0a-b31c-48d9-8860-dd6917f79b0b/upload?documentName={documentName}",
            templated: true,
          },
        },
      },
      {
        id: "b43406b4-1e7a-43de-832a-6b24bee813ff",
        document: {
          id: "156132bc-2b72-4e52-9def-9ab396e64d1a",
          name: "Part development timing chart",
        },
        _links: {
          UPLOAD: {
            href:
              "https://api.ep-dev.tatamotors.com/esakha/supplier/81a00998-3b36-4bd6-b064-c1606b60eda4/ppap/113/stage/0a9e0cf6-a742-46d3-9030-a52ea35b690b/documentRequirement/b43406b4-1e7a-43de-832a-6b24bee813ff/upload?documentName={documentName}",
            templated: true,
          },
        },
      }
    ],
    status: "PENDING_SUBMISSION",
    remarks: [],
    reviews: [],
    _links: {
      DRAFT: {
        href:
          "https://api.ep-dev.tatamotors.com/esakha/supplier/81a00998-3b36-4bd6-b064-c1606b60eda4/ppap/25/stage/0a9e0cf6-a742-46d3-9030-a52ea35b690b",
      },
      SUBMIT: {
        href:
          "https://api.ep-dev.tatamotors.com/esakha/supplier/81a00998-3b36-4bd6-b064-c1606b60eda4/ppap/25/stage/0a9e0cf6-a742-46d3-9030-a52ea35b690b/submission",
      },
      PPAP: {
        href:
          "https://api.ep-dev.tatamotors.com/esakha/supplier/81a00998-3b36-4bd6-b064-c1606b60eda4/ppap/25",
      },
      self: {
        href:
          "https://api.ep-dev.tatamotors.com/esakha/supplier/81a00998-3b36-4bd6-b064-c1606b60eda4/ppap/25/stage/0a9e0cf6-a742-46d3-9030-a52ea35b690b",
      },
    },
  };

  beforeEach(() => {
    API.get.mockReset();
    API.post.mockReset();
  });

  it('should be able to select values for fields and submit', async () => {
    const inputFields = [
      ['CTQCount-input', 2],
      ['OkCTQCount-input', 432],
      ['PokaYokesCount-input', 54],
      ['HighActionPriorityProcessesCount-input', 87],
      ['StatisticalControlledParamsCount-input', 4],
    ]

    const finalAttributes = {
      CTQCount: 2,
      OkCTQCount: 432,
      PokaYokesCount: 54,
      HighActionPriorityProcessesCount: 87,
      StatisticalControlledParamsCount: 4,
    }

    const { _links: ppapLinks, state } = testPpap;

    API.get.mockImplementation(url => {
      if (url.endsWith(ppapLinks[state].href)) {
        return Promise.resolve({ data: testStageData });
      }
    });

    const { getByText, getByTestId } = render(
      <ProcessStage
        ppap={testPpap}
        highlightMandatoryFields={false}
        setHighlightMandatoryFields={jest.fn()}
        reloadData={jest.fn()}
        state='PIST'
      >
        {({ content, actionButtons }) => (
          <>
            <div>{content}</div>
            <div>
              <ActionButtons {...actionButtons} />
            </div>
          </>
        )}
      </ProcessStage>
    );

    await waitFor(() => expect(API.get).toHaveBeenCalledWith(ppapLinks[state].href));

    for (const input of inputFields) {
      const [ testId, value ] = input;
      setTarget(getByTestId, testId, value)
    }
    
    const confirmButton = getByText('SUBMIT');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      const { _links: links } = testStageData;

      expect(API.post).toHaveBeenCalledWith(links.SUBMIT.href, {
        remark: '',
        attributes: finalAttributes
      })
    });
  });

  it('should not submit if mandatory field are not filled', async () => {
    const inputFields = [
      ['CTQCount-input', 2],
      ['OkCTQCount-input', 432],
      ['PokaYokesCount-input', 54],
      ['HighActionPriorityProcessesCount-input', 87],
    ]

    const { _links: ppapLinks, state } = testPpap;

	window.HTMLElement.prototype.scrollIntoView = function() {};

    API.get.mockImplementation(url => {
      if (url.endsWith(ppapLinks[state].href)) {
        return Promise.resolve({ data: testStageData });
      }
    });

    const { getByText, getByTestId } = render(
      <ProcessStage
        ppap={testPpap}
        highlightMandatoryFields={false}
        setHighlightMandatoryFields={jest.fn()}
        reloadData={jest.fn()}
        state='PIST'
      >
        {({ content, actionButtons }) => (
          <>
            <div>{content}</div>
            <div>
              <ActionButtons {...actionButtons} />
            </div>
          </>
        )}
      </ProcessStage>
    );

    await waitFor(() => expect(API.get).toHaveBeenCalledWith(ppapLinks[state].href));

    for (const input of inputFields) {
      const [ testId, value ] = input;
      setTarget(getByTestId, testId, value)
    }
    
    const confirmButton = getByText('SUBMIT');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(API.post).not.toHaveBeenCalledWith()
    });
  });
});

describe('test document upload, download and delete', () => {
  const testPpap = {
		id: 44,
		purchaseOrder: {
			number: '3540049182',
			createdAt: 1628793000,
		},
		supplier: {
			id: '606bb4b9-c88b-4d3d-b094-2388e69e256e',
			code: 'A13130',
			groupCode: 'A13130',
			name: 'AUTOPROFILES LTD UNIT 1',
			address: {
				value: 'PLOT NO-C-33 C-34 &C-35PHASEIVINDUSTRIAL AREA GAMARIA',
				city: 'JAMSHEDPUR',
				district: '',
				pincode: '832108',
			},
		},
		part: {
			revisionId: 'd7a733a0-5f04-4aef-b614-c3ad80b2ca2c',
			number: '268062610106',
			description: 'TOE PANEL ASSY,LH',
			partGroup: {
				id: 'ZZZZZZ',
				description: 'Default for DENIS',
			},
			drawingNumber: '268062610106',
			revisionLevel: 'NR',
			gross: {
				value: 0,
				unit: 'KG',
			},
			net: {
				value: 0,
				unit: 'KG',
			},
			createdAt: 1618857000,
		},
		plant: {
			code: '2001',
			name: 'CV Jamshedpur',
			businessUnits: [
				{
					name: 'CVBU',
				},
			],
		},
		commodityGroup: 'Central Electric Hybrid',
		aqCommodityGroup: 'CV AQ Chassis',
		purchaseBuyerName: 'errtyui',
		project: {
			id: '58442544-66c5-43b5-adad-88edb6c27009',
			code: 'ABC123',
			name: 'Abc123',
			plants: [
				{
					code: '2001',
					name: 'CV Jamshedpur',
					businessUnits: [
						{
							name: 'CVBU',
						},
					],
				},
			],
			vehicleLines: ['ARIA'],
			businessUnit: 'CVBU',
			projectMilestoneTimelines: [
				{
					projectMilestone: 'PP',
					timeline: '2022-05-02',
				},
				{
					projectMilestone: 'BETA',
					timeline: '2022-04-30',
				},
				{
					projectMilestone: 'SOP',
					timeline: '2022-05-03',
				},
				{
					projectMilestone: 'PO',
					timeline: '2022-05-01',
				},
				{
					projectMilestone: 'ALPHA',
					timeline: '2022-04-29',
				},
			],
			vehicleProjections: [
				{
					count: 10,
					year: '2028',
				},
				{
					count: 1,
					year: '2024',
				},
				{
					count: 10,
					year: '2022',
				},
				{
					count: 1,
					year: '2026',
				},
				{
					count: 1,
					year: '2027',
				},
			],
			remarks: '',
			createdBy: {
				name: 'pune-sq-engineer',
				username: 'pune-sq-engineer',
			},
			createdAt: 1651237958674,
			updatedBy: {
				name: 'pune-sq-engineer',
				username: 'pune-sq-engineer',
			},
			updatedAt: 1651237958674,
		},
		state: 'PIST',
		requirement: {
			id: 'ac494697-1400-4758-b609-399cef8fbd7b',
			ppapId: 44,
			partCategory: {
				name: 'Gray Box',
				description: 'Assembly - Customer Design, Child Part – Supplier Design',
				ppapSubmissionLevels: [
					{
						level: 'Level 4',
						description:
							'Production Warrant and other requirements as defined by TML',
					},
				],
			},
			level: {
				level: 'Level 4',
				description:
					'Production Warrant and other requirements as defined by TML',
			},
			overriddenLevel: {
				level: 'Level 4',
				description:
					'Production Warrant and other requirements as defined by TML',
			},
			reason: {
				id: 2,
				reason: 'Change to Optional Construction or Material',
			},
			stageRequirements: [
				{
					id: '29a8d3be-0447-482b-baf7-c1f1856fe547',
					stage: {
						id: 1,
						name: 'PIST',
					},
					targetDate: '2022-05-21',
					documents: [
						{
							id: '7323b641-dc89-4fbc-9f40-35ca1706be91',
							name: 'PFD',
						},
						{
							id: 'a2ecdf50-40df-40d8-9f11-47e6d43431d2',
							name: 'Prototype control plan',
							templateDocument: {
								id: '0335906a-770f-4c92-b47a-1349a8b3a3db',
								uploadKey: 'ppap/template/Prototype control plan/file2.txt',
								documentName: 'file2.txt',
								uploadedBy: {
									name: 'pune-sq-engineer',
									username: 'pune-sq-engineer',
								},
								uploadedAt: 1651240279929,
							},
							_links: {
								DOWNLOAD_URL: {
									href:
										'https://api.ep-dev.tatamotors.com/ppap/documents/a2ecdf50-40df-40d8-9f11-47e6d43431d2/template/download',
								},
							},
						},
						{
							id: '5ed11254-da87-4cbf-b689-6169d6646ffe',
							name: 'IRMR/PIST',
							templateDocument: {
								id: 'fad557fe-7f08-4cb6-89c8-5ec88237def2',
								uploadKey: 'ppap/template/IRMR/PIST/file1.txt',
								documentName: 'file1.txt',
								uploadedBy: {
									name: 'pune-sq-engineer',
									username: 'pune-sq-engineer',
								},
								uploadedAt: 1651240219346,
							},
							_links: {
								DOWNLOAD_URL: {
									href:
										'https://api.ep-dev.tatamotors.com/ppap/documents/5ed11254-da87-4cbf-b689-6169d6646ffe/template/download',
								},
							},
						},
						{
							id: 'f18c98f5-a08f-4cfb-bd75-3155a47722e2',
							name: 'PFMEA',
						},
					],
					customDocuments: [],
				},
				{
					id: 'c87e6427-0eae-459f-b457-c3d9f705b26a',
					stage: {
						id: 2,
						name: 'PIPC',
					},
					targetDate: '2022-05-19',
					documents: [
						{
							id: 'a2011c78-d722-4e26-8517-1efd108e412e',
							name: 'Measurement System Analysis (MSA)',
						},
						{
							id: '4e3645c2-508a-4c83-9bd7-e5fecfdaafcf',
							name: 'Pre-launch control plan',
						},
						{
							id: '6d7a816f-4f17-4e38-aaae-182646529728',
							name: 'CTQ cascade',
						},
						{
							id: '7323b641-dc89-4fbc-9f40-35ca1706be91',
							name: 'PFD',
						},
						{
							id: 'e1bee347-835b-476c-a7c1-69dd9fd6fcc3',
							name: 'Open Issue tracking list',
						},
						{
							id: 'b81e0630-7c40-40aa-9aa8-bac325c53b09',
							name: 'EPC results',
						},
						{
							id: '99c18a5d-9b71-499c-870a-c39e145dc263',
							name: 'Tooling & equipment review',
						},
						{
							id: 'd104a8db-81da-418b-ad4f-e44ce68f9441',
							name: 'DVP&R',
						},
						{
							id: '534a7a45-9841-4806-af10-2e8e04400271',
							name: 'Capability study(PIPC)',
						},
						{
							id: 'f18c98f5-a08f-4cfb-bd75-3155a47722e2',
							name: 'PFMEA',
						},
						{
							id: 'b371fe79-f28f-4250-ba11-05a5cd0261f7',
							name: 'Production run (IR & set up approval)',
						},
						{
							id: '5e5fca57-73b6-4b20-8ff8-94bec376d753',
							name: 'Logistics sheet',
						},
					],
					customDocuments: [],
				},
				{
					id: 'fe98161e-d777-429d-a559-c10fbed278e6',
					stage: {
						id: 4,
						name: 'PSW',
					},
					targetDate: '2022-05-26',
					documents: [
						{
							id: '7b8a2826-a0ec-4110-88b2-72b64add17b1',
							name: 'PSW Signoff',
						},
					],
					customDocuments: [],
				},
			],
			remarks: '',
			rAndRWaiver: true,
			editStatus: 'COMPLETE',
			initiatedBy: {
				name: 'pune-sq-engineer',
				username: 'pune-sq-engineer',
			},
			initiatedAt: 1652789468466,
			attachments: [],
			reviews: [
				{
					id: '5c3e1d1a-61f8-46c7-a6f6-aeb845f4999d',
					user: {
						name: 'pune-sq-lead-engineer',
						username: 'pune-sq-lead-engineer',
					},
					createdAt: 1652786186383,
					remark: '',
					status: 'DISAPPROVE',
				},
				{
					id: 'c3241ce7-f0c5-428c-b8bb-d939a2bce17f',
					user: {
						name: 'pune-sq-lead-engineer',
						username: 'pune-sq-lead-engineer',
					},
					createdAt: 1652788290343,
					remark: '',
					status: 'DISAPPROVE',
				},
				{
					id: '44d5038e-2413-4c0a-8f11-bebd92de0f8f',
					user: {
						name: 'pune-sq-lead-engineer',
						username: 'pune-sq-lead-engineer',
					},
					createdAt: 1652784123384,
					remark: '',
					status: 'DISAPPROVE',
				},
				{
					id: '7c4c9483-78c0-43cc-aa79-84fc86aaaefd',
					user: {
						name: 'pune-sq-lead-engineer',
						username: 'pune-sq-lead-engineer',
					},
					createdAt: 1652795166227,
					remark: '',
					status: 'APPROVE',
				},
				{
					id: 'ac8be30d-55cb-42cc-9252-6fc530331921',
					user: {
						name: 'pune-sq-lead-engineer',
						username: 'pune-sq-lead-engineer',
					},
					createdAt: 1652788701816,
					remark: '',
					status: 'DISAPPROVE',
				},
				{
					id: 'cd785174-e2c2-4b77-91a8-2b1125965343',
					user: {
						name: 'pune-sq-lead-engineer',
						username: 'pune-sq-lead-engineer',
					},
					createdAt: 1652786368228,
					remark: '',
					status: 'DISAPPROVE',
				},
			],
		},
		apqpTimingChart: {
			id: 'ea1a6cde-3144-4f96-a230-38b9d5de18e4',
			ppapId: 44,
			knownActivityGroupTimelines: [
				{
					group: {
						id: 'supplier-build-schedule',
						name: 'Supplier Build Schedule',
					},
					activityTimelines: [],
				},
				{
					group: {
						id: 'engineering',
						name: 'Engineering',
					},
					activityTimelines: [],
				},
				{
					group: {
						id: 'manufacturing-planning',
						name: 'Manufacturing Planning',
					},
					activityTimelines: [],
				},
				{
					group: {
						id: 'subcontractor-planning',
						name: 'Subcontractor Planning',
					},
					activityTimelines: [],
				},
				{
					group: {
						id: 'quality-planning',
						name: 'Quality Planning',
					},
					activityTimelines: [],
				},
				{
					group: {
						id: 'training',
						name: 'Training',
					},
					activityTimelines: [],
				},
				{
					group: {
						id: 'process-validation',
						name: 'Process Validation',
					},
					activityTimelines: [],
				},
			],
			additionalActivityTimelines: [],
			editStatus: 'COMPLETE',
			remarks: [],
			reviews: [
				{
					id: 'c84472ac-2d3f-416f-b4f7-2359e8de4380',
					user: {
						name: 'pune-sq-engineer',
						username: 'pune-sq-engineer',
					},
					createdAt: 1652795343636,
					remark: 'done',
					status: 'APPROVE',
				},
			],
		},
		kamContactDetails: {
			id: '3f0f8a70-d588-4a00-b564-9fee2e2dd4cf',
			name: 'tryerut',
			contactNumber: '9876654433',
			emailId: 'iopkju34@gmail.com',
		},
		createdBy: {
			name: 'pune-sq-engineer',
		},
		createdAt: 1652783635279,
		_links: {
			self: {
				href:
					'https://api.ep-dev.tatamotors.com/ppap/supplier/606bb4b9-c88b-4d3d-b094-2388e69e256e/ppap/44',
			},
			PIPC: {
				href:
					'https://api.ep-dev.tatamotors.com/ppap/supplier/606bb4b9-c88b-4d3d-b094-2388e69e256e/ppap/44/stage/e2b9433b-1689-4520-8b86-6108df345e5c',
			},
			PSW: {
				href:
					'https://api.ep-dev.tatamotors.com/ppap/supplier/606bb4b9-c88b-4d3d-b094-2388e69e256e/ppap/44/stage/8ecb80b2-cc28-4980-ae97-2d0966e4c314',
			},
			PIST: {
				href:
					'https://api.ep-dev.tatamotors.com/ppap/supplier/606bb4b9-c88b-4d3d-b094-2388e69e256e/ppap/44/stage/c6917d48-faf1-4ba2-b5dc-98c30691453e',
			},
		},
	};

  const testPartialFilledStageData = {
		id: 'c6917d48-faf1-4ba2-b5dc-98c30691453e',
		stage: {
			id: 1,
			name: 'PIST',
		},
		targetDate: '2022-05-21',
		externalAttrsSchema: {
			$id: 'pist_external',
			type: 'object',
			title: 'PIST_External_Attrs',
			$schema: 'https://json-schema.org/draft/2020-12/schema',
			required: [
				'CTQCount',
				'StatisticalControlledParamsCount',
				'PokaYokesCount',
				'OkCTQCount',
				'HighActionPriorityProcessesCount',
			],
			properties: {
				CTQCount: {
					type: 'number',
					description: 'No. of CTQs',
				},
				OkCTQCount: {
					type: 'number',
					description: 'No. of OK CTQs',
				},
				PokaYokesCount: {
					type: 'number',
					description: 'Count of Poka Yokes',
				},
				HighActionPriorityProcessesCount: {
					type: 'number',
					description: 'Count of High Action Priority Processes',
				},
				StatisticalControlledParamsCount: {
					type: 'number',
					description: 'Count of Statistical Controlled Parameters',
				},
			},
			additionalProperties: false,
		},
		externalAttributes: {
			CTQCount: 9,
			OkCTQCount: 8,
			PokaYokesCount: 8,
			HighActionPriorityProcessesCount: 9,
			StatisticalControlledParamsCount: 8,
		},
		externalDocumentRequirements: [
			{
				id: '55cf21ad-d5f2-4d4c-8fe6-e298e333a23d',
				document: {
					id: 'a2ecdf50-40df-40d8-9f11-47e6d43431d2',
					name: 'Prototype control plan',
					templateDocument: {
						id: '0335906a-770f-4c92-b47a-1349a8b3a3db',
						uploadKey: 'ppap/template/Prototype control plan/file2.txt',
						documentName: 'file2.txt',
						uploadedBy: {
							name: 'pune-sq-engineer',
							username: 'pune-sq-engineer',
						},
						uploadedAt: 1651240279929,
					},
					_links: {
						TEMPLATE_DOWNLOAD_URL: {
							href:
								'https://api.ep-dev.tatamotors.com/ppap/documents/a2ecdf50-40df-40d8-9f11-47e6d43431d2/template/download',
						},
					},
				},
				_links: {
					UPLOAD: {
						href:
							'https://api.ep-dev.tatamotors.com/ppap/supplier/606bb4b9-c88b-4d3d-b094-2388e69e256e/ppap/44/stage/c6917d48-faf1-4ba2-b5dc-98c30691453e/documentRequirement/55cf21ad-d5f2-4d4c-8fe6-e298e333a23d/upload?documentName={documentName}',
						templated: true,
					},
				},
			},
			{
				id: '331c9310-bec4-4689-9ea5-baaacdf62dbd',
				document: {
					id: '7323b641-dc89-4fbc-9f40-35ca1706be91',
					name: 'PFD',
				},
				submission: {
					id: '5d44d606-f6e5-46ff-9f8f-9649b075ec39',
					documentName: 'DummyFile.txt',
					fileName: 'DummyFile.txt',
				},
				_links: {
					DELETE: {
						href:
							'https://api.ep-dev.tatamotors.com/ppap/supplier/606bb4b9-c88b-4d3d-b094-2388e69e256e/ppap/44/stage/c6917d48-faf1-4ba2-b5dc-98c30691453e/documentRequirement/331c9310-bec4-4689-9ea5-baaacdf62dbd',
					},
					DOWNLOAD: {
						href:
							'https://api.ep-dev.tatamotors.com/ppap/supplier/606bb4b9-c88b-4d3d-b094-2388e69e256e/ppap/44/stage/c6917d48-faf1-4ba2-b5dc-98c30691453e/documentRequirement/331c9310-bec4-4689-9ea5-baaacdf62dbd/download',
					},
				},
			},
			{
				id: '6f78b513-4e75-40e7-94ac-45cff78c7593',
				document: {
					id: '5ed11254-da87-4cbf-b689-6169d6646ffe',
					name: 'IRMR/PIST',
					templateDocument: {
						id: 'fad557fe-7f08-4cb6-89c8-5ec88237def2',
						uploadKey: 'ppap/template/IRMR/PIST/file1.txt',
						documentName: 'file1.txt',
						uploadedBy: {
							name: 'pune-sq-engineer',
							username: 'pune-sq-engineer',
						},
						uploadedAt: 1651240219346,
					},
					_links: {
						TEMPLATE_DOWNLOAD_URL: {
							href:
								'https://api.ep-dev.tatamotors.com/ppap/documents/5ed11254-da87-4cbf-b689-6169d6646ffe/template/download',
						},
					},
				},
				submission: {
					id: 'af799ba8-cec6-4542-b016-65512fb0536b',
					documentName: 'DummyFile.txt',
					fileName: 'DummyFile.txt',
				},
				_links: {
					DELETE: {
						href:
							'https://api.ep-dev.tatamotors.com/ppap/supplier/606bb4b9-c88b-4d3d-b094-2388e69e256e/ppap/44/stage/c6917d48-faf1-4ba2-b5dc-98c30691453e/documentRequirement/6f78b513-4e75-40e7-94ac-45cff78c7593',
					},
					DOWNLOAD: {
						href:
							'https://api.ep-dev.tatamotors.com/ppap/supplier/606bb4b9-c88b-4d3d-b094-2388e69e256e/ppap/44/stage/c6917d48-faf1-4ba2-b5dc-98c30691453e/documentRequirement/6f78b513-4e75-40e7-94ac-45cff78c7593/download',
					},
				},
			},
			{
				id: '862fe1a6-edd2-4c9f-ada4-3ff986645f49',
				document: {
					id: 'f18c98f5-a08f-4cfb-bd75-3155a47722e2',
					name: 'PFMEA',
				},
				submission: {
					id: 'ea8119e5-e876-41a5-bd6c-14847c36ff07',
					documentName: 'DummyFile.txt',
					fileName: 'DummyFile.txt',
				},
				_links: {
					DELETE: {
						href:
							'https://api.ep-dev.tatamotors.com/ppap/supplier/606bb4b9-c88b-4d3d-b094-2388e69e256e/ppap/44/stage/c6917d48-faf1-4ba2-b5dc-98c30691453e/documentRequirement/862fe1a6-edd2-4c9f-ada4-3ff986645f49',
					},
					DOWNLOAD: {
						href:
							'https://api.ep-dev.tatamotors.com/ppap/supplier/606bb4b9-c88b-4d3d-b094-2388e69e256e/ppap/44/stage/c6917d48-faf1-4ba2-b5dc-98c30691453e/documentRequirement/862fe1a6-edd2-4c9f-ada4-3ff986645f49/download',
					},
				},
			},
		],
		status: 'PENDING_REVISION',
		remarks: [
			{
				id: 'b9b3613d-4cbb-4756-b785-a1134530306e',
				user: {
					name: 'tmldev',
					username: 'tmldev',
				},
				createdAt: 1652795921301,
				remark: 'done',
			},
		],
		reviews: [
			{
				id: '96f290ec-f7c7-4253-ac73-8d0553a3677d',
				user: {
					name: 'pune-sq-engineer',
					username: 'pune-sq-engineer',
				},
				createdAt: 1652797062890,
				remark: '',
				status: 'DISAPPROVE',
			},
		],
		_links: {
			DRAFT: {
				href:
					'https://api.ep-dev.tatamotors.com/ppap/supplier/606bb4b9-c88b-4d3d-b094-2388e69e256e/ppap/44/stage/c6917d48-faf1-4ba2-b5dc-98c30691453e',
			},
			SUBMIT: {
				href:
					'https://api.ep-dev.tatamotors.com/ppap/supplier/606bb4b9-c88b-4d3d-b094-2388e69e256e/ppap/44/stage/c6917d48-faf1-4ba2-b5dc-98c30691453e/submission',
			},
			PPAP: {
				href:
					'https://api.ep-dev.tatamotors.com/ppap/supplier/606bb4b9-c88b-4d3d-b094-2388e69e256e/ppap/44',
			},
			self: {
				href:
					'https://api.ep-dev.tatamotors.com/ppap/supplier/606bb4b9-c88b-4d3d-b094-2388e69e256e/ppap/44/stage/c6917d48-faf1-4ba2-b5dc-98c30691453e',
			},
		},
	};

  beforeEach(() => {
    API.get.mockReset();
    API.patch.mockReset();
  });

  it('Shoulde be able to Delete document in PIST stage', async () => {
    
    const { _links: ppapLinks, state } = testPpap;

    API.get.mockImplementation(url => {
      if (url.endsWith(ppapLinks[state].href)) {
        return Promise.resolve({ data: testPartialFilledStageData });
      }
    });

    const { externalDocumentRequirements } = testPartialFilledStageData;
    // eslint-disable-next-line no-unused-vars
    const { _links: links} = externalDocumentRequirements[1];

    const { getByTestId } = render(
      <ProcessStage
        ppap={testPpap}
        highlightMandatoryFields={false}
        setHighlightMandatoryFields={jest.fn()}
        reloadData={jest.fn()}
        state='PIST'
      >
        {({ content, actionButtons }) => (
          <>
            <div>{content}</div>
            <div>
              <ActionButtons {...actionButtons} />
            </div>
          </>
        )}
      </ProcessStage>
    );

    await waitFor(() => expect(API.get).toHaveBeenCalledWith(ppapLinks[state].href));
    
    const deleteBtn = getByTestId(`delete-file-7323b641-dc89-4fbc-9f40-35ca1706be91`);
    expect(deleteBtn).toBeInTheDocument();

    fireEvent.click(deleteBtn);
    fireEvent.click(getByTestId('delete-confirm'));

    await waitFor(() => {
      expect(API.delete).toHaveBeenCalled();
    });
    
  });
});

describe('test revise stage', () => {
  const testPpap = {
    id: 117,
      purchaseOrder: {
        number: "3540045908",
        createdAt: 1604687400
      },
      supplier: {
        id: "81a00998-3b36-4bd6-b064-c1606b60eda4",
        code: "A06127",
        groupCode: "",
        name: "APOLLO TYRES LTD",
        address: {
        value: "IRCL,OPP BIG BAZAR  NATIONALHIGHWAY MANGO",
        city: "JAMSHEDPUR",
        district: "",
        pincode: "831018"
        }
      },
      part: {
        revisionId: "350411d7-72a9-4976-8837-74fced920004",
        number: "502240206303",
        description: "TYRE,LUG TYPE",
        partGroup: {
          id: "NS2172",
          description: "Tyres"
        },
        drawingNumber: "502240200105",
        revisionLevel: "C",
        gross: {value: 0, unit: "KG" },
        net: {value: 0, unit: "KG" },
        createdAt: 1329157800
      },
      plant: {
        code: "2001",
        name: "CV Jamshedpur",
        businessUnits: [{name: "CVBU" }]
      },
      commodityGroup: "Central Defence Futuristic",
      aqCommodityGroup: "CV AQ Casting, Forging & Machining",
      purchaseBuyerName: "adfas",
      project: {
        id: "8fe0f50b-c1ed-4eb6-9b68-31f77c6d4e47",
        code: "sasdf",
        name: "sdfsadf",
        plants: [
          {code: "1001", name: "CV Pune",
            businessUnits: [{ name: "CVBU"}]
          }
        ],
        vehicleLines: ["CARS"],
        businessUnit: "CVBU",
        projectMilestoneTimelines: [
          {projectMilestone: "ALPHA", timeline: "2022-02-15"},
          {projectMilestone: "BETA", timeline: "2022-02-23"},
          {projectMilestone: "PO", timeline: "2022-02-25" },
          {projectMileston: "PP", timeline: "2022-02-27"},
          {projectMilestone: "SOP", timeline: "2022-02-28"}
        ],
        vehicleProjections: [
          { count: 1, year: "2022" },
          { count: 10, year: "2023" },
          { count: 10, year: "2024" },
          { count: 1, year: "2025" },
          { count: 10, year: "2026"}
        ],
        remarks: "",
        createdBy: {
			name: 'pune-sq-engineer',
		    username: 'pune-sq-engineer'
		},
        createdAt: 1643873892704
      },
      state: "PIST",
      kamContactDetails: {
        id: "781a253e-2c63-4b75-a6bc-2dbea3a7afd2",
        name: "aedsf",
        contactNumber: "6833245764",
        emailId: "df2@fd.com"
      },
      createdBy: {
        name: "pune-sq-engineer"
      },
      createdAt: 1644838476827,
      _links: {
        self: {
          href: "https://api.ep-dev.tatamotors.com/ppap/ppap/117"
        },
        "R@R": {
          href: "https://api.ep-dev.tatamotors.com/ppap/ppap/117/stage/9edbf19d-eee9-4435-bc6f-000c775153a5"
        },
        PIPC: {
          href: "https://api.ep-dev.tatamotors.com/ppap/ppap/117/stage/6f66ed0f-ac5a-4f97-8b17-00ef965e6ed8"
        },
        PSW: {
          href: "https://api.ep-dev.tatamotors.com/ppap/ppap/117/stage/69445283-0349-4cc0-998d-e305e74291a6"
        },
        PIST: {
          href: "https://api.ep-dev.tatamotors.com/ppap/ppap/117/stage/b6b5eb29-c924-4721-876f-aebd6ae561f9"
        },
      },
    };

  const testStageData = {
      id: "b6b5eb29-c924-4721-876f-aebd6ae561f9",
      stage: {
        id: 1,
        name: "PIST"
      },
      targetDate: "2022-02-16",
      internalAttrsSchema: {
        $id: "pist_internal",
        type: "object",
        title: "PIST_Internal_Attrs",
        $schema: "https://json-schema.org/draft/2020-12/schema",
        additionalProperties: false
      },
      externalAttrsSchema: {
        $id: "pist_external",
        type: "object",
        title: "PIST_External_Attrs",
        $schema: "https://json-schema.org/draft/2020-12/schema",
        required: [
          "CTQCount",
          "StatisticalControlledParamsCount",
          "PokaYokesCount",
          "OkCTQCount",
          "HighActionPriorityProcessesCount"
        ],
        properties: {
          CTQCount: {type: "integer",description: "No. of CTQs"},
          OkCTQCount: {type: "integer",description: "No. of OK CTQs"},
          PokaYokesCount: {type: "integer",description: "Count of Poka Yokes"},
          HighActionPriorityProcessesCount: {type: "integer",description: "Count of High Action Priority Processes"},
          StatisticalControlledParamsCount: {type: "integer",description: "Count of Statistical Controlled Parameters" }
        },
        additionalProperties: false
      },
      internalAttributes: null,
      externalAttributes: {
        CTQCount: 3,
        OkCTQCount: 3,
        PokaYokesCount: 23,
        HighActionPriorityProcessesCount: 2,
        StatisticalControlledParamsCount: 12
      },
      internalDocumentRequirements: [
        {
          id: "36a7ab6f-62ed-4d5e-a294-4763ef64cd32",
          document: {
            id: "159a38fa-c104-4742-a57d-762445b47410",
            name: "Fitment Trial Report"
          },
          _links: {
            UPLOAD: {
              href: "https://api.ep-dev.tatamotors.com/ppap/ppap/117/stage/b6b5eb29-c924-4721-876f-aebd6ae561f9/documentRequirement/36a7ab6f-62ed-4d5e-a294-4763ef64cd32/upload?documentName={documentName}",
              templated: true
            }
          }
        }
      ],
      externalDocumentRequirements: [
        {
          id: "4255c430-d7bc-4d58-845d-3ec19e212f00",
          document: {
            id: "f1f9d24e-d65f-474a-a9ab-ede3db84744a",
            name: "IRMR/PIST"
          },
          submission: {
            id: "a9239cac-5b4a-4f29-a569-ed2314d29625",
            uploadKey: "ppap/117/IRMR/PIST/sample-demo",
            uploadedBy: {
				name: 'apollo-tyres',
				username: 'apollo-tyres'
			},
            uploadedAt: 1644900914364
          },
          _links: {
            DOWNLOAD: {
              href: "https://api.ep-dev.tatamotors.com/ppap/ppap/117/stage/b6b5eb29-c924-4721-876f-aebd6ae561f9/documentRequirement/4255c430-d7bc-4d58-845d-3ec19e212f00/download"
            }
          }
        }
      ],
      status: "PENDING_REVIEW",
      remarks: [
        {
          id: "67dc8308-eac1-46d4-b84c-3b15d364b0b8",
          user: {
			name: 'apollo-tyres',
		    username: 'apollo-tyres'
		  },
          createdAt: 1648189186459,
          remark: "done"
        },
        {
          id: "9f1bd3fb-814a-48fe-bded-5f35e0936319",
          user: {
			name: 'pune-sq-engineer',
			username: 'pune-sq-engineer'
		  },
          createdAt: 1648101932409,
          remark: "bcdcbhjk"
        },
      ],
      reviews: [
        {
          id: "ecc3c6bd-f145-4f75-ab12-db685f4d7761",
          user: {
			name: 'pune-sq-engineer',
			username: 'pune-sq-engineer'
		  },
          createdAt: 1645254054879,
          remark: "string",
          status: "DISAPPROVE"
        }
      ],
      _links: {
        DRAFT: {
          href: "https://api.ep-dev.tatamotors.com/ppap/ppap/117/stage/b6b5eb29-c924-4721-876f-aebd6ae561f9"
        },
        APPROVAL: {
          href: "https://api.ep-dev.tatamotors.com/ppap/ppap/117/stage/b6b5eb29-c924-4721-876f-aebd6ae561f9/approval"
        },
        REVISION: {
          href: "https://api.ep-dev.tatamotors.com/ppap/ppap/117/stage/b6b5eb29-c924-4721-876f-aebd6ae561f9/revision"
        },
        PPAP: {
          href: "https://api.ep-dev.tatamotors.com/ppap/ppap/117"
        },
        self: {
          href: "https://api.ep-dev.tatamotors.com/ppap/ppap/117/stage/b6b5eb29-c924-4721-876f-aebd6ae561f9"
        }
      }
    };

  beforeEach(() => {
    API.get.mockReset();
    API.post.mockReset();
  });

it('should review the pist stage', async () => {

  const { _links: ppapLinks, state } = testPpap;

  API.get.mockImplementation(url => {
    if (url.endsWith(ppapLinks[state].href)) {
      return Promise.resolve({ data: testStageData });
    }
  });

  const { getByText } = render(
    <ProcessStage
      ppap={testPpap}
      highlightMandatoryFields={false}
      setHighlightMandatoryFields={jest.fn()}
      reloadData={jest.fn()}
      state='PIST'
    >
      {({ content, actionButtons }) => (
        <>
          <div>{content}</div>
          <div>
            <ActionButtons {...actionButtons} />
          </div>
        </>
      )}
    </ProcessStage>
  );
  
  await waitFor(() => expect(API.get).toHaveBeenCalledWith(ppapLinks[state].href));
  
  const reviseButton = getByText('REVISE');
  fireEvent.click(reviseButton);

  await waitFor(() => {
    const { _links: links } = testStageData ;

    expect(API.post).toHaveBeenCalledWith(links.REVISION.href, {
      remark: '',
      attributes: {}
      })
    });
    API.patch.mockReset();
  });
  
describe('test approval', () => {

  // eslint-disable-next-line no-shadow
  const testPpap = {
	id: 117,
	purchaseOrder: {
	  number: "3540045908",
	  createdAt: 1604687400
	},
	supplier: {
	  id: "81a00998-3b36-4bd6-b064-c1606b60eda4",
	  code: "A06127",
	  groupCode: "",
	  name: "APOLLO TYRES LTD",
	  address: {
	  value: "IRCL,OPP BIG BAZAR  NATIONALHIGHWAY MANGO",
	  city: "JAMSHEDPUR",
	  district: "",
	  pincode: "831018"
	  }
	},
	part: {
	  revisionId: "350411d7-72a9-4976-8837-74fced920004",
	  number: "502240206303",
	  description: "TYRE,LUG TYPE",
	  partGroup: {
		id: "NS2172",
		description: "Tyres"
	  },
	  drawingNumber: "502240200105",
	  revisionLevel: "C",
	  gross: {value: 0, unit: "KG" },
	  net: {value: 0, unit: "KG" },
	  createdAt: 1329157800
	},
	plant: {
	  code: "2001",
	  name: "CV Jamshedpur",
	  businessUnits: [{name: "CVBU" }]
	},
	commodityGroup: "Central Defence Futuristic",
	aqCommodityGroup: "CV AQ Casting, Forging & Machining",
	purchaseBuyerName: "adfas",
	project: {
	  id: "8fe0f50b-c1ed-4eb6-9b68-31f77c6d4e47",
	  code: "sasdf",
	  name: "sdfsadf",
	  plants: [
		{code: "1001", name: "CV Pune",
		  businessUnits: [{ name: "CVBU"}]
		}
	  ],
	  vehicleLines: ["CARS"],
	  businessUnit: "CVBU",
	  projectMilestoneTimelines: [
		{projectMilestone: "ALPHA", timeline: "2022-02-15"},
		{projectMilestone: "BETA", timeline: "2022-02-23"},
		{projectMilestone: "PO", timeline: "2022-02-25" },
		{projectMileston: "PP", timeline: "2022-02-27"},
		{projectMilestone: "SOP", timeline: "2022-02-28"}
	  ],
	  vehicleProjections: [
		{ count: 1, year: "2022" },
		{ count: 10, year: "2023" },
		{ count: 10, year: "2024" },
		{ count: 1, year: "2025" },
		{ count: 10, year: "2026"}
	  ],
	  remarks: "",
	  createdBy: {
		name: 'pune-sq-engineer',
		username: 'pune-sq-engineer'
	  },
	  createdAt: 1643873892704
	},
	state: "PIST",
	kamContactDetails: {
	  id: "781a253e-2c63-4b75-a6bc-2dbea3a7afd2",
	  name: "aedsf",
	  contactNumber: "6833245764",
	  emailId: "df2@fd.com"
	},
	createdBy: {
	  name: "pune-sq-engineer"
	},
	createdAt: 1644838476827,
	_links: {
	  self: {
		href: "https://api.ep-dev.tatamotors.com/ppap/ppap/117"
	  },
	  "R@R": {
		href: "https://api.ep-dev.tatamotors.com/ppap/ppap/117/stage/9edbf19d-eee9-4435-bc6f-000c775153a5"
	  },
	  PIPC: {
		href: "https://api.ep-dev.tatamotors.com/ppap/ppap/117/stage/6f66ed0f-ac5a-4f97-8b17-00ef965e6ed8"
	  },
	  PSW: {
		href: "https://api.ep-dev.tatamotors.com/ppap/ppap/117/stage/69445283-0349-4cc0-998d-e305e74291a6"
	  },
	  PIST: {
		href: "https://api.ep-dev.tatamotors.com/ppap/ppap/117/stage/b6b5eb29-c924-4721-876f-aebd6ae561f9"
	  },
	},
  };

  const testPartialFilledStageData = {
	id: "b6b5eb29-c924-4721-876f-aebd6ae561f9",
	stage: {
	  id: 1,
	  name: "PIST"
	},
	targetDate: "2022-02-16",
	internalAttrsSchema: {
	  $id: "pist_internal",
	  type: "object",
	  title: "PIST_Internal_Attrs",
	  $schema: "https://json-schema.org/draft/2020-12/schema",
	  additionalProperties: false
	},
	externalAttrsSchema: {
	  $id: "pist_external",
	  type: "object",
	  title: "PIST_External_Attrs",
	  $schema: "https://json-schema.org/draft/2020-12/schema",
	  required: [
		"CTQCount",
		"StatisticalControlledParamsCount",
		"PokaYokesCount",
		"OkCTQCount",
		"HighActionPriorityProcessesCount"
	  ],
	  properties: {
		CTQCount: {type: "integer",description: "No. of CTQs"},
		OkCTQCount: {type: "integer",description: "No. of OK CTQs"},
		PokaYokesCount: {type: "integer",description: "Count of Poka Yokes"},
		HighActionPriorityProcessesCount: {type: "integer",description: "Count of High Action Priority Processes"},
		StatisticalControlledParamsCount: {type: "integer",description: "Count of Statistical Controlled Parameters" }
	  },
	  additionalProperties: false
	},
	internalAttributes: null,
	externalAttributes: {
	  CTQCount: 3,
	  OkCTQCount: 3,
	  PokaYokesCount: 23,
	  HighActionPriorityProcessesCount: 2,
	  StatisticalControlledParamsCount: 12
	},
	internalDocumentRequirements: [
	  {
		id: "36a7ab6f-62ed-4d5e-a294-4763ef64cd32",
		document: {
		  id: "159a38fa-c104-4742-a57d-762445b47410",
		  name: "Fitment Trial Report"
		},
		_links: {
		  UPLOAD: {
			href: "https://api.ep-dev.tatamotors.com/ppap/ppap/117/stage/b6b5eb29-c924-4721-876f-aebd6ae561f9/documentRequirement/36a7ab6f-62ed-4d5e-a294-4763ef64cd32/upload?documentName={documentName}",
			templated: true
		  }
		}
	  }
	],
	externalDocumentRequirements: [
	  {
		id: "4255c430-d7bc-4d58-845d-3ec19e212f00",
		document: {
		  id: "f1f9d24e-d65f-474a-a9ab-ede3db84744a",
		  name: "IRMR/PIST"
		},
		submission: {
		  id: "a9239cac-5b4a-4f29-a569-ed2314d29625",
		  uploadKey: "ppap/117/IRMR/PIST/sample-demo",
		  uploadedBy: {
			name: 'apollo-tyres',
			username: 'apollo-tyres'
		  },
		  uploadedAt: 1644900914364
		},
		_links: {
		  DOWNLOAD: {
			href: "https://api.ep-dev.tatamotors.com/ppap/ppap/117/stage/b6b5eb29-c924-4721-876f-aebd6ae561f9/documentRequirement/4255c430-d7bc-4d58-845d-3ec19e212f00/download"
		  }
		}
	  }
	],
	status: "PENDING_REVIEW",
	remarks: [
	  {
		id: "67dc8308-eac1-46d4-b84c-3b15d364b0b8",
		user: {
			name: 'apollo-tyres',
			username: 'apollo-tyres'
		},
		createdAt: 1648189186459,
		remark: "done"
	  },
	  {
		id: "9f1bd3fb-814a-48fe-bded-5f35e0936319",
		user: {
			name: 'pune-sq-engineer',
			username: 'pune-sq-engineer'
		},
		createdAt: 1648101932409,
		remark: "bcdcbhjk"
	  },
	],
	reviews: [
	  {
		id: "ecc3c6bd-f145-4f75-ab12-db685f4d7761",
		user: {
			name: 'pune-sq-engineer',
			username: 'pune-sq-engineer'
		},
		createdAt: 1645254054879,
		remark: "string",
		status: "DISAPPROVE"
	  }
	],
	_links: {
	  DRAFT: {
		href: "https://api.ep-dev.tatamotors.com/ppap/ppap/117/stage/b6b5eb29-c924-4721-876f-aebd6ae561f9"
	  },
	  APPROVAL: {
		href: "https://api.ep-dev.tatamotors.com/ppap/ppap/117/stage/b6b5eb29-c924-4721-876f-aebd6ae561f9/approval"
	  },
	  REVISION: {
		href: "https://api.ep-dev.tatamotors.com/ppap/ppap/117/stage/b6b5eb29-c924-4721-876f-aebd6ae561f9/revision"
	  },
	  PPAP: {
		href: "https://api.ep-dev.tatamotors.com/ppap/ppap/117"
	  },
	  self: {
		href: "https://api.ep-dev.tatamotors.com/ppap/ppap/117/stage/b6b5eb29-c924-4721-876f-aebd6ae561f9"
	  }
	}
  };

  it('CONFIRM button should be visible to approve PPAP in PIST stage', async () => {
    
    const { _links: ppapLinks, state } = testPpap;

    API.get.mockImplementation(url => {
      if (url.endsWith(ppapLinks[state].href)) {
        return Promise.resolve({ data: testPartialFilledStageData });
      }
    });

    const { getByText } = render(
      <ProcessStage
        ppap={testPpap}
        highlightMandatoryFields={false}
        setHighlightMandatoryFields={jest.fn()}
        reloadData={jest.fn()}
        state='PIST'
      >
        {({ content, actionButtons }) => (
          <>
            <div>{content}</div>
            <div>
              <ActionButtons {...actionButtons} />
            </div>
          </>
        )}
      </ProcessStage>
    );

    await waitFor(() => expect(API.get).toHaveBeenCalledWith(ppapLinks[state].href));
    
    const confirmButton = getByText('APPROVE');
    
    expect(confirmButton).toBeInTheDocument();

    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      const { _links: links } = testPartialFilledStageData;

      expect(API.post).toHaveBeenCalledWith(links.APPROVAL.href, {
        remark: '',
        attributes: { }
      })
    });
  });
 });
});