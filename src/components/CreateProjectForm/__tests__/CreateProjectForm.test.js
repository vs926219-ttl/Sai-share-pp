/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable consistent-return */
import React from 'react';
import moment from 'moment';
import { render, fireEvent, within, waitFor, getTestAuthPolicy } from '../../../test-utils';
import { API } from '../../../apis/api';
import { API_RESOURCE_URLS, EDIT_STATUS } from '../../../constants';
import CreateProjectForm from '../CreateProjectForm';


const testProjectCode = 'Sample Project Code 1';

const testProjectName = 'Sample Project Name 1';

const testRemark = 'Lorem, ipsum dolor sit amet consectetur adipisicing elit.';

const testBusinessUnits = [
  { name: "CVBU" },
  { name: "EVBU" },
  { name: "PVBU" },
];

const testPlants = [
  { code: "1001", name: "CV Pune", businessUnits: [{ name: "CVBU" }] },
  { code: "1002", name: "CV C'wad Fdy", businessUnits: [{ name: "CVBU" }] }
];

const testVehicleLines = [
  { name: "ARIA" },
  { name: "CARS" },
  { name: "EAGLE" }
];

const testProjectMilestones = [
  { name: "ALPHA" },
  { name: "BETA" },
  { name: "PO" },
];

const testProjectMilestoneDates = [ '14', '16', '18' ];

const testVehicleProjections = [...Array(5).keys()].map((index) => ({
  sn: `Year ${index + 1}`,
  count: 0,
  year: null
}))

const selections = [
  ['business-unit', testBusinessUnits[0].name],
  ['plants', `${testPlants[0].name} - ${testPlants[0].code}`],
  ['vehicle-line', testVehicleLines[0].name]
];

const inputs = [
  ['project-code-input', testProjectCode],
  ['project-name-input', testProjectName],
]

beforeEach(() => {
  API.post.mockReset();
  API.get.mockReset();

  Date.now = jest.fn(() => new Date('2021-01-01T00:00:00.000Z'));

  API.get.mockImplementation(url => {
    if (url.endsWith(API_RESOURCE_URLS.getAllBusinessUnits())) {
      return Promise.resolve({ data: testBusinessUnits });
    }
    if (url.endsWith(API_RESOURCE_URLS.getAllPlantsForBusinessUnit())) {
      return Promise.resolve({ data: testPlants });
    }
    if (url.endsWith(API_RESOURCE_URLS.getAllVehicleLines())) {
      return Promise.resolve({ data: testVehicleLines });
    }
    if (url.endsWith(API_RESOURCE_URLS.getAllProjectMilestones())) {
      return Promise.resolve({ data: testProjectMilestones });
    }
  });
});

const redirectToProjectMasterPage = jest.fn();
const isEditable = true;
const projectId = null

const clickOptionForReactSelect = async ({ selectName, option }) => {
  const input = document.querySelector(`.select-${selectName}__control input`);
  const controlComp = document.querySelector(`.select-${selectName}__control`);
  fireEvent.focus(input);
  fireEvent.mouseDown(controlComp);
  const menu = document.querySelector(`.select-${selectName}__menu`);
  const { findByText } = within(menu);
  fireEvent.click(await findByText(option));
};

const pickADateForDatePickerWithTestId = async (
  testId,
  getByTestId,
  findAllByText,
  dateValue
) => {
  const datePicker = getByTestId(testId);
  const datePickerInput = await within(datePicker).findByRole('textbox');
  fireEvent.click(datePickerInput);

  const dateButton = await findAllByText(dateValue); // click on random date

  fireEvent.click(dateButton[dateButton.length - 1]);
};

const setTarget = (getByTestId, testId, value) => {
  const dayTargetInput = getByTestId(testId);
  fireEvent.change(dayTargetInput, {
    target: { value },
  });
};

