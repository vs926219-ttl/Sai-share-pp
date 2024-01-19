/* eslint-disable no-use-before-define */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import React from 'react';
import moment from 'moment';
import { render, fireEvent, within, waitFor } from '../../../../test-utils';
import { API } from '../../../../apis/api';
import { API_RESOURCE_URLS, EDIT_STATUS } from '../../../../constants';
import { ActionButtons } from '../../..';
import ApqpTimingChart from '../ApqpTimingChart';

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

const checkInputWithTestId = (testId, getByTestId) => {
  fireEvent.click(getByTestId(testId));
};

const apqpTimingChartGroup = [
  {
    activities: [
      {
        id: "alpha-structure",
        name: "Alpha / Structure",
      },
      {
        id: "beta-integration",
        name: "Beta / Integration",
      },
      {
        id: "po",
        name: "PO",
      }
    ],
    id: "supplier-build-schedule",
    name: "Supplier Build Schedule"
  },
  {
    activities: [
      {
        id: "dfmea",
        name: "DFMEA",
      },
      {
        id: "key-characteristics",
        name: "Key Characteristics / GD&T / DVP / Design Reviews",
      },
      {
        id: "proto-type-docs",
        name: "Proto Type DOCs",
      }
    ],
    id: "engineering",
    name: "Engineering"
  }
]

const ppap = {
  id: 25,
  purchaseOrder: { number: "2840044776", createdAt: 1623177000 },
  supplier: {
    id: "cf9ed4bc-8644-4e90-aa5c-8c168c53f7fe",
    code: "I20313",
    groupCode: "I20310",
    name: "IMPERIAL AUTO INDUSTRIES LTD",
    address: {
      value: "PLOT NO 48,SECTOR IIIIE, PANTNAGAR",
      city: "RUDRAPUR",
      district: "",
      pincode: "263153",
    },
  },
  part: {
    revisionId: "8f3b865b-f20b-4f1b-9a56-43f1a39b7098",
    number: "573609130109",
    description: "PIPE ASSY,AIR FILTER TO HOSE",
    partGroup: { id: "ZZZZZZ", description: "Default for DENIS" },
    drawingNumber: "573609130109",
    revisionLevel: "B",
    gross: { value: 0.0, unit: "KG" },
    net: { value: 0.0, unit: "KG" },
    createdAt: 1545849000,
  },
  plant: {
    code: "1500",
    name: "CV Dharwad",
    businessUnits: [{ name: "CVBU" }],
  },
  commodityGroup: "Central High Value Purchase",
  aqCommodityGroup: "CV AQ Chassis",
  purchaseBuyerName: "Mahendra",
  project: {
    id: "d9aaa51b-8b2c-4a2c-bdaa-f7c2ef087803",
    code: "12345",
    name: "Hexa",
    plants: [
      { code: "1001", name: "CV Pune", businessUnits: [{ name: "CVBU" }] },
    ],
    vehicleLines: ["EAGLE", "CARS"],
    businessUnit: "CVBU",
    projectMilestoneTimelines: [
      { projectMilestone: "ALPHA", timeline: "2021-12-25" },
      { projectMilestone: "BETA", timeline: "2021-12-25" },
      { projectMilestone: "PO", timeline: "2021-12-30" },
      { projectMilestone: "PP", timeline: "2022-01-03" },
      { projectMilestone: "SOP", timeline: "2022-01-21" },
    ],
    vehicleProjections: [
      { count: 12345, year: "2021" },
      { count: 12, year: "2022" },
      { count: 12, year: "2023" },
      { count: 12, year: "2024" },
      { count: 12, year: "2025" },
    ],
    remarks: "New ",
    createdBy: "pune-sq-engineer",
    createdAt: 1640321029928,
  },
  state: "APQP",
  kamContactDetails: { id: "12ccb9e2-f102-43ef-a8dd-d65f402d2d8a" },
  createdBy: { name: "pune-sq-engineer" },
  createdAt: 1641360850573,
  _links: {
    self: { href: "https://api.ep-dev.tatamotors.com/esakha/ppap/25" },
    submitAPQP: {href: "https://api.ep-dev.tatamotors.com/esakha/ppap/25/submitAPQP"}
  },
};

const testStartDates = [ '14', '16', '18', '20' ];
const testEndDates = [ '16', '18', '20', '22' ];

beforeEach(() => {
  API.get.mockReset();
  API.post.mockReset();
  API.put.mockReset();

  Date.now = jest.fn(() => new Date('2021-01-01T00:00:00.000Z'));
  
  API.get.mockImplementation(url => {
    if (url.endsWith(API_RESOURCE_URLS.APQP_TIMING_CHART_ACTIVITY_GROUP)) {
      return Promise.resolve({ data: apqpTimingChartGroup });
    }
  });
});

