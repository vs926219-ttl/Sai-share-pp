/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable consistent-return */
import React from 'react';
import { render, fireEvent } from '../../../../test-utils';
import TransferDocuments from '../TransferDocuments';

const documentList = {
    data: [
        {id: "test-0001", name: "IRMR/PIST"},
        {id: "test-0002", name: "PFMEA"},
        {id: "test-0003", name: "PFD"},
        {id: "test-0004", name: "Prototype control plan"},
        {id: "test-0005", name: "Part development timing chart"}
    ]
}

const allDocuments = [
        {id: "test-0001", name: "IRMR/PIST", checked: false},
        {id: "test-0002", name: "PFMEA", checked: false},
        {id: "test-0003", name: "PFD", checked: false},
        {id: "test-0004", name: "Prototype control plan", checked: false},
        {id: "test-0005", name: "Part development timing chart", checked: false}
    ]

const documents = [
    {id: "test-0002", name: "PFMEA"},
    {id: "test-0003", name: "PFD"},
    {id: "test-0004", name: "Prototype control plan"},
]

it('should render document list', async () => {
    const { getByText } = render(<TransferDocuments documentList={documentList} addedDocuments={documents} onSelect={jest.fn()}/>);
    const name = getByText(documentList.data[0].name);
   
    expect(name).toBeInTheDocument();
});

it('should render all elements in document list', async () => {
    const { getAllByTestId } = render(<TransferDocuments documentList={documentList} addedDocuments={documents} onSelect={jest.fn()}/>);
 
    expect(getAllByTestId('list-item').length).toEqual(5); 
});

it('Right Arrow buttons should disable if nothing is selected', async () => {
    const { getByTestId } = render(<TransferDocuments documentList={documentList} addedDocuments={documents} onSelect={jest.fn()}/>);
    const RightArrowButton = getByTestId("RightArrowIcon");
   
    expect(RightArrowButton).toBeDisabled();
});

it('Left Arrow buttons should disable if nothing is selected', async () => {
    const { getByTestId } = render(<TransferDocuments documentList={documentList} addedDocuments={documents} onSelect={jest.fn()}/>);
    const RightArrowButton = getByTestId("LeftArrowIcon");
   
    expect(RightArrowButton).toBeDisabled();
});

it('Right Arrow button should enabled if anything is selected', async () => {
    const { getByTestId } = render(<TransferDocuments documentList={documentList} addedDocuments={documents} onSelect={jest.fn()}/>);
    fireEvent.click(getByTestId('checkbox-test-0001'));
    
    const RightArrowButton = getByTestId("RightArrowIcon");
   
    expect(getByTestId('checkbox-test-0001').checked).toEqual(true);
    expect(RightArrowButton).toBeEnabled();
});

// it('Left Arrow button should enabled if anything is selected', async () => {
//     const { getByTestId } = render(<TransferDocuments documentList={documentList} addedDocuments={documents} onSelect={jest.fn()}/>);
//     fireEvent.click(getByTestId('master-checkbox-test-0001'));
    
//     const LeftArrowButton = getByTestId("LeftArrowIcon");
   
//     expect(getByTestId('master-checkbox-test-0001').checked).toEqual(true);
//     expect(LeftArrowButton).toBeEnabled();
// }); 

it('On click on select all, all checkboxes should be selected', async () => {
    const { getByTestId } = render(<TransferDocuments documentList={documentList} addedDocuments={documents} onSelect={jest.fn()}/>);
    fireEvent.click(getByTestId('select-all'));
    expect(getByTestId('select-all').checked).toEqual(true);

    allDocuments.forEach(doc => {
        expect(getByTestId(`checkbox-${doc.id}`).checked).toEqual(true);
    });
});