describe('to test authorization', () => {
  it('CONFIRM button should be disabled for read only', () => {
    const testAuthPolicy = getTestAuthPolicy('read-only');
    const testAuthUser = {
      email: "apollo-tyres@at.com",
      isLoaded: true,
      name: "Apollo Tyres",
      userID: "5ee5fd04-8b36-4873-8b44-18f84ead166a"
    }
    const { getByRole } = render(
      <CreateProjectForm isEditable={isEditable} projectId={projectId} redirectToProjectMasterPage={redirectToProjectMasterPage} />,
      {
        wrapperProps: {
          testAuthPolicy,
          testAuthUser
        },
      }
    );

    expect(getByRole('button', { name: /SUBMIT/ })).toBeDisabled();
  })

  it('CONFIRM button should be enabled project-master', async () => {
    const testAuthPolicy = getTestAuthPolicy('project-master');
    const testAuthUser = {
      email: "punesqengineer@pb.tml",
      isLoaded: true,
      name: "Pune-Plant SQ Engineer",
      userID: "8289eb80-b90f-41ae-a7ed-03309d536718"
    }
    
    const { getByRole, getByTestId, findAllByText } = render(
      <CreateProjectForm isEditable={isEditable} projectId={projectId} redirectToProjectMasterPage={redirectToProjectMasterPage} />,
      {
        wrapperProps: {
          testAuthPolicy,
          testAuthUser
        },
      }
    );

    for (const selection of selections) {
      const [selectName, option] = selection;
      await clickOptionForReactSelect({
        selectName,
        option,
      });
    }
  
    for (const input of inputs) {
      const [ testId, value ] = input;
      setTarget(getByTestId, testId, value)
    }

    for (const [index, _] of testProjectMilestones.entries()) {
      await pickADateForDatePickerWithTestId(
        `date-picker-div-${ index + 1 }`,
        getByTestId,
        findAllByText,
        testProjectMilestoneDates[index]
      );
    }
  
    for (const [index, _] of testVehicleProjections.entries()) {
      const selectName = `vehicle-projection-select-${index + 1}`;
      const option = String(Number(moment().format('YYYY')) + index)
      const testId = `vehicle-projection-input-${index + 1}`;
      const value = 1;
      await clickOptionForReactSelect({
        selectName,
        option,
      });
      setTarget(getByTestId, testId, value)
    }

    expect(getByRole('button', { name: /SUBMIT/ })).toBeEnabled();
  })
});

