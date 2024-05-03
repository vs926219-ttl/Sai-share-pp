/* eslint-disable no-param-reassign */
/* eslint-disable react/prop-types */
import userEvent from '@testing-library/user-event';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../test-utils';
import Table from '../Table';

jest.mock('react-virtualized', () => {
  const ReactVirtualized = jest.requireActual('react-virtualized');
  return {
    ...ReactVirtualized,
    AutoSizer: ({ children }) => children({ height: 1000, width: 1000 }),
  };
});

const rows = [
  {
    asn: 'H3-09-0047',
    asnId: '10011002-202109-0047',
    asnStatus: 'PLANNED',
    date: '2021-09-11',
    id: 11449,
    material: '264170000125',
    materialDescription: 'ASSY.LOAD BODY 909 LPT 34 HD CLS PITCH',
    materialGroup: 'NS2071',
    materialGroupDescription: 'Load Body',
    materialStatus: 'DROPPED',
    plant: '1001',
    serialNumber: 1,
    updatedAt: '2021-09-09T05:52:53.038475Z',
    updatedBy: 'pune-plant-ppc',
    vendorCode: 'K60901',
    vendorName: 'KAILASH VAHN PRIVATE LIMITED',
  },
  {
    asn: 'H3-09-0061',
    asnId: '10011002-202109-0061',
    asnStatus: 'PLANNED',
    date: '2021-09-13',
    id: 11994,
    material: '264170000125',
    materialDescription: 'ASSY.LOAD BODY 909 LPT 34 HD CLS PITCH',
    materialGroup: 'NS2071',
    materialGroupDescription: 'Load Body',
    materialStatus: 'DROPPED',
    plant: '1001',
    serialNumber: 1,
    updatedAt: '2021-09-13T06:37:16.545709Z',
    updatedBy: 'tmldev',
    vendorCode: 'K60901',
    vendorName: 'KAILASH VAHN PRIVATE LIMITED',
  },
];

const setHasActiveEdits = jest.fn();

const defaultColumns = [
  {
    title: 'select',
    field: '_select',
    width: 30,
    render: ({ isSelected, id }) => (
      <input
        style={{ marginTop: 0, marginBottom: 0 }}
        type="checkbox"
        onChange={() => {
          if (!isSelected) {
            isSelected = true;
            setHasActiveEdits(true);
          } else {
            isSelected = false;
            setHasActiveEdits(false);
          }
        }}
        checked={isSelected}
        name={`select-row-${id}`}
        data-testid={`select-row-${id}`}
      />
    ),
  },
  {
    width: 120,
    title: 'ASN',
    field: 'asn',
    enableSearch: true,
    enableFilter: true,
  },
  {
    width: 150,
    title: 'VC Status',
    field: 'asnStatus',
    enableSearch: true,
    enableFilter: true,
  },
  {
    width: 120,
    title: 'Part',
    field: 'material',
    enableSearch: true,
    enableFilter: true,
  },
  {
    width: 120,
    title: 'Part Status',
    field: 'materialStatus',
    enableSearch: true,
    enableFilter: true,
  },
];

it('should call setHasActiveEdits with true when data is being edited', async () => {
  render(
    <Table
      rows={rows}
      columns={defaultColumns}
      defaultColumns={defaultColumns}
      rowHeight={45}
      setHasActiveEdits={setHasActiveEdits}
      setAsnCount={() => 'in setAsnCount'}
    />,
  );
  fireEvent.click(screen.getByTestId('select-row-11449'));
  expect(screen.getByTestId('select-row-11449').checked).toEqual(true);
  await waitFor(() => expect(setHasActiveEdits).toHaveBeenCalledWith(true));
});

it('should be able to search for rows over a column', async () => {
  render(
    <Table
      rows={rows}
      columns={defaultColumns}
      defaultColumns={defaultColumns}
      rowHeight={45}
      setHasActiveEdits={setHasActiveEdits}
      setAsnCount={() => 'in setAsnCount'}
    />,
  );
  const asn1 = 'H3-09-0047';
  const asn2 = 'H3-09-0061';
  fireEvent.click(await screen.findByLabelText('menu-for-column-ASN'));
  userEvent.type(await screen.findByTestId('header-search'), asn1);
  expect(await screen.findByTestId(`option-${asn1}`)).toBeInTheDocument();
  expect(screen.queryByTestId(`option-${asn2}`)).not.toBeInTheDocument();
});

