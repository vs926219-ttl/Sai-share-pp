import React from 'react';
import { USER_OPERATIONS } from '../../../constants';
import { getTestAuthPolicy, render } from '../../../test-utils';
import ToolsListView from '../ToolsListView';

const toolsList= [
  {
    label: 'Project Master',
    action: jest.fn(),
    authOperation: USER_OPERATIONS.CREATE_PROJECT,
    testId: 'project-master-btn'
  },
  {
    label: 'Document Master',
    action: jest.fn(),
    authOperation: USER_OPERATIONS.CREATE_PPAP_STAGE_DOCUMENT,
    testId: 'document-master-btn'
  },
];

describe('to test authorization', () => {
  const elementTestId = 'project-master-btn';

  it('should not render project master button for read only', () => {
    const testAuthPolicy = getTestAuthPolicy('read-only');
    const testAuthUser = {
      email: "apollo-tyres@at.com",
      isLoaded: true,
      name: "Apollo Tyres",
      userID: "5ee5fd04-8b36-4873-8b44-18f84ead166a"
    }

    const { queryByTestId } = render(
      <ToolsListView listItems={toolsList} handleSelection={jest.fn()} />,
      {
        wrapperProps: {
          testAuthPolicy,
          testAuthUser
        },
      }
    );

    expect(queryByTestId(elementTestId)).toBeFalsy();
  })

  it('should render project master button for project-master', async () => {
    const testAuthPolicy = getTestAuthPolicy('project-master');
    const testAuthUser = {
      email: "punesqengineer@pb.tml",
      isLoaded: true,
      name: "Pune-Plant SQ Engineer",
      userID: "8289eb80-b90f-41ae-a7ed-03309d536718"
    }

    const { findByTestId } = render(
      <ToolsListView listItems={toolsList} handleSelection={jest.fn()} />,
      {
        wrapperProps: {
          testAuthPolicy,
          testAuthUser
        },
      }
    );

    expect(await findByTestId(elementTestId)).toBeTruthy();
  })
});

describe('to test authorization document', () => {
  const elementTestId = 'document-master-btn';

  it('should not render document master button for read only', () => {
    const testAuthPolicy = getTestAuthPolicy('read-only');
    const testAuthUser = {
      email: "apollo-tyres@at.com",
      isLoaded: true,
      name: "Apollo Tyres",
      userID: "5ee5fd04-8b36-4873-8b44-18f84ead166a"
    }

    const { queryByTestId } = render(
      <ToolsListView listItems={toolsList} handleSelection={jest.fn()} />,
      {
        wrapperProps: {
          testAuthPolicy,
          testAuthUser
        },
      }
    );

    expect(queryByTestId(elementTestId)).toBeFalsy();
  })

  it('should render document master button for document-master', async () => {
    const testAuthPolicy = getTestAuthPolicy('document-master');
    const testAuthUser = {
      email: "punesqengineer@pb.tml",
      isLoaded: true,
      name: "Pune-Plant SQ Engineer",
      userID: "8289eb80-b90f-41ae-a7ed-03309d536718"
    }

    const { findByTestId } = render(
      <ToolsListView listItems={toolsList} handleSelection={jest.fn()} />,
      {
        wrapperProps: {
          testAuthPolicy,
          testAuthUser
        },
      }
    );

    expect(await findByTestId(elementTestId)).toBeTruthy();
  })
});