it('should disable start date and end date if not applicable is selected', async () => {
  const { getByTestId } = render(
    <ApqpTimingChart
      ppap={ppap}
      highlightMandatoryFields={false}
      setHighlightMandatoryFields={jest.fn()}
      reloadData={jest.fn()}
    >
      {({ content, actionButtons }) => (
        <>
          <div>{content}</div>
          <div>
            <ActionButtons {...actionButtons} />
          </div>
        </>
      )}
    </ApqpTimingChart>
  );

  await waitFor(() => expect(API.get).toHaveBeenCalledWith(API_RESOURCE_URLS.APQP_TIMING_CHART_ACTIVITY_GROUP));

  const startDatePicker = getByTestId('supplier-build-schedule-start-date-picker-div-1');
  const startDatePickerInput = await within(startDatePicker).findByRole('textbox');
  
  const endDatePicker = getByTestId('supplier-build-schedule-end-date-picker-div-1');
  const endDatePickerInput = await within(endDatePicker).findByRole('textbox');

  expect(startDatePickerInput).toBeEnabled();
  expect(endDatePickerInput).toBeEnabled();

  checkInputWithTestId(
    `supplier-build-schedule-checkbox-1`,
    getByTestId
  );

  expect(startDatePickerInput).toBeDisabled();
  expect(endDatePickerInput).toBeDisabled();
});

describe('test submit apqp timing chart', () => {
  const testPpap = {
    id: 25,
    purchaseOrder: { number: "2840044776", createdAt: 1623177000 },
    supplier: {
      id: "cf9ed4bc-8644-4e90-aa5c-8c168c53f7fe",
      code: "I20313",
      groupCode: "I20310",
      name: "IMPERIAL AUTO INDUSTRIES LTD",
      address: {
        value: "PLOT NO 48,SECTOR IIIIE, PANTNAGAR",
        city: "RUDRAPUR",
        district: "",
        pincode: "263153",
      },
    },
    part: {
      revisionId: "8f3b865b-f20b-4f1b-9a56-43f1a39b7098",
      number: "573609130109",
      description: "PIPE ASSY,AIR FILTER TO HOSE",
      partGroup: { id: "ZZZZZZ", description: "Default for DENIS" },
      drawingNumber: "573609130109",
      revisionLevel: "B",
      gross: { value: 0.0, unit: "KG" },
      net: { value: 0.0, unit: "KG" },
      createdAt: 1545849000,
    },
    plant: {
      code: "1500",
      name: "CV Dharwad",
      businessUnits: [{ name: "CVBU" }],
    },
    commodityGroup: "Central High Value Purchase",
    aqCommodityGroup: "CV AQ Chassis",
    purchaseBuyerName: "Mahendra",
    project: {
      id: "d9aaa51b-8b2c-4a2c-bdaa-f7c2ef087803",
      code: "12345",
      name: "Hexa",
      plants: [
        { code: "1001", name: "CV Pune", businessUnits: [{ name: "CVBU" }] },
      ],
      vehicleLines: ["EAGLE", "CARS"],
      businessUnit: "CVBU",
      projectMilestoneTimelines: [
        { projectMilestone: "ALPHA", timeline: "2021-12-25" },
        { projectMilestone: "BETA", timeline: "2021-12-25" },
        { projectMilestone: "PO", timeline: "2021-12-30" },
        { projectMilestone: "PP", timeline: "2022-01-03" },
        { projectMilestone: "SOP", timeline: "2022-01-21" },
      ],
      vehicleProjections: [
        { count: 12345, year: "2021" },
        { count: 12, year: "2022" },
        { count: 12, year: "2023" },
        { count: 12, year: "2024" },
        { count: 12, year: "2025" },
      ],
      remarks: "New ",
      createdBy: "pune-sq-engineer",
      createdAt: 1640321029928,
    },
    state: "APQP",
    kamContactDetails: { id: "12ccb9e2-f102-43ef-a8dd-d65f402d2d8a" },
    createdBy: { name: "pune-sq-engineer" },
    createdAt: 1641360850573,
    _links: {
      self: { href: "https://api.ep-dev.tatamotors.com/esakha/ppap/25" },
      submitAPQP: {href: "https://api.ep-dev.tatamotors.com/esakha/ppap/25/submitAPQP"}
    },
  };
  
  beforeEach(() => {
    API.get.mockReset();
    API.post.mockReset();
    API.put.mockReset();
  
    Date.now = jest.fn(() => new Date('2021-01-01T00:00:00.000Z'));
    
    API.get.mockImplementation(url => {
      if (url.endsWith(API_RESOURCE_URLS.APQP_TIMING_CHART_ACTIVITY_GROUP)) {
        return Promise.resolve({ data: apqpTimingChartGroup });
      }
    });
  });
  
  it('should be able to select values for fields and submit', async () => {
    const apqpTimingChartAfterSubmit = [
      {
        activities: [
          {
            id: "alpha-structure",
            name: "Alpha / Structure",
          },
          {
            id: "beta-integration",
            name: "Beta / Integration",
          },
          {
            id: "po",
            name: "PO",
          }
        ],
        id: "supplier-build-schedule",
        name: "Supplier Build Schedule"
      },
      {
        activities: [
          {
            id: "dfmea",
            name: "DFMEA",
            notApplicable: true,
          },
          {
            id: "key-characteristics",
            name: "Key Characteristics / GD&T / DVP / Design Reviews",
            notApplicable: true,
          },
          {
            id: "proto-type-docs",
            name: "Proto Type DOCs",
            notApplicable: true,
          }
        ],
        id: "engineering",
        name: "Engineering"
      }
    ]
  
    const knownActivityGroupTimelines = apqpTimingChartAfterSubmit
      .map((activityGroup) => {
        const activities = activityGroup.activities
          .filter((activity) => !activity.notApplicable)
          .map((activity, index) => ({
            activityId: activity.id,
            timeline: {
              start: moment().format(`yyyy-MM-${testStartDates[index]}`),
              end: moment().format(`yyyy-MM-${testEndDates[index]}`),
            },
          }));
        return { groupId: activityGroup.id, activityTimelines: activities };
      });
  
    const { getByText, getByTestId, findAllByText } = render(
      <ApqpTimingChart
        ppap={testPpap}
        highlightMandatoryFields={false}
        setHighlightMandatoryFields={jest.fn()}
        reloadData={jest.fn()}
      >
        {({ content, actionButtons }) => (
          <>
            <div>{content}</div>
            <div>
              <ActionButtons {...actionButtons} />
            </div>
          </>
        )}
      </ApqpTimingChart>
    );
    
    await waitFor(() => expect(API.get).toHaveBeenCalledWith(API_RESOURCE_URLS.APQP_TIMING_CHART_ACTIVITY_GROUP));
  
    for (const [index, _] of apqpTimingChartGroup[0].activities.entries()) {
      await pickADateForDatePickerWithTestId(
        `${apqpTimingChartGroup[0].id}-start-date-picker-div-${ index + 1 }`,
        getByTestId,
        findAllByText,
        testStartDates[index]
      );
      await pickADateForDatePickerWithTestId(
        `${apqpTimingChartGroup[0].id}-end-date-picker-div-${ index + 1 }`,
        getByTestId,
        findAllByText,
        testEndDates[index]
      );
    }
  
    for (const [index, _] of apqpTimingChartGroup[1].activities.entries()) {
      checkInputWithTestId(
        `${apqpTimingChartGroup[1].id}-checkbox-${ index + 1 }`,
        getByTestId
      );
    }
  
    const confirmButton = getByText('SUBMIT');
    fireEvent.click(confirmButton);
  
    await waitFor(() => {
      const { _links: links } = testPpap;
  
      expect(API.post).toHaveBeenCalledWith(links.submitAPQP.href, {
        knownActivityGroupTimelines,
        additionalActivityTimelines: [],
        editStatus: EDIT_STATUS.COMPLETE,
        remarkRequests: [] 
      })
    });
  });
  
  it('shoult not submit if date is not selected', async () => {
    const { getByText, getByTestId, findAllByText } = render(
      <ApqpTimingChart
        ppap={testPpap}
        highlightMandatoryFields={false}
        setHighlightMandatoryFields={jest.fn()}
        reloadData={jest.fn()}
      >
        {({ content, actionButtons }) => (
          <>
            <div>{content}</div>
            <div>
              <ActionButtons {...actionButtons} />
            </div>
          </>
        )}
      </ApqpTimingChart>
    );
    
    await waitFor(() => expect(API.get).toHaveBeenCalledWith(API_RESOURCE_URLS.APQP_TIMING_CHART_ACTIVITY_GROUP));
  
    for (const [index, _] of apqpTimingChartGroup[0].activities.entries()) {
      await pickADateForDatePickerWithTestId(
        `${apqpTimingChartGroup[0].id}-start-date-picker-div-${ index + 1 }`,
        getByTestId,
        findAllByText,
        testStartDates[index]
      );
      await pickADateForDatePickerWithTestId(
        `${apqpTimingChartGroup[0].id}-end-date-picker-div-${ index + 1 }`,
        getByTestId,
        findAllByText,
        testEndDates[index]
      );
    }
  
    const confirmButton = getByText('SUBMIT');
    fireEvent.click(confirmButton);
  
    await waitFor(() =>expect(API.post).not.toHaveBeenCalledWith());
  });
});

