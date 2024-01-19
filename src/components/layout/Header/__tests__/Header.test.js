import React from 'react';
import config from '../../../../config/config';
import { render } from '../../../../test-utils';
import Header from '../Header';

test('render header with logo', () => {
  const { getByAltText } = render(<Header />);

  expect(getByAltText('Tata Motors')).toBeInTheDocument();
});

test('do not render watermark if not test env', () => {
  config.ENV_TYPE = 'PRODUCTION';
  const { queryByText } = render(<Header />);

  expect(queryByText('TEST ENVIRONMENT')).not.toBeInTheDocument();
  config.ENV_TYPE = 'TEST';
});

test('render watermark if not test env', () => {
  config.ENV_TYPE = 'TEST';
  const { queryByText } = render(<Header />);

  expect(queryByText('TEST ENVIRONMENT')).toBeInTheDocument();
  config.ENV_TYPE = undefined;
});
