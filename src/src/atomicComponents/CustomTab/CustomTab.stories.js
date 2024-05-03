import React from 'react';
import CustomTab from './CustomTab';

export default {
    title: 'Tab with ASN Count',
    component: CustomTab,
};

const Template = args => <CustomTab {...args} />;

export const Default = Template.bind({});

Default.args = {
    count: 290,
    title: 'ASN Drop',
};