describe('test additional details while submit apqp timing chart', () => {
  const testPpap = {
    id: 25,
    purchaseOrder: { number: "2840044776", createdAt: 1623177000 },
    supplier: {
      id: "cf9ed4bc-8644-4e90-aa5c-8c168c53f7fe",
      code: "I20313",
      groupCode: "I20310",
      name: "IMPERIAL AUTO INDUSTRIES LTD",
      address: {
        value: "PLOT NO 48,SECTOR IIIIE, PANTNAGAR",
        city: "RUDRAPUR",
        district: "",
        pincode: "263153",
      },
    },
    part: {
      revisionId: "8f3b865b-f20b-4f1b-9a56-43f1a39b7098",
      number: "573609130109",
      description: "PIPE ASSY,AIR FILTER TO HOSE",
      partGroup: { id: "ZZZZZZ", description: "Default for DENIS" },
      drawingNumber: "573609130109",
      revisionLevel: "B",
      gross: { value: 0.0, unit: "KG" },
      net: { value: 0.0, unit: "KG" },
      createdAt: 1545849000,
    },
    plant: {
      code: "1500",
      name: "CV Dharwad",
      businessUnits: [{ name: "CVBU" }],
    },
    commodityGroup: "Central High Value Purchase",
    aqCommodityGroup: "CV AQ Chassis",
    purchaseBuyerName: "Mahendra",
    project: {
      id: "d9aaa51b-8b2c-4a2c-bdaa-f7c2ef087803",
      code: "12345",
      name: "Hexa",
      plants: [
        { code: "1001", name: "CV Pune", businessUnits: [{ name: "CVBU" }] },
      ],
      vehicleLines: ["EAGLE", "CARS"],
      businessUnit: "CVBU",
      projectMilestoneTimelines: [
        { projectMilestone: "ALPHA", timeline: "2021-12-25" },
        { projectMilestone: "BETA", timeline: "2021-12-25" },
        { projectMilestone: "PO", timeline: "2021-12-30" },
        { projectMilestone: "PP", timeline: "2022-01-03" },
        { projectMilestone: "SOP", timeline: "2022-01-21" },
      ],
      vehicleProjections: [
        { count: 12345, year: "2021" },
        { count: 12, year: "2022" },
        { count: 12, year: "2023" },
        { count: 12, year: "2024" },
        { count: 12, year: "2025" },
      ],
      remarks: "New ",
      createdBy: "pune-sq-engineer",
      createdAt: 1640321029928,
    },
    state: "APQP",
    kamContactDetails: { id: "12ccb9e2-f102-43ef-a8dd-d65f402d2d8a" },
    createdBy: { name: "pune-sq-engineer" },
    createdAt: 1641360850573,
    _links: {
      self: { href: "https://api.ep-dev.tatamotors.com/esakha/ppap/25" },
      submitAPQP: {href: "https://api.ep-dev.tatamotors.com/esakha/ppap/25/submitAPQP"}
    },
  };
  
  beforeEach(() => {
    API.get.mockReset();
    API.post.mockReset();
    API.put.mockReset();
  
    Date.now = jest.fn(() => new Date('2021-01-01T00:00:00.000Z'));
    
    API.get.mockImplementation(url => {
      if (url.endsWith(API_RESOURCE_URLS.APQP_TIMING_CHART_ACTIVITY_GROUP)) {
        return Promise.resolve({ data: apqpTimingChartGroup });
      }
    });
  });
  
  it('should be able to select values for fields and submit', async () => {
    const apqpTimingChartAfterSubmit = [
      {
        activities: [
          {
            id: "alpha-structure",
            name: "Alpha / Structure",
          },
          {
            id: "beta-integration",
            name: "Beta / Integration",
          },
          {
            id: "po",
            name: "PO",
          }
        ],
        id: "supplier-build-schedule",
        name: "Supplier Build Schedule"
      },
      {
        activities: [
          {
            id: "dfmea",
            name: "DFMEA",
            notApplicable: true,
          },
          {
            id: "key-characteristics",
            name: "Key Characteristics / GD&T / DVP / Design Reviews",
            notApplicable: true,
          },
          {
            id: "proto-type-docs",
            name: "Proto Type DOCs",
            notApplicable: true,
          }
        ],
        id: "engineering",
        name: "Engineering"
      }
    ]
  
    const knownActivityGroupTimelines = apqpTimingChartAfterSubmit
      .map((activityGroup) => {
        const activities = activityGroup.activities
          .filter((activity) => !activity.notApplicable)
          .map((activity, index) => ({
            activityId: activity.id,
            timeline: {
              start: moment().format(`yyyy-MM-${testStartDates[index]}`),
              end: moment().format(`yyyy-MM-${testEndDates[index]}`),
            },
          }));
        return { groupId: activityGroup.id, activityTimelines: activities };
      });

    const testActivityName = 'test activity';

    const additionalActivityTimelines = [{
      activity: testActivityName,
      timeline: {
        start: moment().format(`yyyy-MM-${testStartDates[0]}`),
        end: moment().format(`yyyy-MM-${testEndDates[0]}`)
      }
    }]
  
    const { getByText, getByTestId, findAllByText } = render(
      <ApqpTimingChart
        ppap={testPpap}
        highlightMandatoryFields={false}
        setHighlightMandatoryFields={jest.fn()}
        reloadData={jest.fn()}
      >
        {({ content, actionButtons }) => (
          <>
            <div>{content}</div>
            <div>
              <ActionButtons {...actionButtons} />
            </div>
          </>
        )}
      </ApqpTimingChart>
    );
    
    await waitFor(() => expect(API.get).toHaveBeenCalledWith(API_RESOURCE_URLS.APQP_TIMING_CHART_ACTIVITY_GROUP));
  
    for (const [index, _] of apqpTimingChartGroup[0].activities.entries()) {
      await pickADateForDatePickerWithTestId(
        `${apqpTimingChartGroup[0].id}-start-date-picker-div-${ index + 1 }`,
        getByTestId,
        findAllByText,
        testStartDates[index]
      );
      await pickADateForDatePickerWithTestId(
        `${apqpTimingChartGroup[0].id}-end-date-picker-div-${ index + 1 }`,
        getByTestId,
        findAllByText,
        testEndDates[index]
      );
    }
  
    for (const [index, _] of apqpTimingChartGroup[1].activities.entries()) {
      checkInputWithTestId(
        `${apqpTimingChartGroup[1].id}-checkbox-${ index + 1 }`,
        getByTestId
      );
    }

    const additionalDetailsButton = getByText('+ Add');
    fireEvent.click(additionalDetailsButton);

    expect(getByTestId('additional-details-popup')).toBeInTheDocument();

    const activityNameInput = getByTestId('name-input');
    fireEvent.change(activityNameInput, {
      target: { value: testActivityName }
    });

    await pickADateForDatePickerWithTestId(
      'additional-details-start-date-picker-div',
      getByTestId,
      findAllByText,
      testStartDates[0]
    );
    await pickADateForDatePickerWithTestId(
      'additional-details-end-date-picker-div',
      getByTestId,
      findAllByText,
      testEndDates[0]
    );

    fireEvent.click(getByText('ADD'));

    const confirmButton = getByText('SUBMIT');
    fireEvent.click(confirmButton);
  
    await waitFor(() => {
      const { _links: links } = testPpap;
  
      expect(API.post).toHaveBeenCalledWith(links.submitAPQP.href, {
        knownActivityGroupTimelines,
        additionalActivityTimelines,
        editStatus: EDIT_STATUS.COMPLETE,
        remarkRequests: []
      })
    });
  });
});