describe('test project creation flow', () => {
  Date.now = jest.fn(() => new Date('2021-01-01T00:00:00.000Z'));

  const processedTestProjectMilestones = [
    { projectMilestone: "ALPHA", timeline: moment().format(`yyyy-MM-${testProjectMilestoneDates[0]}`) },
    { projectMilestone: "BETA", timeline: moment().format(`yyyy-MM-${testProjectMilestoneDates[1]}`) },
    { projectMilestone: "PO", timeline: moment().format(`yyyy-MM-${testProjectMilestoneDates[2]}`) },
  ];

  const processedTestVehicleProjections = [...Array(5).keys()].map((index) => ({
    count: 1,
    year: String(Number(moment().format('YYYY')) + index)
  }))

  beforeEach(() => {
    API.post.mockReset();
    API.get.mockReset();

    API.get.mockImplementation(url => {
      if (url.endsWith(API_RESOURCE_URLS.getAllBusinessUnits())) {
        return Promise.resolve({ data: testBusinessUnits });
      }
      if (url.endsWith(API_RESOURCE_URLS.getAllPlantsForBusinessUnit())) {
        return Promise.resolve({ data: testPlants });
      }
      if (url.endsWith(API_RESOURCE_URLS.getAllVehicleLines())) {
        return Promise.resolve({ data: testVehicleLines });
      }
      if (url.endsWith(API_RESOURCE_URLS.getAllProjectMilestones())) {
        return Promise.resolve({ data: testProjectMilestones });
      }
    });
  });

  it('should be able to select values for fields and submit', async () => {
    const testAuthPolicy = getTestAuthPolicy('project-master');
    const testAuthUser = {
      email: "punesqengineer@pb.tml",
      isLoaded: true,
      name: "Pune-Plant SQ Engineer",
      userID: "8289eb80-b90f-41ae-a7ed-03309d536718"
    }

    const { getByTestId, findAllByText, getByText } = render(
      <CreateProjectForm isEditable={isEditable} projectId={projectId} redirectToProjectMasterPage={redirectToProjectMasterPage} />,
      {
        wrapperProps: {
          testAuthPolicy,
          testAuthUser
        },
      }
    );
  
    for (const selection of selections) {
      const [selectName, option] = selection;
      await clickOptionForReactSelect({
        selectName,
        option,
      });
    }
  
    for (const input of inputs) {
      const [ testId, value ] = input;
      setTarget(getByTestId, testId, value)
    }
  
    for (const [index, _] of testProjectMilestones.entries()) {
      await pickADateForDatePickerWithTestId(
        `date-picker-div-${ index + 1 }`,
        getByTestId,
        findAllByText,
        testProjectMilestoneDates[index]
      );
    }
  
    for (const [index, _] of testVehicleProjections.entries()) {
      const selectName = `vehicle-projection-select-${index + 1}`;
      const option = String(Number(moment().format('YYYY')) + index)
      const testId = `vehicle-projection-input-${index + 1}`;
      const value = 1;
      await clickOptionForReactSelect({
        selectName,
        option,
      });
      setTarget(getByTestId, testId, value)
    }
  
    const confirmButton = getByText('SUBMIT');
  
    fireEvent.click(confirmButton);
  
    // NOTE: debug with try catch around the expect to see the proper assertion failure message if any
    await waitFor(() =>
      expect(API.post).toHaveBeenCalledWith(API_RESOURCE_URLS.PROJECTS, {
        code: testProjectCode,
        name: testProjectName,
        businessUnit: testBusinessUnits[0].name,
        plantCodes: [testPlants[0].code],
        vehicleLines: [testVehicleLines[0].name],
        projectMilestoneTimelines: processedTestProjectMilestones,
        vehicleProjections: processedTestVehicleProjections,
        remarks: '',
        editStatus: EDIT_STATUS.COMPLETE,
      }),
    );
  });

  it.each(selections.map(selection => selection[0]))(
    'should not submit if %s is not selected',
    async selectionToExclude => {
      const { getByTestId, findAllByText, getByText } = render(
        <CreateProjectForm isEditable={isEditable} projectId={projectId} redirectToProjectMasterPage={redirectToProjectMasterPage} />,
      );

      const limitedSelections = selections.filter(
        selection => selectionToExclude === 'business-unit'
          ? (selection[0] !== 'business-unit' && selection[0] !==  'plants')
          : selection[0] !== selectionToExclude,
      );

      for (const selection of limitedSelections) {
        const [selectName, option] = selection;
        await clickOptionForReactSelect({
          selectName,
          option,
        });
      }

      for (const input of inputs) {
        const [ testId, value ] = input;
        setTarget(getByTestId, testId, value)
      }
    
      for (const [index, _] of testProjectMilestones.entries()) {
        await pickADateForDatePickerWithTestId(
          `date-picker-div-${ index + 1 }`,
          getByTestId,
          findAllByText,
          testProjectMilestoneDates[index]
        );
      }
    
      for (const [index, _] of testVehicleProjections.entries()) {
        const selectName = `vehicle-projection-select-${index + 1}`;
        const option = String(Number(moment().format('YYYY')) + index)
        const testId = `vehicle-projection-input-${index + 1}`;
        const value = 1;
        await clickOptionForReactSelect({
          selectName,
          option,
        });
        setTarget(getByTestId, testId, value)
      }

      const confirmButton = getByText('SUBMIT');

      fireEvent.click(confirmButton);

      await waitFor(() => expect(API.post).not.toHaveBeenCalledWith());
    },
  );

  it.each(inputs.map(input => input[0]))(
    'should not submit if %s is empty',
    async inputToExclude => {
      const { getByTestId, findAllByText, getByText } = render(
        <CreateProjectForm isEditable={isEditable} projectId={projectId} redirectToProjectMasterPage={redirectToProjectMasterPage} />,
      );

      const limitedInputs = inputs.filter(
        input => input[0] !== inputToExclude,
      );

      for (const selection of selections) {
        const [selectName, option] = selection;
        await clickOptionForReactSelect({
          selectName,
          option,
        });
      }

      for (const input of limitedInputs) {
        const [ testId, value ] = input;
        setTarget(getByTestId, testId, value)
      }

      for (const [index, _] of testProjectMilestones.entries()) {
        await pickADateForDatePickerWithTestId(
          `date-picker-div-${ index + 1 }`,
          getByTestId,
          findAllByText,
          testProjectMilestoneDates[index]
        );
      }
    
      for (const [index, _] of testVehicleProjections.entries()) {
        const selectName = `vehicle-projection-select-${index + 1}`;
        const option = String(Number(moment().format('YYYY')) + index)
        const testId = `vehicle-projection-input-${index + 1}`;
        const value = 1;
        await clickOptionForReactSelect({
          selectName,
          option,
        });
        setTarget(getByTestId, testId, value)
      }

      const confirmButton = getByText('SUBMIT');

      fireEvent.click(confirmButton);

      await waitFor(() => expect(API.post).not.toHaveBeenCalledWith());
    }
  );

  it('should not submit if date for milestone is not selected', async () => {
    const { getByTestId, getByText } = render(
      <CreateProjectForm isEditable={isEditable} projectId={projectId} redirectToProjectMasterPage={redirectToProjectMasterPage} />,
    );

    for (const selection of selections) {
      const [selectName, option] = selection;
      await clickOptionForReactSelect({
        selectName,
        option,
      });
    }

    for (const input of inputs) {
      const [ testId, value ] = input;
      setTarget(getByTestId, testId, value)
    }

    for (const [index, _] of testVehicleProjections.entries()) {
      const selectName = `vehicle-projection-select-${index + 1}`;
      const option = String(Number(moment().format('YYYY')) + index)
      const testId = `vehicle-projection-input-${index + 1}`;
      const value = 1;
      await clickOptionForReactSelect({
        selectName,
        option,
      });
      setTarget(getByTestId, testId, value)
    }

    const confirmButton = getByText('SUBMIT');

    fireEvent.click(confirmButton);

    await waitFor(() => expect(API.post).not.toHaveBeenCalledWith());
  });

  it('should not submit if year or count is not selected for vehicle projection', async () => {
    const { getByTestId, findAllByText, getByText } = render(
      <CreateProjectForm isEditable={isEditable} projectId={projectId} redirectToProjectMasterPage={redirectToProjectMasterPage} />,
    );

    for (const selection of selections) {
      const [selectName, option] = selection;
      await clickOptionForReactSelect({
        selectName,
        option,
      });
    }

    for (const input of inputs) {
      const [ testId, value ] = input;
      setTarget(getByTestId, testId, value)
    }

    for (const [index, _] of testProjectMilestones.entries()) {
      await pickADateForDatePickerWithTestId(
        `date-picker-div-${ index + 1 }`,
        getByTestId,
        findAllByText,
        testProjectMilestoneDates[index]
      );
    }

    const confirmButton = getByText('SUBMIT');

    fireEvent.click(confirmButton);

    await waitFor(() => expect(API.post).not.toHaveBeenCalledWith());
  });
});

it('should reset values when users press yes button', async () => {
  const testAuthPolicy = getTestAuthPolicy('project-master');
  const testAuthUser = {
    email: "punesqengineer@pb.tml",
    isLoaded: true,
    name: "Pune-Plant SQ Engineer",
    userID: "8289eb80-b90f-41ae-a7ed-03309d536718"
  }

  const { getByRole, getByTestId } = render(
    <CreateProjectForm isEditable={isEditable} projectId={projectId} redirectToProjectMasterPage={redirectToProjectMasterPage} />,
    {
      wrapperProps: {
        testAuthPolicy,
        testAuthUser
      },
    }
  );

  const [ testId, value ] = inputs[0];
  setTarget(getByTestId, testId, value)

  fireEvent.click(getByRole('button', { name: /RESET/ }));
  expect(getByTestId('reset-popup')).toBeInTheDocument();

  fireEvent.click(getByRole('button', { name: /YES/ }));

  expect(getByTestId(testId)).toHaveTextContent('');
})