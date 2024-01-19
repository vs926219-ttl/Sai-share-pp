import React from 'react';
import { API } from '../../../apis/api';
import {
  render,
  screen,
} from '../../../test-utils';

import ProjectMaster from '../ProjectMaster';
import { PopupManager } from '../../../providers';

beforeEach(() => {
  API.get.mockReset();
});

jest.mock('react-virtualized', () => {
  const ReactVirtualized = jest.requireActual('react-virtualized');
  return {
    ...ReactVirtualized,
    AutoSizer: ({ children }) => children({ height: 1000, width: 1000 }),
  };
});

// eslint-disable-next-line no-unused-vars
const testProjectListData = [
  {
    id: "ac838dd7-839a-4d8a-8199-192fee2eaf61",
    code: "Some project",
    name: "Some name",
    plants: [
      { code: "1002", name: "CV C'wad Fdy", businessUnits: [{ name: "CVBU" }] },
      { code: "1001", name: "CV Pune", businessUnits: [{ name: "CVBU" }] },
    ],
    vehicleLines: ["HEXA", "ARIA"],
    businessUnit: "PVBU",
    projectMilestoneTimelines: [
      { projectMilestone: "ALPHA", timeline: "2021-12-11" },
    ],
    vehicleProjections: [{ count: 30, year: "2021" }],
    remarks: "Some remarks",
    createdBy: "tmldev",
    createdAt: 1638173678957,
  },
  {
    id: "aebeff41-3491-45c4-a900-f85cb9e94f59",
    code: "Some project 2",
    name: "Some name",
    plants: [
      { code: "1002", name: "CV C'wad Fdy", businessUnits: [{ name: "CVBU" }] },
      { code: "1001", name: "CV Pune", businessUnits: [{ name: "CVBU" }] },
    ],
    vehicleLines: ["HEXA", "ARIA"],
    businessUnit: "PVBU",
    projectMilestoneTimelines: [
      { projectMilestone: "ALPHA", timeline: "2021-12-11" },
    ],
    vehicleProjections: [{ count: 30, year: "2021" }],
    remarks: "Some remarks",
    createdBy: "tmldev",
    createdAt: 1638182340127,
  },
];

it('should render Project Master with back button.', async () => {
  API.get.mockImplementation(url => {
    if (url.includes('projects')) {
      return Promise.resolve({
        data: [],
      });
    }
    return Promise.reject(new Error(`Failed to match the ${url}`));
  });

  render(
    <PopupManager>
      <ProjectMaster />,
    </PopupManager>
  );

  expect(await screen.findByTestId('Process')).toBeInTheDocument();
  expect(await screen.getByLabelText('Project List-count').textContent).toEqual(
    '0',
  );
});

it('should render List of projects.', async () => {
  API.get.mockImplementation(url => {
    if (url.includes('projects')) {
      return Promise.resolve({
        data: testProjectListData,
      });
    }
    return Promise.reject(new Error(`Failed to match the ${url}`));
  });
  render(
    <PopupManager>
      <ProjectMaster />,
    </PopupManager>
  );

  expect(await screen.findByText('Some project')).toBeInTheDocument();
  expect(await screen.findByText('Some project 2')).toBeInTheDocument();
});

it('should display project list count in tab', async () => {
  API.get.mockImplementation(url => {
    if (url.includes('projects')) {
      return Promise.resolve({
        data: testProjectListData,
      });
    }
    return Promise.reject(new Error(`Failed to match the ${url}`));
  });
  render(
    <PopupManager>
      <ProjectMaster />,
    </PopupManager>
  );

  expect(await screen.findByText('Some project')).toBeInTheDocument();
  expect(await screen.findByText('Some project 2')).toBeInTheDocument();
  expect(await screen.getByLabelText('Project List-count').textContent).toEqual(
    '2',
  );
});
