import { addDecorator } from '@storybook/react';

import AllProviddersDecorator from './all-providers-decorator';

addDecorator(AllProviddersDecorator);

const customViewports = {
  '1366x690': {
    name: '1366 x 690', // reduced height as toolbars etc take up space
    styles: {
      width: '1366px',
      height: '690px',
    },
  },
  '1366x720': {
    name: '1366 x 720',
    styles: {
      width: '1366px',
      height: '720px',
    },
  },
};

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  viewport: { viewports: customViewports },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
