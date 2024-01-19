/* eslint-disable no-param-reassign */
import React from 'react';
import Table from './Table';

export default {
  title: 'Components/ Table',
  component: Table,
};

const Template = args => (
  <div
    style={{
      height: '800px',
      width: '800px',
      backgroundColor: '#F3F5F9',
      padding: '3em 10px',
    }}
  >
    <Table {...args} />
  </div>
);

export const Default = Template.bind({});

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

const setHasActiveEdits = value => console.log(value);

const defaultColumns = [
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

Default.args = {
  rows,
  columns: [...defaultColumns],
  rowHeight: 45,
  defaultColumns: [...defaultColumns],
  setHasActiveEdits,
  setAsnCount: () => console.log('in child callBack'),
};