describe('test save as draft while APQP initiation', () => {
  const testPpap = {
    id: 25,
    purchaseOrder: { number: "2840044776", createdAt: 1623177000 },
    supplier: {
      id: "cf9ed4bc-8644-4e90-aa5c-8c168c53f7fe",
      code: "I20313",
      groupCode: "I20310",
      name: "IMPERIAL AUTO INDUSTRIES LTD",
      address: {
        value: "PLOT NO 48,SECTOR IIIIE, PANTNAGAR",
        city: "RUDRAPUR",
        district: "",
        pincode: "263153",
      },
    },
    part: {
      revisionId: "8f3b865b-f20b-4f1b-9a56-43f1a39b7098",
      number: "573609130109",
      description: "PIPE ASSY,AIR FILTER TO HOSE",
      partGroup: { id: "ZZZZZZ", description: "Default for DENIS" },
      drawingNumber: "573609130109",
      revisionLevel: "B",
      gross: { value: 0.0, unit: "KG" },
      net: { value: 0.0, unit: "KG" },
      createdAt: 1545849000,
    },
    plant: {
      code: "1500",
      name: "CV Dharwad",
      businessUnits: [{ name: "CVBU" }],
    },
    commodityGroup: "Central High Value Purchase",
    aqCommodityGroup: "CV AQ Chassis",
    purchaseBuyerName: "Mahendra",
    project: {
      id: "d9aaa51b-8b2c-4a2c-bdaa-f7c2ef087803",
      code: "12345",
      name: "Hexa",
      plants: [
        { code: "1001", name: "CV Pune", businessUnits: [{ name: "CVBU" }] },
      ],
      vehicleLines: ["EAGLE", "CARS"],
      businessUnit: "CVBU",
      projectMilestoneTimelines: [
        { projectMilestone: "ALPHA", timeline: "2021-12-25" },
        { projectMilestone: "BETA", timeline: "2021-12-25" },
        { projectMilestone: "PO", timeline: "2021-12-30" },
        { projectMilestone: "PP", timeline: "2022-01-03" },
        { projectMilestone: "SOP", timeline: "2022-01-21" },
      ],
      vehicleProjections: [
        { count: 12345, year: "2021" },
        { count: 12, year: "2022" },
        { count: 12, year: "2023" },
        { count: 12, year: "2024" },
        { count: 12, year: "2025" },
      ],
      remarks: "New ",
      createdBy: "pune-sq-engineer",
      createdAt: 1640321029928,
    },
    state: "APQP",
    kamContactDetails: { id: "12ccb9e2-f102-43ef-a8dd-d65f402d2d8a" },
    createdBy: { name: "pune-sq-engineer" },
    createdAt: 1641360850573,
    _links: {
      self: { href: "https://api.ep-dev.tatamotors.com/esakha/ppap/25" },
      submitAPQP: {href: "https://api.ep-dev.tatamotors.com/esakha/ppap/25/submitAPQP"}
    },
  };

  const testPartialInitiatedApqp = {
    id: 38,
    apqpTimingChart: {
      additionalActivityTimelines: [],
      editStatus: "COMPLETE",
      id: "b04b1a18-35d2-4f44-b313-576e76a7228f",
      knownActivityGroupTimelines: [
        {
          group: {id: "supplier-build-schedule",name: "Supplier Build Schedule"},
          activityTimelines: [
            {
              activity: {id: "alpha-structure", name: "alpha structure"},
              timeline: {start: "2022-01-29", end: "2022-01-31"}
            },
            {
              activity: {id: "beta-integration", name: "beta integration"},
              timeline: {start: "2022-01-29", end: "2022-01-31"}
            },
            {
              activity: {id: "po", name: "PO"},
              timeline: {start: "2022-01-29", end: "2022-01-31"}
            }
          ]
        }
      ],
      ppapId: 34,
      remarks: [],
      reviews: [],
      _links: {
        submitAPQP: {href: "https://api.ep-dev.tatamotors.com/esakha/supplier/test-id/ppap/89/apqpTimingCharts/test-id123"}
      }
    },
    purchaseOrder: { number: "3540049171", createdAt: 1628706600 },
    supplier: {
      id: "694cd540-1e4a-4a5f-b4d3-1448d2baae97",
      code: "F61221",
      groupCode: "F61220",
      name: "FLEETGUARD FILTERS PVT LTD",
      address: {
        value: "PLOT NO 304 ANDAR KISIM DON IIAT MOUZA RAM CHANDRA PUR",
        city: "JAMSHEDPUR",
        district: "KHARSWAN",
        pincode: "832108",
      },
    },
    part: {
      revisionId: "400e6cea-e262-41e9-b8f3-fee473b043ce",
      number: "570109130344",
      description: "PIPE ASSY",
      partGroup: { id: "ZZZZZZ", description: "Default for DENIS" },
      drawingNumber: "570109130344",
      revisionLevel: "C",
      gross: { value: 0.0, unit: "KG" },
      net: { value: 0.0, unit: "KG" },
      createdAt: 1576175400,
    },
    plant: {
      code: "2001",
      name: "CV Jamshedpur",
      businessUnits: [{ name: "CVBU" }],
    },
    commodityGroup: "Central High Value Purchase",
    aqCommodityGroup: "CV AQ Casting, Forging & Machining",
    purchaseBuyerName: "Test buyer",
    project: {
      id: "ab1c0675-b24d-4e5f-9466-b90d3ccdc0bb",
      code: "HEXA",
      name: "HX2022",
      plants: [
        {
          code: "1001",
          name: "CV Pune",
          businessUnits: [{ name: "CVBU" }],
        },
      ],
      vehicleLines: ["CARS"],
      businessUnit: "CVBU",
      projectMilestoneTimelines: [
        { projectMilestone: "ALPHA", timeline: "2021-12-23" },
        { projectMilestone: "BETA", timeline: "2021-12-25" },
        { projectMilestone: "PO", timeline: "2021-12-26" },
        { projectMilestone: "PP", timeline: "2021-12-27" },
        { projectMilestone: "SOP", timeline: "2021-12-29" },
      ],
      vehicleProjections: [
        { count: 10, year: "2021" },
        { count: 10, year: "2022" },
        { count: 10, year: "2023" },
        { count: 15, year: "2024" },
        { count: 20, year: "2025" },
      ],
      remarks: " ",
      createdBy: "pune-sq-engineer",
      createdAt: 1640259357918,
    },
    state: "INITIATE",
    requirement: {
      id: "597dbc39-8344-4bad-bd6a-01b8a08764a6",
      ppapId: 38,
      partCategory: {
        name: "Black Box",
        description: "Parts where the Supplier has IPR and owns the design",
        ppapSubmissionLevels: [
          {
            level: "Level 5",
            description:
              "Production Warrant, product samples and complete supporting data (a review will be conducted at the supplier's manufacturing location)",
          },
        ],
      },
      level: {
        level: "Level 5",
        description:
          "Production Warrant, product samples and complete supporting data (a review will be conducted at the supplier's manufacturing location)",
      },
      stageRequirements: [],
      remarks: "",
      editStatus: "DRAFT",
      _links: {
        initiate: {
          href:
            "https://api.ep-dev.tatamotors.com/esakha/ppap/38/requirements/597dbc39-8344-4bad-bd6a-01b8a08764a6",
        },
      },
    },
    kamContactDetails: {},
    createdBy: { name: "tmldev" },
    createdAt: 1640332160509,
    _links: {
      terminate: {
        href: "https://api.ep-dev.tatamotors.com/esakha/ppap/38/terminate",
      },
      self: { href: "https://api.ep-dev.tatamotors.com/esakha/ppap/38" },
    },
  };

  beforeEach(() => {
    API.get.mockReset();
    API.post.mockReset();
    API.put.mockReset();

    Date.now = jest.fn(() => new Date('2021-01-01T00:00:00.000Z'));
    
    API.get.mockImplementation(url => {
      if (url.endsWith(API_RESOURCE_URLS.APQP_TIMING_CHART_ACTIVITY_GROUP)) {
        return Promise.resolve({ data: apqpTimingChartGroup });
      }
    });
  });

  it('should be able to select values for fields and submit', async () => {
    const knownActivityGroupTimelines = apqpTimingChartGroup
      .map((activityGroup) => {
        const activities = activityGroup.activities
          .map((activity, index) => {
            const startDate = activityGroup.id === apqpTimingChartGroup[0].id
              ? moment().format(`yyyy-MM-${testStartDates[index]}`)
              : null
            const endDate = activityGroup.id === apqpTimingChartGroup[0].id
              ? moment().format(`yyyy-MM-${testEndDates[index]}`)
              : null
            
            return {
              activityId: activity.id,
              timeline: {
                start: startDate,
                end: endDate,
              }
            }
          });
        return { groupId: activityGroup.id, activityTimelines: activities };
      })
  
    const { getByText, getByTestId, findAllByText } = render(
      <ApqpTimingChart
        ppap={testPpap}
        highlightMandatoryFields={false}
        setHighlightMandatoryFields={jest.fn()}
        reloadData={jest.fn()}
      >
        {({ content, actionButtons }) => (
          <>
            <div>{content}</div>
            <div>
              <ActionButtons {...actionButtons} />
            </div>
          </>
        )}
      </ApqpTimingChart>
    );
    
    await waitFor(() => expect(API.get).toHaveBeenCalledWith(API_RESOURCE_URLS.APQP_TIMING_CHART_ACTIVITY_GROUP));
    
    for (const [index, _] of apqpTimingChartGroup[0].activities.entries()) {
      await pickADateForDatePickerWithTestId(
        `${apqpTimingChartGroup[0].id}-start-date-picker-div-${ index + 1 }`,
        getByTestId,
        findAllByText,
        testStartDates[index]
      );
      await pickADateForDatePickerWithTestId(
        `${apqpTimingChartGroup[0].id}-end-date-picker-div-${ index + 1 }`,
        getByTestId,
        findAllByText,
        testEndDates[index]
      );
    }

    const saveAsDraftButton = getByText('SAVE AS DRAFT');
    fireEvent.click(saveAsDraftButton);

    await waitFor(() => {
      const { _links: links } = testPpap;

      expect(API.post).toHaveBeenCalledWith(links.submitAPQP.href, {
        knownActivityGroupTimelines,
        additionalActivityTimelines: [],
        editStatus: EDIT_STATUS.DRAFT,
        remarkRequests: [],
      })
    });
  });

  it('should be able to select values for fields and submit for already saved apqp', async () => {
    const alreadyFilledActivityGroup = testPartialInitiatedApqp.apqpTimingChart.knownActivityGroupTimelines.map(
      (activityGroup) => {
        const activities = activityGroup.activityTimelines.map(({ activity, timeline }) => ({
          activityId: activity.id,
          timeline
        }));

        return { groupId: activityGroup.group.id, activityTimelines: activities }
      }
    );

    const toBeFilledActivityGroup = [
      {
        groupId: apqpTimingChartGroup[1].id,
        activityTimelines: apqpTimingChartGroup[1].activities.map(
          (activity, index) => ({
            activityId: activity.id,
            timeline: {
              start: moment().format(`yyyy-MM-${testStartDates[index]}`),
              end: moment().format(`yyyy-MM-${testEndDates[index]}`),
            },
          })
        ),
      },
    ];

    const knownActivityGroupTimelines = [ ...alreadyFilledActivityGroup, ...toBeFilledActivityGroup ];

    const { getByText, getByTestId, findAllByText } = render(
      <ApqpTimingChart
        ppap={testPartialInitiatedApqp}
        highlightMandatoryFields={false}
        setHighlightMandatoryFields={jest.fn()}
        reloadData={jest.fn()}
      >
        {({ content, actionButtons }) => (
          <>
            <div>{content}</div>
            <div>
              <ActionButtons {...actionButtons} />
            </div>
          </>
        )}
      </ApqpTimingChart>
    );

    await waitFor(() => expect(API.get).toHaveBeenCalledWith(API_RESOURCE_URLS.APQP_TIMING_CHART_ACTIVITY_GROUP));
    
    for (const [index, _] of apqpTimingChartGroup[1].activities.entries()) {
      await pickADateForDatePickerWithTestId(
        `${apqpTimingChartGroup[1].id}-start-date-picker-div-${ index + 1 }`,
        getByTestId,
        findAllByText,
        testStartDates[index]
      );
      await pickADateForDatePickerWithTestId(
        `${apqpTimingChartGroup[1].id}-end-date-picker-div-${ index + 1 }`,
        getByTestId,
        findAllByText,
        testEndDates[index]
      );
    }

    const saveAsDraftButton = getByText('SAVE AS DRAFT');
    fireEvent.click(saveAsDraftButton);

    await waitFor(() => {
      const { apqpTimingChart } = testPartialInitiatedApqp;
      const { _links: links } = apqpTimingChart;

      expect(API.put).toHaveBeenCalledWith(links.submitAPQP.href, {
        id: apqpTimingChart.id, 
        knownActivityGroupTimelines,
        additionalActivityTimelines: [],
        editStatus: EDIT_STATUS.DRAFT,
        remarkRequests: []
      })
    });
  });
});