it('should be able to filter for rows over a column', async () => {
  render(
    <Table
      rows={rows}
      columns={defaultColumns}
      defaultColumns={defaultColumns}
      rowHeight={45}
      setHasActiveEdits={setHasActiveEdits}
      setAsnCount={() => 'in setAsnCount'}
    />,
  );
  const asn1 = 'H3-09-0047';
  const asn2 = 'H3-09-0061';
  fireEvent.click(await screen.findByLabelText('menu-for-column-ASN'));
  fireEvent.click(await screen.findByTestId('option-H3-09-0047'));
  fireEvent.click(await screen.findByText('OK'));
  expect(await screen.findByText(asn1)).toBeInTheDocument();
  expect(screen.queryByText(asn2)).not.toBeInTheDocument();

  fireEvent.click(await screen.findByText('Clear Filters'));

  fireEvent.click(await screen.findByLabelText('menu-for-column-ASN'));
  fireEvent.click(await screen.findByTestId('option-H3-09-0061'));
  fireEvent.click(await screen.findByText('OK'));
  expect(await screen.findByText(asn2)).toBeInTheDocument();
  expect(screen.queryByText(asn1)).not.toBeInTheDocument();
});

it('should be able to customize table', async () => {
  render(
    <Table
      rows={rows}
      columns={defaultColumns}
      defaultColumns={defaultColumns}
      rowHeight={45}
      setHasActiveEdits={setHasActiveEdits}
      setAsnCount={() => 'in setAsnCount'}
    />,
  );
  const asn1 = 'H3-09-0047';
  const asn2 = 'H3-09-0061';
  fireEvent.click(await screen.findByText('CUSTOMIZE TABLE'));
  fireEvent.click(await screen.findByTestId('column-selection-for-ASN'));
  fireEvent.click(await screen.findByText('OK'));
  expect(screen.queryByText(asn1)).not.toBeInTheDocument();
  expect(screen.queryByText(asn2)).not.toBeInTheDocument();
});

it('should be able to reset to default columns', async () => {
  render(
    <Table
      rows={rows}
      columns={defaultColumns}
      defaultColumns={defaultColumns}
      rowHeight={45}
      setHasActiveEdits={setHasActiveEdits}
      setAsnCount={() => 'in setAsnCount'}
    />,
  );
  const asn1 = 'H3-09-0047';
  const asn2 = 'H3-09-0061';
  fireEvent.click(await screen.findByText('CUSTOMIZE TABLE'));
  fireEvent.click(await screen.findByTestId('column-selection-for-ASN'));
  fireEvent.click(await screen.findByText('OK'));
  expect(screen.queryByText(asn1)).not.toBeInTheDocument();
  expect(screen.queryByText(asn2)).not.toBeInTheDocument();
  fireEvent.click(await screen.findByText('CUSTOMIZE TABLE'));
  fireEvent.click(await screen.findByText('RESET'));
  expect(await screen.findByText(asn1)).toBeInTheDocument();
  expect(await screen.findByText(asn2)).toBeInTheDocument();
});

it('should be able to cancel selections after clicking on cancel in customize table', async () => {
  render(
    <Table
      rows={rows}
      columns={defaultColumns}
      defaultColumns={defaultColumns}
      rowHeight={45}
      setHasActiveEdits={setHasActiveEdits}
      setAsnCount={() => 'in setAsnCount'}
    />,
  );
  fireEvent.click(await screen.findByText('CUSTOMIZE TABLE'));
  fireEvent.click(await screen.findByTestId('column-selection-for-ASN'));
  fireEvent.click(await screen.findByTestId('column-selection-for-VC Status'));
  fireEvent.click(
    await screen.findByTestId('column-selection-for-Part Status'),
  );

  expect(screen.queryByTestId('column-selection-for-ASN').checked).toEqual(
    false,
  );
  expect(
    screen.queryByTestId('column-selection-for-VC Status').checked,
  ).toEqual(false);
  expect(
    screen.queryByTestId('column-selection-for-Part Status').checked,
  ).toEqual(false);

  fireEvent.click(await screen.findByText('CANCEL'));
  expect(screen.queryByTestId('column-selection-for-ASN').checked).toEqual(
    true,
  );
  expect(
    screen.queryByTestId('column-selection-for-VC Status').checked,
  ).toEqual(true);
  expect(
    screen.queryByTestId('column-selection-for-Part Status').checked,
  ).toEqual(true);
});
