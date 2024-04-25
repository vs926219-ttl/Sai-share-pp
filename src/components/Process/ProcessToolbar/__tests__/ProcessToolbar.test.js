/* eslint-disable consistent-return */
import React from 'react';
import { render, getTestAuthPolicy } from '../../../../test-utils';
import { API } from '../../../../apis/api';
import { API_RESOURCE_URLS } from '../../../../constants';
import ProcessToolbar from '../ProcessToolbar';

const testPartCategories = [
  {
    name: "Advanced Technology",
    description: "Supplier is the leading technology or component developer",
    ppapSubmissionLevels: [
      {
        level: "Level 5",
        description:
          "Production Warrant, product samples and complete supporting data (a review will be conducted at the supplier's manufacturing location)",
      },
    ],
  },
  {
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
  {
    name: "Gray Box",
    description: "Assembly - Customer Design, Child Part – Supplier Design",
    ppapSubmissionLevels: [
      {
        level: "Level 4",
        description:
          "Production Warrant and other requirements as defined by TML",
      },
    ],
  },
  {
    name: "White Box",
    description: "Build Print",
    ppapSubmissionLevels: [
      {
        level: "Level 3",
        description:
          "Production Warrant, product samples, and complete supporting data are submitted to TML",
      },
    ],
  },
  {
    name: "Bulk Materials",
    description: "As per AIAG guidelines",
    ppapSubmissionLevels: [
      {
        level: "Level 2",
        description:
          "Production Warrant, product samples, and dimensional results are submitted to TML",
      },
      {
        level: "Level 1",
        description:
          "Production Warrant and Appearance Approval Report (if applicable) are submitted to TML",
      },
    ],
  },
];

const testPpapSubmissionLevels = [
  {
    level: "Level 1",
    description:
      "Production Warrant and Appearance Approval Report (if applicable) are submitted to TML",
  },
  {
    level: "Level 2",
    description:
      "Production Warrant, product samples, and dimensional results are submitted to TML",
  },
  {
    level: "Level 3",
    description:
      "Production Warrant, product samples, and complete supporting data are submitted to TML",
  },
  {
    level: "Level 4",
    description: "Production Warrant and other requirements as defined by TML",
  },
  {
    level: "Level 5",
    description:
      "Production Warrant, product samples and complete supporting data (a review will be conducted at the supplier's manufacturing location)",
  },
];

beforeEach(() => {
  API.get.mockReset();

  API.get.mockImplementation(url => {
    if(url.endsWith(API_RESOURCE_URLS.PART_CATEGORIES)) {
      return Promise.resolve({ data: testPartCategories });
    }
    if(url.endsWith(API_RESOURCE_URLS.PPAP_SUBMISSIONLEVELS)) {
      return Promise.resolve({ data: testPpapSubmissionLevels });
    }
  })
})

describe('to test authorization', () => {
  it('select fields should be disabled for supplier', () => {
    const testAuthPolicy = getTestAuthPolicy('read-only')
    const testAuthUser = {
      email: "apollo-tyres@at.com",
      isLoaded: true,
      name: "Apollo Tyres",
      userID: "5ee5fd04-8b36-4873-8b44-18f84ead166a"
    }

    render(
      <ProcessToolbar
        inputFields={{
          partCategory: null,
          systemPpapLevel: null,
          overwritePpapLevel: null,
        }}
        ppap={{}}
        highlightMandatoryFields={false}
        dispatch={jest.fn}
      />,
      {
        wrapperProps: {
          testAuthPolicy,
          testAuthUser
        },
      }
    );

    const partCategoryInput = document.querySelector(`.select-part-category__control input`);
    const systemPpapLevelInput = document.querySelector(`.select-system-ppap-level__control input`);
    const overwritePpapLevelInput = document.querySelector(`.select-overwrite-ppap-level__control input`);

    expect(partCategoryInput).toBeDisabled();
    expect(systemPpapLevelInput).toBeDisabled();
    expect(overwritePpapLevelInput).toBeDisabled();
  })

  it('select fields should be enabled sq-engineer', () => {
    const testAuthPolicy = [
      ...getTestAuthPolicy('part-category'),
      ...getTestAuthPolicy('ppap-submission-level'),
    ]
    const testAuthUser = {
      email: "punesqengineer@pb.tml",
      isLoaded: true,
      name: "Pune-Plant SQ Engineer",
      userID: "8289eb80-b90f-41ae-a7ed-03309d536718"
    }

    render(
      <ProcessToolbar
        inputFields={{
          partCategory: null,
          systemPpapLevel: null,
          overwritePpapLevel: null,
        }}
        ppap={{
          _links: {
            terminate: {
              href: "https://api.ep-dev.tatamotors.com/esakha/ppap/25/terminate",
            },
            initiate: {
              href: "https://api.ep-dev.tatamotors.com/esakha/ppap/25/requirements",
            },
            self: { href: "https://api.ep-dev.tatamotors.com/esakha/ppap/25" },
          },
          requirement: {
            _links: {}
          }
        }}
        highlightMandatoryFields={false}
        dispatch={jest.fn}
      />,
      {
        wrapperProps: {
          testAuthPolicy,
          testAuthUser
        },
      }
    );

    const partCategoryInput = document.querySelector(`.select-part-category__control input`);
    const systemPpapLevelInput = document.querySelector(`.select-system-ppap-level__control input`);
    const overwritePpapLevelInput = document.querySelector(`.select-overwrite-ppap-level__control input`);

    expect(partCategoryInput).toBeEnabled();
    expect(systemPpapLevelInput).toBeEnabled();
    expect(overwritePpapLevelInput).toBeEnabled();
  })
});

it('select fields should be disabled if ppap edits are complete', () => {
  const testAuthPolicy = [
    ...getTestAuthPolicy('part-category'),
    ...getTestAuthPolicy('ppap-submission-level'),
  ]
  const testAuthUser = {
    email: "punesqengineer@pb.tml",
    isLoaded: true,
    name: "Pune-Plant SQ Engineer",
    userID: "8289eb80-b90f-41ae-a7ed-03309d536718"
  }

  render(
    <ProcessToolbar
      inputFields={{
        partCategory: null,
        systemPpapLevel: null,
        overwritePpapLevel: null,
      }}
      ppap={{
        _links: {},
        requirement: {
          _links: {}
        }
      }}
      highlightMandatoryFields={false}
      dispatch={jest.fn}
    />,
    {
      wrapperProps: {
        testAuthPolicy,
        testAuthUser
      },
    }
  );

  const partCategoryInput = document.querySelector(`.select-part-category__control input`);
  const systemPpapLevelInput = document.querySelector(`.select-system-ppap-level__control input`);
  const overwritePpapLevelInput = document.querySelector(`.select-overwrite-ppap-level__control input`);

  expect(partCategoryInput).toBeDisabled();
  expect(systemPpapLevelInput).toBeDisabled();
  expect(overwritePpapLevelInput).toBeDisabled();
});