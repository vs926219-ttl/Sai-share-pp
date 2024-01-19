/* eslint-disable no-unused-vars */
import React from 'react';
import { API } from '../../../apis/api';
import DocumentMaster from '../DocumentMaster';
import { PopupManager } from '../../../providers';
import { render, screen, fireEvent, within } from '../../../test-utils';
import { AddDocument } from '../../../components';

const ppapStages = [
    {id: 1, name: "PIST"},
    {id: 2, name: "PIPC"},
    {id: 3, name: "R@R"},
    {id: 4, name: "PSW"}
]
const getTypes = [
    { value: 'INTERNAL', label: 'Internal' },
    { value: 'EXTERNAL', label: 'External' },
];


beforeEach(() => {
	API.get.mockReset();
});

jest.mock('react-virtualized', () => {
	const ReactVirtualized = jest.requireActual('react-virtualized');
	return {
		...ReactVirtualized,
		AutoSizer: ({ children }) => children({ height: 1000, width: 1000 }),
	};
});

const testDocumentListData = [
	{
		id: '41e7fc6e-b0d1-433f-92f1-e67b85f4592e',
		ppapStage: {
			id: 1,
			name: 'PIST',
		},
		document: {
			id: 'f1f9d24e-d65f-474a-a9ab-ede3db84744a',
			name: 'IRMR/PIST',
			templateDocument: {
				id: 'da89c505-1bc4-4bb8-8635-66ad0d5cd983',
				uploadKey: 'ppap/template/IRMR/PIST/some file.pdf',
				documentName: 'some file.pdf',
			},
			links: [
				{
					rel: 'UPLOAD',
					href:
						'https://api.ep-dev.tatamotors.com/ppap/ppapStageDocuments/41e7fc6e-b0d1-433f-92f1-e67b85f4592e/template/upload?documentName={documentName}',
				},
				{
					rel: 'ACKNOWLEDGE',
					href:
						'https://api.ep-dev.tatamotors.com/ppap/ppapStageDocuments/41e7fc6e-b0d1-433f-92f1-e67b85f4592e/template/upload',
				},
			],
		},
		documentType: 'EXTERNAL',
		links: [
			{
				rel: 'self',
				href:
					'https://api.ep-dev.tatamotors.com/ppap/ppapStageDocuments/41e7fc6e-b0d1-433f-92f1-e67b85f4592e',
			},
			{
				rel: 'update',
				href:
					'https://api.ep-dev.tatamotors.com/ppap/ppapStageDocuments/41e7fc6e-b0d1-433f-92f1-e67b85f4592e',
			},
			{
				rel: 'delete',
				href:
					'https://api.ep-dev.tatamotors.com/ppap/ppapStageDocuments/41e7fc6e-b0d1-433f-92f1-e67b85f4592e',
			},
		],
	},
];

it('should render Project Master with back button.', async () => {
	API.get.mockImplementation((url) => {
		if (url.includes('ppapStageDocuments')) {
			return Promise.resolve({
				data: [],
			});
		}
		return Promise.reject(new Error(`Failed to match the ${url}`));
	});

	render(
		<PopupManager>
			<DocumentMaster />,
		</PopupManager>,
	);

	expect(await screen.findByTestId('Process')).toBeInTheDocument();
});

it('should render List of projects.', async () => {
	API.get.mockImplementation((url) => {
		if (url.includes('ppapStageDocuments')) {
			return Promise.resolve({
				data: testDocumentListData,
			});
		}
		return Promise.reject(new Error(`Failed to match the ${url}`));
	});
	render(
		<PopupManager>
			<DocumentMaster />,
		</PopupManager>,
	);

	expect(await screen.findByText('IRMR/PIST')).toBeInTheDocument();
});

it('should display project list count in tab', async () => {
	API.get.mockImplementation((url) => {
		if (url.includes('ppapStageDocuments')) {
			return Promise.resolve({
				data: testDocumentListData,
			});
		}
		return Promise.reject(new Error(`Failed to match the ${url}`));
	});
	render(
		<PopupManager>
			<DocumentMaster />,
		</PopupManager>,
	);

	expect(await screen.findByText('IRMR/PIST')).toBeInTheDocument();
});

it("should render values", async () => {

	const { getByText } = render(
	  <AddDocument 
		  // eslint-disable-next-line react/jsx-boolean-value
		  isPopupOpen={true}
		  handleClose={jest.fn()}
		  sendDocData={jest.fn()}
		  submitFile={jest.fn()}
		  ppapStages={ppapStages}
	  >
		{({ content }) => (
		  <div>{content}</div>
		)}
	  </AddDocument>
	);
  
	const title = getByText("Add Document");
  
	expect(title).toBeInTheDocument();
	
  });

  
