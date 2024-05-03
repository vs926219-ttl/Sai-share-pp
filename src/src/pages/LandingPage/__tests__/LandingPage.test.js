/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import React from 'react';
import { render, fireEvent } from '../../../test-utils';
import LandingPage from '../LandingPage';

it('should render process button and click it.', async () => {
  const { findByRole } = render(
    <LandingPage />
  );

  fireEvent.click(await findByRole('button', { name: /PROCESS/ }));
})