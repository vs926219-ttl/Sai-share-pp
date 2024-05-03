import React from 'react';
import { BaseBackButton } from './BackButton';

export default {
  title: 'Back Button',
  component: BaseBackButton,
};

const Template = args => <BaseBackButton {...args} />;

export const Default = Template.bind({});

Default.args = {
  materialGroup: '',
  action: 'ASN Drop',
  userMaterialGroups: [],
  handleClick: () => console.log('/'),
};

export const DynamicBreadcrumbLoadbody = Template.bind({});

DynamicBreadcrumbLoadbody.args = {
  materialGroup: 'NS2071',
  action: 'ASN Drop',
  userMaterialGroups: [{ materialGroup: 'NS2071', description: 'Load Body' }],
  handleClick: () => console.log('/'),
};

export const DynamicBreadcrumbWiringHarness = Template.bind({});

DynamicBreadcrumbWiringHarness.args = {
  materialGroup: 'NS3098',
  action: 'ASN Drop',
  userMaterialGroups: [
    { materialGroup: 'NS3098', description: 'Wiring Harness' },
  ],
  handleClick: () => console.log('/'),
};