describe('test approve and revise APQP timing chart', () => {
  const testPpap = {
    id: 38,
    apqpTimingChart: {
      additionalActivityTimelines: [],
      editStatus: "COMPLETE",
      id: "b04b1a18-35d2-4f44-b313-576e76a7228f",
      knownActivityGroupTimelines: [
        {
          group: {id: "supplier-build-schedule",name: "Supplier Build Schedule"},
          activityTimelines: [
            {
              activity: {id: "alpha-structure", name: "alpha structure"},
              timeline: {start: "2022-01-29", end: "2022-01-31"}
            },
            {
              activity: {id: "beta-integration", name: "beta integration"},
              timeline: {start: "2022-01-29", end: "2022-01-31"}
            },
            {
              activity: {id: "po", name: "PO"},
              timeline: {start: "2022-01-29", end: "2022-01-31"}
            }
          ]
        }
      ],
      ppapId: 34,
      remarks: [],
      reviews: [],
      _links: {
        revise: {
          href: "https://api.ep-dev.tatamotors.com/esakhappap/38/apqpTimingCharts/revision",
        },
        approve: {
          href: "https://api.ep-dev.tatamotors.com/esakhappap/38/apqpTimingCharts/approval",
        },
      }
    },
    purchaseOrder: { number: "3540049171", createdAt: 1628706600 },
    supplier: {
      id: "694cd540-1e4a-4a5f-b4d3-1448d2baae97",
      code: "F61221",
      groupCode: "F61220",
      name: "FLEETGUARD FILTERS PVT LTD",
      address: {
        value: "PLOT NO 304 ANDAR KISIM DON IIAT MOUZA RAM CHANDRA PUR",
        city: "JAMSHEDPUR",
        district: "KHARSWAN",
        pincode: "832108",
      },
    },
    part: {
      revisionId: "400e6cea-e262-41e9-b8f3-fee473b043ce",
      number: "570109130344",
      description: "PIPE ASSY",
      partGroup: { id: "ZZZZZZ", description: "Default for DENIS" },
      drawingNumber: "570109130344",
      revisionLevel: "C",
      gross: { value: 0.0, unit: "KG" },
      net: { value: 0.0, unit: "KG" },
      createdAt: 1576175400,
    },
    plant: {
      code: "2001",
      name: "CV Jamshedpur",
      businessUnits: [{ name: "CVBU" }],
    },
    commodityGroup: "Central High Value Purchase",
    aqCommodityGroup: "CV AQ Casting, Forging & Machining",
    purchaseBuyerName: "Test buyer",
    project: {
      id: "ab1c0675-b24d-4e5f-9466-b90d3ccdc0bb",
      code: "HEXA",
      name: "HX2022",
      plants: [
        {
          code: "1001",
          name: "CV Pune",
          businessUnits: [{ name: "CVBU" }],
        },
      ],
      vehicleLines: ["CARS"],
      businessUnit: "CVBU",
      projectMilestoneTimelines: [
        { projectMilestone: "ALPHA", timeline: "2021-12-23" },
        { projectMilestone: "BETA", timeline: "2021-12-25" },
        { projectMilestone: "PO", timeline: "2021-12-26" },
        { projectMilestone: "PP", timeline: "2021-12-27" },
        { projectMilestone: "SOP", timeline: "2021-12-29" },
      ],
      vehicleProjections: [
        { count: 10, year: "2021" },
        { count: 10, year: "2022" },
        { count: 10, year: "2023" },
        { count: 15, year: "2024" },
        { count: 20, year: "2025" },
      ],
      remarks: " ",
      createdBy: "pune-sq-engineer",
      createdAt: 1640259357918,
    },
    state: "INITIATE",
    requirement: {
      id: "597dbc39-8344-4bad-bd6a-01b8a08764a6",
      ppapId: 38,
      partCategory: {
        name: "Black Box",
        description: "Parts where the Supplier has IPR and owns the design",
        ppapSubmissionLevels: [
          {
            level: "Level 5",
            description:
              "Production Warrant, product samples and complete supporting data (a review will be conducted at the supplier's manufacturing location)",
          },
        ],
      },
      level: {
        level: "Level 5",
        description:
          "Production Warrant, product samples and complete supporting data (a review will be conducted at the supplier's manufacturing location)",
      },
      stageRequirements: [],
      remarks: "",
      editStatus: "DRAFT",
      _links: {
        initiate: {
          href:
            "https://api.ep-dev.tatamotors.com/esakha/ppap/38/requirements/597dbc39-8344-4bad-bd6a-01b8a08764a6",
        },
      },
    },
    kamContactDetails: {},
    createdBy: { name: "tmldev" },
    createdAt: 1640332160509,
    _links: {
      self: { href: "https://api.ep-dev.tatamotors.com/esakha/ppap/38" },
    },
  };

  beforeEach(() => {
    API.get.mockReset();
    API.post.mockReset();
    API.put.mockReset();
  
    Date.now = jest.fn(() => new Date('2021-01-01T00:00:00.000Z'));
    
    API.get.mockImplementation(url => {
      if (url.endsWith(API_RESOURCE_URLS.APQP_TIMING_CHART_ACTIVITY_GROUP)) {
        return Promise.resolve({ data: apqpTimingChartGroup });
      }
    });
  });

  it('should approve the apqp timing chart', async () => {
    const { getByText } = render(
      <ApqpTimingChart
        ppap={testPpap}
        highlightMandatoryFields={false}
        setHighlightMandatoryFields={jest.fn()}
        reloadData={jest.fn()}
      >
        {({ content, actionButtons }) => (
          <>
            <div>{content}</div>
            <div>
              <ActionButtons {...actionButtons} />
            </div>
          </>
        )}
      </ApqpTimingChart>
    );
    
    await waitFor(() => expect(API.get).toHaveBeenCalledWith(API_RESOURCE_URLS.APQP_TIMING_CHART_ACTIVITY_GROUP));
    
    const approveButton = getByText('APPROVE');
    fireEvent.click(approveButton);

    await waitFor(() => {
      const { apqpTimingChart } = testPpap;
      const { _links: links } = apqpTimingChart;

      expect(API.post).toHaveBeenCalledWith(links.approve.href, {})
    });
  });

  it('should review the apqp timing chart', async () => {
    const { getByText } = render(
      <ApqpTimingChart
        ppap={testPpap}
        highlightMandatoryFields={false}
        setHighlightMandatoryFields={jest.fn()}
        reloadData={jest.fn()}
      >
        {({ content, actionButtons }) => (
          <>
            <div>{content}</div>
            <div>
              <ActionButtons {...actionButtons} />
            </div>
          </>
        )}
      </ApqpTimingChart>
    );
    
    await waitFor(() => expect(API.get).toHaveBeenCalledWith(API_RESOURCE_URLS.APQP_TIMING_CHART_ACTIVITY_GROUP));
    
    const reviseButton = getByText('REVISE');
    fireEvent.click(reviseButton);

    await waitFor(() => {
      const { apqpTimingChart } = testPpap;
      const { _links: links } = apqpTimingChart;

      expect(API.post).toHaveBeenCalledWith(links.revise.href, {})
    });
  });
});
