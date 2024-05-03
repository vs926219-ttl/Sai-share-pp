import React from 'react';
import { render, fireEvent } from '../../../test-utils';
import ListView from '../ListView';

jest.mock('react-redux', () => {
  const useSelectorRedux = jest.requireActual('react-redux');
  return { ...useSelectorRedux, useDispatch: () => jest.fn() };
});

it('should render given list of list items as buttons and handleClicks', async () => {
  const testListItems = [{ label: 'Test Item 1' }, { label: 'Test Item 2' }];

  const handleSelection = jest.fn();
  const selectedColumnLables=[];
  const updateNavigationData=jest.fn();

  const { findByRole } = render(
    <ListView
      listItems={testListItems}
      handleSelection={handleSelection}
      selectedColumnLables={selectedColumnLables}
      updateNavigationData={updateNavigationData}
    />
  );

  expect(
    await findByRole('button', { name: 'Test Item 1' }),
  ).toBeInTheDocument();

  fireEvent.click(await findByRole('button', { name: 'Test Item 2' }));

  expect(handleSelection).toHaveBeenCalled();
});

it('should call action of a list item when clicked, if available', async () => {
  const action = jest.fn();
  const testListItems = [{ label: 'Test Item 1', action }];

  const handleSelection = jest.fn();

  const { findByRole } = render(
    <ListView listItems={testListItems} handleSelection={handleSelection} />,
  );

  fireEvent.click(await findByRole('button', { name: 'Test Item 1' }));

  expect(action).toHaveBeenCalled();
});
