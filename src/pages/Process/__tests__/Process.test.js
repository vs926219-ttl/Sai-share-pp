/* eslint-disable no-use-before-define */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import React from 'react';
import moment from 'moment';
import { render, fireEvent, within, waitFor, screen } from '../../../test-utils';
import Process from '../Process';
import { API } from '../../../apis/api';
import { API_RESOURCE_URLS, EDIT_STATUS } from '../../../constants';

const testTodoList = {
  content: [
    {
      id: "1c8b94ba-9bf9-4575-a263-6799675f1d2a",
      partNumber: "502240106305",
      projectCode: "HEXA",
      commodity: "Central High Value Purchase",
      supplierCode: "A06127",
      description: "Initiate PPAP",
      assignee: { name: "pune-sq-engineer" },
      createdAt: 1641635465895,
      taskType: "PPAP",
      status: "OPEN",
      ppapId: 38,
      links: [
        {
          rel: "ppap",
          href: "https://api.ep-dev.tatamotors.com/esakha/ppap/38",
        },
      ],
    },
    {
      id: "ca7b2ba6-2cc5-44fb-af2f-8218515fa417",
      partNumber: "274768900143",
      projectCode: "HEXA",
      commodity: "CV Chassis",
      supplierCode: "T63663",
      description: "Initiate PPAP",
      assignee: { name: "pune-sq-engineer" },
      createdAt: 1641375425443,
      taskType: "PPAP",
      status: "OPEN",
      ppapId: 29,
      links: [
        {
          rel: "ppap",
          href: "https://api.ep-dev.tatamotors.com/esakha/ppap/29",
        },
      ],
    },
    {
      id: "6f4c5920-1512-4b85-a4b6-c70235d1e04e",
      partNumber: "573609130109",
      projectCode: "123456",
      commodity: "Central Powertrain",
      supplierCode: "I20313",
      description: "Initiate PPAP",
      assignee: { name: "tmldev" },
      createdAt: 1641368936513,
      taskType: "PPAP",
      status: "OPEN",
      ppapId: 28,
      links: [
        {
          rel: "ppap",
          href: "https://api.ep-dev.tatamotors.com/esakha/ppap/28",
        },
      ],
    },
    {
      id: "37f41858-d668-4e32-8689-9ecfb840b329",
      partNumber: "573609130109",
      projectCode: "HEXA",
      commodity: "Central Powertrain",
      supplierCode: "I20313",
      description: "Initiate PPAP",
      assignee: { name: "pune-sq-engineer" },
      createdAt: 1641362586993,
      taskType: "PPAP",
      status: "OPEN",
      ppapId: 27,
      links: [
        {
          rel: "ppap",
          href: "https://api.ep-dev.tatamotors.com/esakha/ppap/27",
        },
      ],
    },
    {
      id: "be03faa6-3a2a-4d12-b9a5-fc0403f5af49",
      partNumber: "573609130109",
      projectCode: "123456",
      commodity: "Central Powertrain",
      supplierCode: "I20313",
      description: "Initiate PPAP",
      assignee: { name: "tmldev" },
      createdAt: 1641362388549,
      taskType: "PPAP",
      status: "OPEN",
      ppapId: 26,
      links: [
        {
          rel: "ppap",
          href: "https://api.ep-dev.tatamotors.com/esakha/ppap/26",
        },
      ],
    },
    {
      id: "18934836-f77f-4e2d-ac04-77938451f566",
      partNumber: "573609130109",
      projectCode: "12345",
      commodity: "Central High Value Purchase",
      supplierCode: "I20313",
      description: "Initiate PPAP",
      assignee: { name: "pune-sq-engineer" },
      createdAt: 1641360850583,
      taskType: "PPAP",
      status: "OPEN",
      ppapId: 25,
      links: [
        {
          rel: "ppap",
          href: "https://api.ep-dev.tatamotors.com/esakha/ppap/25",
        },
      ],
    },
    {
      id: "c4e7cbbf-472b-452c-a96c-6e6ff1c779c5",
      partNumber: "570109130344",
      projectCode: "123456",
      commodity: "Central Powertrain",
      supplierCode: "F61221",
      description: "Initiate PPAP",
      assignee: { name: "tmldev" },
      createdAt: 1641304267041,
      taskType: "PPAP",
      status: "OPEN",
      ppapId: 24,
      links: [
        {
          rel: "ppap",
          href: "https://api.ep-dev.tatamotors.com/esakha/ppap/24",
        },
      ],
    },
  ],
  last: true,
  totalElements: 7
};

const testOverviewList = {
  content: [
    {
      id: 2,
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
      commodityGroup: "Central Powertrain",
      aqCommodityGroup: "CV AQ Body",
      purchaseBuyerName: "Test",
      project: {
        id: "4da2f105-e92d-4978-bf23-94655cb77dcf",
        code: "123456",
        name: "test",
        plants: [
          {
            code: "1001",
            name: "CV Pune",
            businessUnits: [{ name: "CVBU" }],
          },
        ],
        vehicleLines: ["ARIA"],
        businessUnit: "CVBU",
        projectMilestoneTimelines: [
          { projectMilestone: "ALPHA", timeline: "2021-12-02" },
          { projectMilestone: "BETA", timeline: "2021-12-22" },
          { projectMilestone: "PO", timeline: "2021-12-23" },
          { projectMilestone: "PP", timeline: "2021-12-24" },
          { projectMilestone: "SOP", timeline: "2021-12-25" },
        ],
        vehicleProjections: [
          { count: 98, year: "2021" },
          { count: 100, year: "2022" },
          { count: 100, year: "2023" },
          { count: 100, year: "2024" },
          { count: 100, year: "2025" },
        ],
        remarks: "test",
        createdBy: "tmldev",
        createdAt: 1640076117041,
      },
      state: "INITIATE",
      kamContactDetails: {},
      createdBy: { name: "tmldev" },
      createdAt: 1640082592618,
      links: [
        {
          rel: "terminate",
          href: "https://api.ep-dev.tatamotors.com/esakha/ppap/2/terminate",
        },
        {
          rel: "initiate",
          href: "https://api.ep-dev.tatamotors.com/esakha/ppap/2/requirements",
        },
        {
          rel: "self",
          href: "https://api.ep-dev.tatamotors.com/esakha/ppap/2",
        },
      ],
    },
    {
      id: 4,
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
      commodityGroup: "Central Powertrain",
      aqCommodityGroup: "CV AQ Body",
      purchaseBuyerName: "Test",
      project: {
        id: "4da2f105-e92d-4978-bf23-94655cb77dcf",
        code: "123456",
        name: "test",
        plants: [
          {
            code: "1001",
            name: "CV Pune",
            businessUnits: [{ name: "CVBU" }],
          },
        ],
        vehicleLines: ["ARIA"],
        businessUnit: "CVBU",
        projectMilestoneTimelines: [
          { projectMilestone: "ALPHA", timeline: "2021-12-02" },
          { projectMilestone: "BETA", timeline: "2021-12-22" },
          { projectMilestone: "PO", timeline: "2021-12-23" },
          { projectMilestone: "PP", timeline: "2021-12-24" },
          { projectMilestone: "SOP", timeline: "2021-12-25" },
        ],
        vehicleProjections: [
          { count: 98, year: "2021" },
          { count: 100, year: "2022" },
          { count: 100, year: "2023" },
          { count: 100, year: "2024" },
          { count: 100, year: "2025" },
        ],
        remarks: "test",
        createdBy: "tmldev",
        createdAt: 1640076117041,
      },
      state: "INITIATE",
      kamContactDetails: {},
      createdBy: { name: "tmldev" },
      createdAt: 1640087315887,
      links: [
        {
          rel: "terminate",
          href: "https://api.ep-dev.tatamotors.com/esakha/ppap/4/terminate",
        },
        {
          rel: "initiate",
          href: "https://api.ep-dev.tatamotors.com/esakha/ppap/4/requirements",
        },
        {
          rel: "self",
          href: "https://api.ep-dev.tatamotors.com/esakha/ppap/4",
        },
      ],
    },
    {
      id: 5,
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
      commodityGroup: "Central Powertrain",
      aqCommodityGroup: "CV AQ Body",
      purchaseBuyerName: "Test",
      project: {
        id: "4da2f105-e92d-4978-bf23-94655cb77dcf",
        code: "123456",
        name: "test",
        plants: [
          {
            code: "1001",
            name: "CV Pune",
            businessUnits: [{ name: "CVBU" }],
          },
        ],
        vehicleLines: ["ARIA"],
        businessUnit: "CVBU",
        projectMilestoneTimelines: [
          { projectMilestone: "ALPHA", timeline: "2021-12-02" },
          { projectMilestone: "BETA", timeline: "2021-12-22" },
          { projectMilestone: "PO", timeline: "2021-12-23" },
          { projectMilestone: "PP", timeline: "2021-12-24" },
          { projectMilestone: "SOP", timeline: "2021-12-25" },
        ],
        vehicleProjections: [
          { count: 98, year: "2021" },
          { count: 100, year: "2022" },
          { count: 100, year: "2023" },
          { count: 100, year: "2024" },
          { count: 100, year: "2025" },
        ],
        remarks: "test",
        createdBy: "tmldev",
        createdAt: 1640076117041,
      },
      state: "INITIATE",
      kamContactDetails: {},
      createdBy: { name: "tmldev" },
      createdAt: 1640087323759,
      links: [
        {
          rel: "terminate",
          href: "https://api.ep-dev.tatamotors.com/esakha/ppap/5/terminate",
        },
        {
          rel: "initiate",
          href: "https://api.ep-dev.tatamotors.com/esakha/ppap/5/requirements",
        },
        {
          rel: "self",
          href: "https://api.ep-dev.tatamotors.com/esakha/ppap/5",
        },
      ],
    },
    {
      id: 6,
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
      commodityGroup: "Central Powertrain",
      aqCommodityGroup: "CV AQ Body",
      purchaseBuyerName: "Test",
      project: {
        id: "4da2f105-e92d-4978-bf23-94655cb77dcf",
        code: "123456",
        name: "test",
        plants: [
          {
            code: "1001",
            name: "CV Pune",
            businessUnits: [{ name: "CVBU" }],
          },
        ],
        vehicleLines: ["ARIA"],
        businessUnit: "CVBU",
        projectMilestoneTimelines: [
          { projectMilestone: "ALPHA", timeline: "2021-12-02" },
          { projectMilestone: "BETA", timeline: "2021-12-22" },
          { projectMilestone: "PO", timeline: "2021-12-23" },
          { projectMilestone: "PP", timeline: "2021-12-24" },
          { projectMilestone: "SOP", timeline: "2021-12-25" },
        ],
        vehicleProjections: [
          { count: 98, year: "2021" },
          { count: 100, year: "2022" },
          { count: 100, year: "2023" },
          { count: 100, year: "2024" },
          { count: 100, year: "2025" },
        ],
        remarks: "test",
        createdBy: "tmldev",
        createdAt: 1640076117041,
      },
      state: "INITIATE",
      kamContactDetails: {},
      createdBy: { name: "tmldev" },
      createdAt: 1640087451059,
      links: [
        {
          rel: "terminate",
          href: "https://api.ep-dev.tatamotors.com/esakha/ppap/6/terminate",
        },
        {
          rel: "initiate",
          href: "https://api.ep-dev.tatamotors.com/esakha/ppap/6/requirements",
        },
        {
          rel: "self",
          href: "https://api.ep-dev.tatamotors.com/esakha/ppap/6",
        },
      ],
    },
    {
      id: 7,
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
      commodityGroup: "Central Powertrain",
      aqCommodityGroup: "CV AQ Body",
      purchaseBuyerName: "Test",
      project: {
        id: "4da2f105-e92d-4978-bf23-94655cb77dcf",
        code: "123456",
        name: "test",
        plants: [
          {
            code: "1001",
            name: "CV Pune",
            businessUnits: [{ name: "CVBU" }],
          },
        ],
        vehicleLines: ["ARIA"],
        businessUnit: "CVBU",
        projectMilestoneTimelines: [
          { projectMilestone: "ALPHA", timeline: "2021-12-02" },
          { projectMilestone: "BETA", timeline: "2021-12-22" },
          { projectMilestone: "PO", timeline: "2021-12-23" },
          { projectMilestone: "PP", timeline: "2021-12-24" },
          { projectMilestone: "SOP", timeline: "2021-12-25" },
        ],
        vehicleProjections: [
          { count: 98, year: "2021" },
          { count: 100, year: "2022" },
          { count: 100, year: "2023" },
          { count: 100, year: "2024" },
          { count: 100, year: "2025" },
        ],
        remarks: "test",
        createdBy: "tmldev",
        createdAt: 1640076117041,
      },
      state: "INITIATE",
      kamContactDetails: {},
      createdBy: { name: "tmldev" },
      createdAt: 1640152190260,
      links: [
        {
          rel: "terminate",
          href: "https://api.ep-dev.tatamotors.com/esakha/ppap/7/terminate",
        },
        {
          rel: "initiate",
          href: "https://api.ep-dev.tatamotors.com/esakha/ppap/7/requirements",
        },
        {
          rel: "self",
          href: "https://api.ep-dev.tatamotors.com/esakha/ppap/7",
        },
      ],
    },
    {
      id: 8,
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
      commodityGroup: "Central Powertrain",
      aqCommodityGroup: "CV AQ Body",
      purchaseBuyerName: "Test",
      project: {
        id: "4da2f105-e92d-4978-bf23-94655cb77dcf",
        code: "123456",
        name: "test",
        plants: [
          {
            code: "1001",
            name: "CV Pune",
            businessUnits: [{ name: "CVBU" }],
          },
        ],
        vehicleLines: ["ARIA"],
        businessUnit: "CVBU",
        projectMilestoneTimelines: [
          { projectMilestone: "ALPHA", timeline: "2021-12-02" },
          { projectMilestone: "BETA", timeline: "2021-12-22" },
          { projectMilestone: "PO", timeline: "2021-12-23" },
          { projectMilestone: "PP", timeline: "2021-12-24" },
          { projectMilestone: "SOP", timeline: "2021-12-25" },
        ],
        vehicleProjections: [
          { count: 98, year: "2021" },
          { count: 100, year: "2022" },
          { count: 100, year: "2023" },
          { count: 100, year: "2024" },
          { count: 100, year: "2025" },
        ],
        remarks: "test",
        createdBy: "tmldev",
        createdAt: 1640076117041,
      },
      state: "INITIATE",
      kamContactDetails: {},
      createdBy: { name: "tmldev" },
      createdAt: 1640152201236,
      links: [
        {
          rel: "terminate",
          href: "https://api.ep-dev.tatamotors.com/esakha/ppap/8/terminate",
        },
        {
          rel: "initiate",
          href: "https://api.ep-dev.tatamotors.com/esakha/ppap/8/requirements",
        },
        {
          rel: "self",
          href: "https://api.ep-dev.tatamotors.com/esakha/ppap/8",
        },
      ],
    },
    {
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
          {
            code: "1001",
            name: "CV Pune",
            businessUnits: [{ name: "CVBU" }],
          },
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
      links: [
        {
          rel: "self",
          href: "https://api.ep-dev.tatamotors.com/esakha/ppap/25",
        },
      ],
    },
    {
      id: 10,
      purchaseOrder: { number: "3540048261", createdAt: 1616351400 },
      supplier: {
        id: "71dabd74-3605-4267-9a23-cc1a6d708d23",
        code: "D50080",
        groupCode: "D50080",
        name: "DORABJI AUTO",
        address: {
          value: "D19 & 20 FIRST PHASEADITYAPUR INDUSTRIAL AREA",
          city: "JAMSHEDPUR",
          district: "ADITYAPUR",
          pincode: "832109",
        },
      },
      part: {
        revisionId: "6d3bdda5-0db8-4bdc-ace9-8b2b8c75e3ed",
        number: "508731200105",
        description: "CROSS MEMBER ASSY,ENGINE",
        partGroup: { id: "ZZZZZZ", description: "Default for DENIS" },
        drawingNumber: "508731200105",
        revisionLevel: "NR",
        gross: { value: 0.0, unit: "KG" },
        net: { value: 0.0, unit: "KG" },
        createdAt: 1577212200,
      },
      plant: {
        code: "2001",
        name: "CV Jamshedpur",
        businessUnits: [{ name: "CVBU" }],
      },
      commodityGroup: "Central Powertrain",
      aqCommodityGroup: "CV AQ Body",
      purchaseBuyerName: "test",
      project: {
        id: "4da2f105-e92d-4978-bf23-94655cb77dcf",
        code: "123456",
        name: "test",
        plants: [
          {
            code: "1001",
            name: "CV Pune",
            businessUnits: [{ name: "CVBU" }],
          },
        ],
        vehicleLines: ["ARIA"],
        businessUnit: "CVBU",
        projectMilestoneTimelines: [
          { projectMilestone: "ALPHA", timeline: "2021-12-02" },
          { projectMilestone: "BETA", timeline: "2021-12-22" },
          { projectMilestone: "PO", timeline: "2021-12-23" },
          { projectMilestone: "PP", timeline: "2021-12-24" },
          { projectMilestone: "SOP", timeline: "2021-12-25" },
        ],
        vehicleProjections: [
          { count: 98, year: "2021" },
          { count: 100, year: "2022" },
          { count: 100, year: "2023" },
          { count: 100, year: "2024" },
          { count: 100, year: "2025" },
        ],
        remarks: "test",
        createdBy: "tmldev",
        createdAt: 1640076117041,
      },
      state: "INITIATE",
      kamContactDetails: {},
      createdBy: { name: "tmldev" },
      createdAt: 1640153894399,
      links: [
        {
          rel: "terminate",
          href: "https://api.ep-dev.tatamotors.com/esakha/ppap/10/terminate",
        },
        {
          rel: "initiate",
          href: "https://api.ep-dev.tatamotors.com/esakha/ppap/10/requirements",
        },
        {
          rel: "self",
          href: "https://api.ep-dev.tatamotors.com/esakha/ppap/10",
        },
      ],
    },
    {
      id: 11,
      purchaseOrder: { number: "3540049182", createdAt: 1628793000 },
      supplier: {
        id: "30a9dfa0-44de-4256-8e52-85ac17f9fbc7",
        code: "A13130",
        groupCode: "A13130",
        name: "AUTOPROFILES LTD UNIT 1",
        address: {
          value: "PLOT NO-C-33 C-34 &C-35PHASEIVINDUSTRIAL AREA GAMARIA",
          city: "JAMSHEDPUR",
          district: "",
          pincode: "832108",
        },
      },
      part: {
        revisionId: "8d1226ad-037d-449d-bc11-ca3906be8297",
        number: "268062610106",
        description: "TOE PANEL ASSY,LH",
        partGroup: { id: "ZZZZZZ", description: "Default for DENIS" },
        drawingNumber: "268062610106",
        revisionLevel: "NR",
        gross: { value: 0.0, unit: "KG" },
        net: { value: 0.0, unit: "KG" },
        createdAt: 1618857000,
      },
      plant: {
        code: "2001",
        name: "CV Jamshedpur",
        businessUnits: [{ name: "CVBU" }],
      },
      commodityGroup: "Central Powertrain",
      aqCommodityGroup: "CV AQ Body",
      purchaseBuyerName: "SomeName",
      project: {
        id: "4da2f105-e92d-4978-bf23-94655cb77dcf",
        code: "123456",
        name: "test",
        plants: [
          {
            code: "1001",
            name: "CV Pune",
            businessUnits: [{ name: "CVBU" }],
          },
        ],
        vehicleLines: ["ARIA"],
        businessUnit: "CVBU",
        projectMilestoneTimelines: [
          { projectMilestone: "ALPHA", timeline: "2021-12-02" },
          { projectMilestone: "BETA", timeline: "2021-12-22" },
          { projectMilestone: "PO", timeline: "2021-12-23" },
          { projectMilestone: "PP", timeline: "2021-12-24" },
          { projectMilestone: "SOP", timeline: "2021-12-25" },
        ],
        vehicleProjections: [
          { count: 98, year: "2021" },
          { count: 100, year: "2022" },
          { count: 100, year: "2023" },
          { count: 100, year: "2024" },
          { count: 100, year: "2025" },
        ],
        remarks: "test",
        createdBy: "tmldev",
        createdAt: 1640076117041,
      },
      state: "INITIATE",
      kamContactDetails: {},
      createdBy: { name: "tmldev" },
      createdAt: 1640156327209,
      links: [
        {
          rel: "terminate",
          href: "https://api.ep-dev.tatamotors.com/esakha/ppap/11/terminate",
        },
        {
          rel: "initiate",
          href: "https://api.ep-dev.tatamotors.com/esakha/ppap/11/requirements",
        },
        {
          rel: "self",
          href: "https://api.ep-dev.tatamotors.com/esakha/ppap/11",
        },
      ],
    },
    {
      id: 12,
      purchaseOrder: { number: "3540049182", createdAt: 1628793000 },
      supplier: {
        id: "30a9dfa0-44de-4256-8e52-85ac17f9fbc7",
        code: "A13130",
        groupCode: "A13130",
        name: "AUTOPROFILES LTD UNIT 1",
        address: {
          value: "PLOT NO-C-33 C-34 &C-35PHASEIVINDUSTRIAL AREA GAMARIA",
          city: "JAMSHEDPUR",
          district: "",
          pincode: "832108",
        },
      },
      part: {
        revisionId: "8d1226ad-037d-449d-bc11-ca3906be8297",
        number: "268062610106",
        description: "TOE PANEL ASSY,LH",
        partGroup: { id: "ZZZZZZ", description: "Default for DENIS" },
        drawingNumber: "268062610106",
        revisionLevel: "NR",
        gross: { value: 0.0, unit: "KG" },
        net: { value: 0.0, unit: "KG" },
        createdAt: 1618857000,
      },
      plant: {
        code: "2001",
        name: "CV Jamshedpur",
        businessUnits: [{ name: "CVBU" }],
      },
      commodityGroup: "Central Powertrain",
      aqCommodityGroup: "CV AQ Body",
      purchaseBuyerName: "Test",
      project: {
        id: "4da2f105-e92d-4978-bf23-94655cb77dcf",
        code: "123456",
        name: "test",
        plants: [
          {
            code: "1001",
            name: "CV Pune",
            businessUnits: [{ name: "CVBU" }],
          },
        ],
        vehicleLines: ["ARIA"],
        businessUnit: "CVBU",
        projectMilestoneTimelines: [
          { projectMilestone: "ALPHA", timeline: "2021-12-02" },
          { projectMilestone: "BETA", timeline: "2021-12-22" },
          { projectMilestone: "PO", timeline: "2021-12-23" },
          { projectMilestone: "PP", timeline: "2021-12-24" },
          { projectMilestone: "SOP", timeline: "2021-12-25" },
        ],
        vehicleProjections: [
          { count: 98, year: "2021" },
          { count: 100, year: "2022" },
          { count: 100, year: "2023" },
          { count: 100, year: "2024" },
          { count: 100, year: "2025" },
        ],
        remarks: "test",
        createdBy: "tmldev",
        createdAt: 1640076117041,
      },
      state: "INITIATE",
      kamContactDetails: {},
      createdBy: { name: "tmldev" },
      createdAt: 1640167783203,
      links: [
        {
          rel: "terminate",
          href: "https://api.ep-dev.tatamotors.com/esakha/ppap/12/terminate",
        },
        {
          rel: "initiate",
          href: "https://api.ep-dev.tatamotors.com/esakha/ppap/12/requirements",
        },
        {
          rel: "self",
          href: "https://api.ep-dev.tatamotors.com/esakha/ppap/12",
        },
      ],
    },
  ],
  last: true,
  totalElements: 10,
};

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
  console.log('testId ', testId)
  console.log('dateValue ', dateValue)
  const datePicker = getByTestId(testId);
  const datePickerInput = await within(datePicker).findByRole('textbox');
  fireEvent.click(datePickerInput);

  const dateButton = await findAllByText(dateValue); // click on random date

  fireEvent.click(dateButton[dateButton.length - 1]);
};

const checkInputWithTestId = async (
  testId,
  getByTestId,
) => {
  const checkbox = getByTestId(testId);
  const checkboxInput = await within(checkbox).findByRole('checkbox');
  fireEvent.click(checkboxInput);
};

jest.mock('react-virtualized', () => {
  const ReactVirtualized = jest.requireActual('react-virtualized');
  return {
    ...ReactVirtualized,
    AutoSizer: ({ children }) => children({ height: 1000, width: 1000 }),
  };
});

beforeEach(() => {
  API.get.mockReset();
  API.post.mockReset();

  Date.now = jest.fn(() => new Date('2021-01-01T00:00:00.000Z'));

  API.get.mockImplementation(url => {
    if (url.endsWith(API_RESOURCE_URLS.TASKS)) {
      return Promise.resolve({ data: testTodoList });
    }
    if (url.endsWith(API_RESOURCE_URLS.PPAP)) {
      return Promise.resolve({ data: testOverviewList });
    }
  })
});

it("should render process list", async () => {
  const { findByText, getByLabelText } = render(<Process />);
  waitFor(async () => {
    expect(await findByText("To Do List")).toBeInTheDocument();
    expect(getByLabelText("To Do List-count").textContent).toEqual("7");

    expect(await findByText("Overview")).toBeInTheDocument();
    expect(getByLabelText("Overview-count").textContent).toEqual("10");
  });
});

describe('test complete ppap initiation', () => {
  Date.now = jest.fn(() => new Date('2021-01-01T00:00:00.000Z'));

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
  
  const testPpapReasons = [
    { id: 1, reason: "Change in Part Processing" },
    { id: 2, reason: "Change to Optional Construction or Material" },
    { id: 3, reason: "Correction of Discrepancy" },
    { id: 4, reason: "Engineering Change(s)" },
    { id: 5, reason: "Initial Submission" },
    { id: 6, reason: "Re-PPAP" },
    { id: 7, reason: "Sub Supplier or Material Source Change" },
    { id: 8, reason: "Tooling Inactive > than 1 year" },
    {
      id: 9,
      reason: "Tooling: Transfer, Replacement,Refurbishment or Additional",
    },
  ];
  
  const testSuggestedDocuments = [
    {
      stage: { id: 1, name: "PIST" },
      documents: [
        { id: "f1f9d24e-d65f-474a-a9ab-ede3db84744a", name: "IRMR/PIST" },
        { id: "aca44946-8919-48ae-9521-7217be86d43f", name: "PFMEA" },
        { id: "d42287e8-aaf3-4181-96cf-bc45a85f895c", name: "PFD" },
        {
          id: "19dddcc5-0d8b-4d6e-a21c-b8de52debc40",
          name: "Prototype control plan",
        },
        {
          id: "156132bc-2b72-4e52-9def-9ab396e64d1a",
          name: "Part development timing chart",
        },
        {
          id: "bd1509e0-4c7b-4663-a91f-d66dac2932e5",
          name: "Tooling & equipment review",
        },
        { id: "89ddf0bb-3298-4530-83bc-9cfeab9673c5", name: "FTG Plan" },
      ],
    },
    {
      stage: { id: 2, name: "PIPC" },
      documents: [
        {
          id: "c5ce3ae2-6576-4393-b14a-8b61dd989b0b",
          name: "Measurement System Analysis (MSA)",
        },
        {
          id: "49b122bd-71cc-4045-8666-fa9bd0cf88d9",
          name: "Capability study(PIPC)",
        },
        {
          id: "0aaca0bc-3234-40ee-8ff0-c0dd2ccb9ed2",
          name: "Open Issue tracking list",
        },
        {
          id: "eab83228-2950-4db5-bf2b-3e0b766a4832",
          name: "Production run (IR & set up approval)",
        },
        { id: "f9f188d2-7a0c-40d5-b322-33e40d38fd7e", name: "DVP&R" },
        {
          id: "a289d10a-c8aa-4f97-8e63-6903dbf30128",
          name: "Pre-launch control plan",
        },
        { id: "aca44946-8919-48ae-9521-7217be86d43f", name: "PFMEA" },
        { id: "d42287e8-aaf3-4181-96cf-bc45a85f895c", name: "PFD" },
        { id: "92ca3fd4-84b6-4334-a343-592ad690ff82", name: "EPC results" },
        { id: "c91aee99-07d5-4df3-aa90-db39b4a24cc9", name: "CTQ cascade" },
        { id: "87287c1d-6b69-48fd-9b2d-057ddf8dd48a", name: "Logistics sheet" },
      ],
    },
    {
      stage: { id: 3, name: "R@R" },
      documents: [
        { id: "0950471e-6e2d-4ce1-a0b8-327bc91c1d79", name: "Run@rate" },
        { id: "e89f0ec3-fe46-4edb-b4f2-ead9d91437d6", name: "Capacity signoff" },
        {
          id: "7c190320-1d70-41e4-b418-f27a4ff310e8",
          name: "Production control",
        },
      ],
    },
    {
      stage: { id: 4, name: "PSW" },
      documents: [
        { id: "8360fecd-511e-400d-832e-2b4810fecc54", name: "PSW Signoff" },
      ],
    },
  ];
  
  const selections = [
    ['part-category', testPartCategories[0].name],
    ['system-ppap-level', testPartCategories[0].ppapSubmissionLevels[0].level],
    ['overwrite-ppap-level', testPpapSubmissionLevels[3].level],
    ['ppap-reason', testPpapReasons[0].reason],
    ['r-and-r-waiver', 'No']
  ];
  
  const testDates = [ '14', '16', '18', '20' ];
  
  const processedSuggestedDocuments = testSuggestedDocuments.map((item, index) => ({
    stageId: item.stage.id,
    targetDate: moment().format(`yyyy-MM-${testDates[index]}`),
    documentIds: item.documents.map(({ id }) => id)
  }));

  const testPpapId = 38

  const testPpap = {
    id: 38,
    purchaseOrder: { number: "3540043585", createdAt: 1604082600 },
    supplier: {
      id: "81a00998-3b36-4bd6-b064-c1606b60eda4",
      code: "A06127",
      groupCode: "",
      name: "APOLLO TYRES LTD",
      address: {
        value: "IRCL,OPP BIG BAZAR  NATIONALHIGHWAY MANGO",
        city: "JAMSHEDPUR",
        district: "",
        pincode: "831018",
      },
    },
    part: {
      revisionId: "6cb8eacc-47a8-4722-a474-ff722f144fb1",
      number: "502240106305",
      description: "TYRE,RIB TYPE",
      partGroup: { id: "NS2172", description: "Tyres" },
      drawingNumber: "502240100110",
      revisionLevel: "B",
      gross: { value: 0.0, unit: "KG" },
      net: { value: 0.0, unit: "KG" },
      createdAt: 1329157800,
    },
    plant: {
      code: "2001",
      name: "CV Jamshedpur",
      businessUnits: [{ name: "CVBU" }],
    },
    commodityGroup: "Central High Value Purchase",
    aqCommodityGroup: "CV AQ Electrical & Electronics",
    purchaseBuyerName: "chanchal Purchase buyer ",
    project: {
      id: "ab1c0675-b24d-4e5f-9466-b90d3ccdc0bb",
      code: "HEXA",
      name: "HX2022",
      plants: [
        { code: "1001", name: "CV Pune", businessUnits: [{ name: "CVBU" }] },
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
    kamContactDetails: { id: "dbf7afa3-ddf5-40b0-bb54-91aaafb10c43" },
    createdBy: { name: "pune-sq-engineer" },
    createdAt: 1641635465890,
    _links: {
      terminate: {
        href: "https://api.ep-dev.tatamotors.com/esakha/ppap/38/terminate",
      },
      initiate: {
        href: "https://api.ep-dev.tatamotors.com/esakha/ppap/38/requirements",
      },
      self: { href: "https://api.ep-dev.tatamotors.com/esakha/ppap/38" },
    },
    requirement: {
      status: "PENDING_SUBMISSION"
    }
  };

  beforeEach(() => {
    API.get.mockReset();
    API.post.mockReset();
    
    API.get.mockImplementation(url => {
      if (url.endsWith(`/esakha/ppap/${testPpapId}`)) {
        return Promise.resolve({ data: testPpap });
      }
      if (url.endsWith(API_RESOURCE_URLS.TASKS)) {
        return Promise.resolve({ data: testTodoList });
      }
      if (url.endsWith(API_RESOURCE_URLS.PPAP)) {
        return Promise.resolve({ data: testOverviewList });
      }
      if (url.endsWith(API_RESOURCE_URLS.PART_CATEGORIES)) {
        return Promise.resolve({ data: testPartCategories });
      }
      if (url.endsWith(API_RESOURCE_URLS.PPAP_SUBMISSIONLEVELS)) {
        return Promise.resolve({ data: testPpapSubmissionLevels });
      }
      if (url.endsWith(API_RESOURCE_URLS.PPAP_REASONS)) {
        return Promise.resolve({ data: testPpapReasons });
      }
      if (url.endsWith(API_RESOURCE_URLS.SUGGESTED_DOCUMENTS)) {
        return Promise.resolve({ data: testSuggestedDocuments });
      }
    });
  });
  
  it('should be able to select values for fields and submit', async () => {
    const { getByText, findByTestId, getByTestId, findAllByText } = render(
      <Process />
    );
    
    fireEvent.click(getByText('To Do List'));

    fireEvent.click(await findByTestId(`list-item-${testPpapId}`));

    waitFor(async () => {
      
      fireEvent.click(getByText('Documentation'));

      for (const selection of selections) {
        const [selectName, option] = selection;
        await clickOptionForReactSelect({
          selectName,
          option,
        });
      }

      for (const [index, _] of testSuggestedDocuments.entries()) {
        await pickADateForDatePickerWithTestId(
          `date-picker-div-${ index + 1 }`,
          getByTestId,
          findAllByText,
          testDates[index]
        );
      }

      const initiateButton = getByText('Initiate');
      fireEvent.click(initiateButton);

      await waitFor(() => {
        const { _links: links } = testPpap;

        expect(API.post).toHaveBeenCalledWith(links.initiate.href, {
          partCategoryName: testPartCategories[0].name,
          submissionLevel: testPartCategories[0].ppapSubmissionLevels[0].level,
          submissionLevelOverride: testPpapSubmissionLevels[3].level,
          reasonId: testPpapReasons[0].id,
          stageRequirements: processedSuggestedDocuments,
          rAndRWaiver: false,
          remarks: '',
          editStatus: EDIT_STATUS.COMPLETE
        })
      });
    });
  });

  it.each(selections.slice(1, selections.length).map(selection => selection[0]))(
    'should not submit if %s is not selected',
    async selectionToExclude => {
      const { getByText, findByTestId, getByTestId, findAllByText } = render(
        <Process />
      );

      const limitedSelections = selections.filter(
        selection => selectionToExclude === 'part-category'
          ? (
              selection[0] !== 'part-category' &&
              selection[0] !==  'system-ppap-level' &&
              selection[0] !== 'r-and-r-waiver'
            )
          : selection[0] !== selectionToExclude,
      );
      
      fireEvent.click(getByText('To Do List'));
  
      fireEvent.click(await findByTestId(`list-item-${testPpapId}`));

      waitFor(async () => {
  
        fireEvent.click(getByText('Documentation'));
    
        for (const selection of limitedSelections) {
          const [selectName, option] = selection;
          await clickOptionForReactSelect({
            selectName,
            option,
          });
        }
    
        for (const [index, _] of testSuggestedDocuments.entries()) {
          await pickADateForDatePickerWithTestId(
            `date-picker-div-${ index + 1 }`,
            getByTestId,
            findAllByText,
            testDates[index]
          );
        }
    
        const initiateButton = getByText('Initiate');
        fireEvent.click(initiateButton);

        await waitFor(() => expect(API.post).not.toHaveBeenCalledWith());
      });
    },
  );

  it('should not submit if targetDate of suggestedDocuments are not filled', async () => {
    const { getByText, findByTestId} = render(
      <Process />
    );
    
    fireEvent.click(getByText('To Do List'));

    fireEvent.click(getByText('Documentation'));

    fireEvent.click(await findByTestId(`list-item-${testPpapId}`));


    waitFor(async () => {

      for (const selection of selections) {
        const [selectName, option] = selection;
        await clickOptionForReactSelect({
          selectName,
          option,
        });
      }

      const initiateButton = getByText('Initiate');
      fireEvent.click(initiateButton);

      await waitFor(() => expect(API.post).not.toHaveBeenCalledWith());
    });
  });

  it('should hide initiate button if ppap is already initiated', async () => {
    delete testPpap._links.initiate;

    const { getByText, findByTestId, queryByText } = render(
      <Process />
    );
    
    fireEvent.click(getByText('To Do List'));

    fireEvent.click(await findByTestId(`list-item-${testPpapId}`));

    waitFor(async () => {

      fireEvent.click(getByText('Documentation'));

      expect(queryByText('Initiate')).toBeFalsy();
    })
  });
});

describe('test save as draft while ppap initiation', () => {
  Date.now = jest.fn(() => new Date('2021-01-01T00:00:00.000Z'));

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
  
  const testPpapReasons = [
    { id: 1, reason: "Change in Part Processing" },
    { id: 2, reason: "Change to Optional Construction or Material" },
    { id: 3, reason: "Correction of Discrepancy" },
    { id: 4, reason: "Engineering Change(s)" },
    { id: 5, reason: "Initial Submission" },
    { id: 6, reason: "Re-PPAP" },
    { id: 7, reason: "Sub Supplier or Material Source Change" },
    { id: 8, reason: "Tooling Inactive > than 1 year" },
    {
      id: 9,
      reason: "Tooling: Transfer, Replacement,Refurbishment or Additional",
    },
  ];
  
  const testSuggestedDocuments = [
    {
      stage: { id: 1, name: "PIST" },
      documents: [
        { id: "f1f9d24e-d65f-474a-a9ab-ede3db84744a", name: "IRMR/PIST" },
        { id: "aca44946-8919-48ae-9521-7217be86d43f", name: "PFMEA" },
        { id: "d42287e8-aaf3-4181-96cf-bc45a85f895c", name: "PFD" },
        {
          id: "19dddcc5-0d8b-4d6e-a21c-b8de52debc40",
          name: "Prototype control plan",
        },
        {
          id: "156132bc-2b72-4e52-9def-9ab396e64d1a",
          name: "Part development timing chart",
        },
        {
          id: "bd1509e0-4c7b-4663-a91f-d66dac2932e5",
          name: "Tooling & equipment review",
        },
        { id: "89ddf0bb-3298-4530-83bc-9cfeab9673c5", name: "FTG Plan" },
      ],
    },
    {
      stage: { id: 2, name: "PIPC" },
      documents: [
        {
          id: "c5ce3ae2-6576-4393-b14a-8b61dd989b0b",
          name: "Measurement System Analysis (MSA)",
        },
        {
          id: "49b122bd-71cc-4045-8666-fa9bd0cf88d9",
          name: "Capability study(PIPC)",
        },
        {
          id: "0aaca0bc-3234-40ee-8ff0-c0dd2ccb9ed2",
          name: "Open Issue tracking list",
        },
        {
          id: "eab83228-2950-4db5-bf2b-3e0b766a4832",
          name: "Production run (IR & set up approval)",
        },
        { id: "f9f188d2-7a0c-40d5-b322-33e40d38fd7e", name: "DVP&R" },
        {
          id: "a289d10a-c8aa-4f97-8e63-6903dbf30128",
          name: "Pre-launch control plan",
        },
        { id: "aca44946-8919-48ae-9521-7217be86d43f", name: "PFMEA" },
        { id: "d42287e8-aaf3-4181-96cf-bc45a85f895c", name: "PFD" },
        { id: "92ca3fd4-84b6-4334-a343-592ad690ff82", name: "EPC results" },
        { id: "c91aee99-07d5-4df3-aa90-db39b4a24cc9", name: "CTQ cascade" },
        { id: "87287c1d-6b69-48fd-9b2d-057ddf8dd48a", name: "Logistics sheet" },
      ],
    },
    {
      stage: { id: 3, name: "R@R" },
      documents: [
        { id: "0950471e-6e2d-4ce1-a0b8-327bc91c1d79", name: "Run@rate" },
        { id: "e89f0ec3-fe46-4edb-b4f2-ead9d91437d6", name: "Capacity signoff" },
        {
          id: "7c190320-1d70-41e4-b418-f27a4ff310e8",
          name: "Production control",
        },
      ],
    },
    {
      stage: { id: 4, name: "PSW" },
      documents: [
        { id: "8360fecd-511e-400d-832e-2b4810fecc54", name: "PSW Signoff" },
      ],
    },
  ];

  const firstTwoSuggestedDocuments = testSuggestedDocuments.filter(({ stage }) => 
    stage.name === 'PIPC' || stage.name === 'PIST'
  );

  const firstSuggestedDocuments = testSuggestedDocuments.filter(({ stage }) => stage.name === 'PIST');
  
  const selections = [
    ['part-category', testPartCategories[0].name],
    ['system-ppap-level', testPartCategories[0].ppapSubmissionLevels[0].level],
    ['ppap-reason', testPpapReasons[0].reason],
  ];
  
  const testDates = [ '14', '16', '18', '20' ];
  
  const firstTwoProcessedSuggestedDocuments = firstTwoSuggestedDocuments.map((item, index) => ({
    stageId: item.stage.id,
    targetDate: moment().format(`yyyy-MM-${testDates[index]}`),
    documentIds: item.documents.map(({ id }) => id)
  }));

  const firstProcessedSuggestedDocuments = firstSuggestedDocuments.map((item, index) => ({
    stageId: item.stage.id,
    targetDate: moment().format(`yyyy-MM-${testDates[index]}`),
    documentIds: item.documents.map(({ id }) => id)
  }));

  const testPpapId = 25;

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
      terminate: {
        href: "https://api.ep-dev.tatamotors.com/esakha/ppap/25/terminate",
      },
      initiate: {
        href: "https://api.ep-dev.tatamotors.com/esakha/ppap/25/requirements",
      },
      self: { href: "https://api.ep-dev.tatamotors.com/esakha/ppap/25" },
    },
    requirement: {
      status: "PENDING_SUBMISSION"
    }
  };

  const testPartialInitiatedPpapId = 38;

  const testPartialInitiatedPpap = {
    id: 38,
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
      status: "PENDING_SUBMISSION"
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
    
    API.get.mockImplementation(url => {
      if (url.endsWith(`/esakha/ppap/${testPpapId}`)) {
        return Promise.resolve({ data: testPpap });
      }
      if (url.endsWith(`/esakha/ppap/${testPartialInitiatedPpapId}`)) {
        return Promise.resolve({ data: testPartialInitiatedPpap });
      }
      if (url.endsWith(API_RESOURCE_URLS.TASKS)) {
        return Promise.resolve({ data: testTodoList });
      }
      if (url.endsWith(API_RESOURCE_URLS.PPAP)) {
        return Promise.resolve({ data: testOverviewList });
      }
      if (url.endsWith(API_RESOURCE_URLS.PART_CATEGORIES)) {
        return Promise.resolve({ data: testPartCategories });
      }
      if (url.endsWith(API_RESOURCE_URLS.PPAP_SUBMISSIONLEVELS)) {
        return Promise.resolve({ data: testPpapSubmissionLevels });
      }
      if (url.endsWith(API_RESOURCE_URLS.PPAP_REASONS)) {
        return Promise.resolve({ data: testPpapReasons });
      }
      if (url.endsWith(API_RESOURCE_URLS.SUGGESTED_DOCUMENTS)) {
        return Promise.resolve({ data: testSuggestedDocuments });
      }
    });
  });

  it('should be able to select values for fields and submit', async () => {
    const { getByText, findByTestId, getByTestId, findAllByText } = render(
      <Process />
    );
    
    fireEvent.click(getByText('To Do List'));

    fireEvent.click(await findByTestId(`list-item-${testPpapId}`));

    waitFor(async () => {

      fireEvent.click(getByText('Documentation'));

      const limitedSelections = [selections[0], selections[1]];

      for (const selection of limitedSelections) {
        const [selectName, option] = selection;
        await clickOptionForReactSelect({
          selectName,
          option,
        });
      }

      for (const [index, _] of firstTwoSuggestedDocuments.entries()) {
        await pickADateForDatePickerWithTestId(
          `date-picker-div-${ index + 1 }`,
          getByTestId,
          findAllByText,
          testDates[index]
        );
      }

      const saveAsDraftButton = getByText('Save As Draft');
      fireEvent.click(saveAsDraftButton);

      await waitFor(() => {
        const { _links: links } = testPpap;

        expect(API.post).toHaveBeenCalledWith(links.initiate.href, {
          partCategoryName: testPartCategories[0].name,
          submissionLevel: testPartCategories[0].ppapSubmissionLevels[0].level,
          stageRequirements: firstTwoProcessedSuggestedDocuments,
          remarks: '',
          editStatus: EDIT_STATUS.DRAFT
        })
      });
    })
  });

  it('should be able to select values for fields and submit for already saved ppap', async () => {
    const { getByText, findByTestId, getByTestId, findAllByText } = render(
      <Process />
    );
    
    fireEvent.click(getByText('To Do List'));

    fireEvent.click(await findByTestId(`list-item-${testPartialInitiatedPpapId}`));

    waitFor(async () => {

      fireEvent.click(getByText('Documentation'));

      const limitedSelections = [selections[2]];

      for (const selection of limitedSelections) {
        const [selectName, option] = selection;
        await clickOptionForReactSelect({
          selectName,
          option,
        });
      }

      for (const [index, _] of firstSuggestedDocuments.entries()) {
        await pickADateForDatePickerWithTestId(
          `date-picker-div-${ index + 1 }`,
          getByTestId,
          findAllByText,
          testDates[index]
        );
      }

      const saveAsDraftButton = getByText('Save As Draft');
      fireEvent.click(saveAsDraftButton);

      await waitFor(() => {
        const { requirement } = testPartialInitiatedPpap;
        const { _links: links, id, partCategory, level } = requirement;

        expect(API.put).toHaveBeenCalledWith(links.initiate.href, {
          id,
          partCategoryName: partCategory.name,
          submissionLevel: level.level,
          reasonId: testPpapReasons[0].id,
          stageRequirements: firstProcessedSuggestedDocuments,
          remarks: '',
          editStatus: EDIT_STATUS.DRAFT
        })
      });
    })
  });
});

describe('test ppap termination on initiate stage', () => {
  Date.now = jest.fn(() => new Date('2021-01-01T00:00:00.000Z'));

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
  
  const testPpapReasons = [
    { id: 1, reason: "Change in Part Processing" },
    { id: 2, reason: "Change to Optional Construction or Material" },
    { id: 3, reason: "Correction of Discrepancy" },
    { id: 4, reason: "Engineering Change(s)" },
    { id: 5, reason: "Initial Submission" },
    { id: 6, reason: "Re-PPAP" },
    { id: 7, reason: "Sub Supplier or Material Source Change" },
    { id: 8, reason: "Tooling Inactive > than 1 year" },
    {
      id: 9,
      reason: "Tooling: Transfer, Replacement,Refurbishment or Additional",
    },
  ];
  
  const testSuggestedDocuments = [
    {
      stage: { id: 1, name: "PIST" },
      documents: [
        { id: "f1f9d24e-d65f-474a-a9ab-ede3db84744a", name: "IRMR/PIST" },
        { id: "aca44946-8919-48ae-9521-7217be86d43f", name: "PFMEA" },
        { id: "d42287e8-aaf3-4181-96cf-bc45a85f895c", name: "PFD" },
        {
          id: "19dddcc5-0d8b-4d6e-a21c-b8de52debc40",
          name: "Prototype control plan",
        },
        {
          id: "156132bc-2b72-4e52-9def-9ab396e64d1a",
          name: "Part development timing chart",
        },
        {
          id: "bd1509e0-4c7b-4663-a91f-d66dac2932e5",
          name: "Tooling & equipment review",
        },
        { id: "89ddf0bb-3298-4530-83bc-9cfeab9673c5", name: "FTG Plan" },
      ],
    },
    {
      stage: { id: 2, name: "PIPC" },
      documents: [
        {
          id: "c5ce3ae2-6576-4393-b14a-8b61dd989b0b",
          name: "Measurement System Analysis (MSA)",
        },
        {
          id: "49b122bd-71cc-4045-8666-fa9bd0cf88d9",
          name: "Capability study(PIPC)",
        },
        {
          id: "0aaca0bc-3234-40ee-8ff0-c0dd2ccb9ed2",
          name: "Open Issue tracking list",
        },
        {
          id: "eab83228-2950-4db5-bf2b-3e0b766a4832",
          name: "Production run (IR & set up approval)",
        },
        { id: "f9f188d2-7a0c-40d5-b322-33e40d38fd7e", name: "DVP&R" },
        {
          id: "a289d10a-c8aa-4f97-8e63-6903dbf30128",
          name: "Pre-launch control plan",
        },
        { id: "aca44946-8919-48ae-9521-7217be86d43f", name: "PFMEA" },
        { id: "d42287e8-aaf3-4181-96cf-bc45a85f895c", name: "PFD" },
        { id: "92ca3fd4-84b6-4334-a343-592ad690ff82", name: "EPC results" },
        { id: "c91aee99-07d5-4df3-aa90-db39b4a24cc9", name: "CTQ cascade" },
        { id: "87287c1d-6b69-48fd-9b2d-057ddf8dd48a", name: "Logistics sheet" },
      ],
    },
    {
      stage: { id: 3, name: "R@R" },
      documents: [
        { id: "0950471e-6e2d-4ce1-a0b8-327bc91c1d79", name: "Run@rate" },
        { id: "e89f0ec3-fe46-4edb-b4f2-ead9d91437d6", name: "Capacity signoff" },
        {
          id: "7c190320-1d70-41e4-b418-f27a4ff310e8",
          name: "Production control",
        },
      ],
    },
    {
      stage: { id: 4, name: "PSW" },
      documents: [
        { id: "8360fecd-511e-400d-832e-2b4810fecc54", name: "PSW Signoff" },
      ],
    },
  ];

  const selections = [
    ['part-category', testPartCategories[0].name],
    ['system-ppap-level', testPartCategories[0].ppapSubmissionLevels[0].level],
  ];
  
  const testPpapId = 25;

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
      terminate: {
        href: "https://api.ep-dev.tatamotors.com/esakha/ppap/25/terminate",
      },
      initiate: {
        href: "https://api.ep-dev.tatamotors.com/esakha/ppap/25/requirements",
      },
      self: { href: "https://api.ep-dev.tatamotors.com/esakha/ppap/25" },
    },
    requirement: {
      status: "PENDING_SUBMISSION"
    }
  };

  const testPartialInitiatedPpapId = 38;

  const testPartialInitiatedPpap = {
    id: 38,
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
      status: "PENDING_SUBMISSION"
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
    
    API.get.mockImplementation(url => {
      if (url.endsWith(`/esakha/ppap/${testPpapId}`)) {
        return Promise.resolve({ data: testPpap });
      }
      if (url.endsWith(`/esakha/ppap/${testPartialInitiatedPpapId}`)) {
        return Promise.resolve({ data: testPartialInitiatedPpap });
      }
      if (url.endsWith(API_RESOURCE_URLS.TASKS)) {
        return Promise.resolve({ data: testTodoList });
      }
      if (url.endsWith(API_RESOURCE_URLS.PPAP)) {
        return Promise.resolve({ data: testOverviewList });
      }
      if (url.endsWith(API_RESOURCE_URLS.PART_CATEGORIES)) {
        return Promise.resolve({ data: testPartCategories });
      }
      if (url.endsWith(API_RESOURCE_URLS.PPAP_SUBMISSIONLEVELS)) {
        return Promise.resolve({ data: testPpapSubmissionLevels });
      }
      if (url.endsWith(API_RESOURCE_URLS.PPAP_REASONS)) {
        return Promise.resolve({ data: testPpapReasons });
      }
      if (url.endsWith(API_RESOURCE_URLS.SUGGESTED_DOCUMENTS)) {
        return Promise.resolve({ data: testSuggestedDocuments });
      }
    });
  });

  it('should be able to terminate the ppap', async () => {
    const { getByText, findByTestId, queryByText } = render(
      <Process />
    );
    
    fireEvent.click(getByText('To Do List'));

    fireEvent.click(await findByTestId(`list-item-${testPpapId}`));

    waitFor(async () => {

      fireEvent.click(getByText('Documentation'));

      for (const selection of selections) {
        const [selectName, option] = selection;
        await clickOptionForReactSelect({
          selectName,
          option,
        });
      }

      fireEvent.click(getByText('Terminate'));

      fireEvent.click(getByText('CONFIRM'));

      await waitFor(() => {
        const { _links: links } = testPpap;

        expect(API.post).toHaveBeenCalledWith(links.terminate.href)
      });

      fireEvent.click(await findByTestId(`list-item-${testPpapId}`));
      expect(queryByText('Terminate')).toBeFalsy();
    });
  });

  it('should be able to terminate ppap that is saved in draft state', async () => {
    const {
      getByText,
      findByTestId,
      findByText
    } = render(
      <Process />
    );
    
    fireEvent.click(getByText('To Do List'));

    fireEvent.click(await findByTestId(`list-item-${testPartialInitiatedPpapId}`));

    waitFor(async () => {

      fireEvent.click(getByText('Documentation'));

      fireEvent.click(await findByText('Terminate'));

      fireEvent.click(getByText('CONFIRM'));

      await waitFor(() => {
        const { _links: links } = testPartialInitiatedPpap;

        expect(API.post).toHaveBeenCalledWith(links.terminate.href)
      });
    });
  });
});

describe('test approve and revise stage', () => {
  Date.now = jest.fn(() => new Date('2021-01-01T00:00:00.000Z'));

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
  
  const testPpapReasons = [
    { id: 1, reason: "Change in Part Processing" },
    { id: 2, reason: "Change to Optional Construction or Material" },
    { id: 3, reason: "Correction of Discrepancy" },
    { id: 4, reason: "Engineering Change(s)" },
    { id: 5, reason: "Initial Submission" },
    { id: 6, reason: "Re-PPAP" },
    { id: 7, reason: "Sub Supplier or Material Source Change" },
    { id: 8, reason: "Tooling Inactive > than 1 year" },
    {
      id: 9,
      reason: "Tooling: Transfer, Replacement,Refurbishment or Additional",
    },
  ];
  
  const testSuggestedDocuments = [
    {
      stage: { id: 1, name: "PIST" },
      documents: [
        { id: "f1f9d24e-d65f-474a-a9ab-ede3db84744a", name: "IRMR/PIST" },
        { id: "aca44946-8919-48ae-9521-7217be86d43f", name: "PFMEA" },
        { id: "d42287e8-aaf3-4181-96cf-bc45a85f895c", name: "PFD" },
        {
          id: "19dddcc5-0d8b-4d6e-a21c-b8de52debc40",
          name: "Prototype control plan",
        },
        {
          id: "156132bc-2b72-4e52-9def-9ab396e64d1a",
          name: "Part development timing chart",
        },
        {
          id: "bd1509e0-4c7b-4663-a91f-d66dac2932e5",
          name: "Tooling & equipment review",
        },
        { id: "89ddf0bb-3298-4530-83bc-9cfeab9673c5", name: "FTG Plan" },
      ],
    },
    {
      stage: { id: 2, name: "PIPC" },
      documents: [
        {
          id: "c5ce3ae2-6576-4393-b14a-8b61dd989b0b",
          name: "Measurement System Analysis (MSA)",
        },
        {
          id: "49b122bd-71cc-4045-8666-fa9bd0cf88d9",
          name: "Capability study(PIPC)",
        },
        {
          id: "0aaca0bc-3234-40ee-8ff0-c0dd2ccb9ed2",
          name: "Open Issue tracking list",
        },
        {
          id: "eab83228-2950-4db5-bf2b-3e0b766a4832",
          name: "Production run (IR & set up approval)",
        },
        { id: "f9f188d2-7a0c-40d5-b322-33e40d38fd7e", name: "DVP&R" },
        {
          id: "a289d10a-c8aa-4f97-8e63-6903dbf30128",
          name: "Pre-launch control plan",
        },
        { id: "aca44946-8919-48ae-9521-7217be86d43f", name: "PFMEA" },
        { id: "d42287e8-aaf3-4181-96cf-bc45a85f895c", name: "PFD" },
        { id: "92ca3fd4-84b6-4334-a343-592ad690ff82", name: "EPC results" },
        { id: "c91aee99-07d5-4df3-aa90-db39b4a24cc9", name: "CTQ cascade" },
        { id: "87287c1d-6b69-48fd-9b2d-057ddf8dd48a", name: "Logistics sheet" },
      ],
    },
    {
      stage: { id: 3, name: "R@R" },
      documents: [
        { id: "0950471e-6e2d-4ce1-a0b8-327bc91c1d79", name: "Run@rate" },
        { id: "e89f0ec3-fe46-4edb-b4f2-ead9d91437d6", name: "Capacity signoff" },
        {
          id: "7c190320-1d70-41e4-b418-f27a4ff310e8",
          name: "Production control",
        },
      ],
    },
    {
      stage: { id: 4, name: "PSW" },
      documents: [
        { id: "8360fecd-511e-400d-832e-2b4810fecc54", name: "PSW Signoff" },
      ],
    },
  ];

  const firstTwoSuggestedDocuments = testSuggestedDocuments.filter(({ stage }) => 
    stage.name === 'PIPC' || stage.name === 'PIST'
  );

  const firstSuggestedDocuments = testSuggestedDocuments.filter(({ stage }) => stage.name === 'PIST');
  
  const selections = [
    ['part-category', testPartCategories[0].name],
    ['system-ppap-level', testPartCategories[0].ppapSubmissionLevels[0].level],
    ['ppap-reason', testPpapReasons[0].reason],
  ];
  
  const testDates = [ '14', '16', '18', '20' ];

  const processedSuggestedDocuments = testSuggestedDocuments.map((item, index) => ({
    stageId: item.stage.id,
    targetDate: moment().format(`yyyy-MM-${testDates[index]}`),
    documentIds: item.documents.map(({ id }) => id)
  }));
  
  const firstTwoProcessedSuggestedDocuments = firstTwoSuggestedDocuments.map((item, index) => ({
    stageId: item.stage.id,
    targetDate: moment().format(`yyyy-MM-${testDates[index]}`),
    documentIds: item.documents.map(({ id }) => id)
  }));

  const firstProcessedSuggestedDocuments = firstSuggestedDocuments.map((item, index) => ({
    stageId: item.stage.id,
    targetDate: moment().format(`yyyy-MM-${testDates[index]}`),
    documentIds: item.documents.map(({ id }) => id)
  }));

  const testPpapId = 25;

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
      terminate: {
        href: "https://api.ep-dev.tatamotors.com/esakha/ppap/25/terminate",
      },
      initiate: {
        href: "https://api.ep-dev.tatamotors.com/esakha/ppap/25/requirements",
      },
      self: { href: "https://api.ep-dev.tatamotors.com/esakha/ppap/25" },
    },
    requirement: {
      status: "PENDING_SUBMISSION"
    }
  };

  const testPartialInitiatedPpapId = 38;

  const testPartialInitiatedPpap = {
    id: 38,
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
      status: "PENDING_SUBMISSION"
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
    
    API.get.mockImplementation(url => {
      if (url.endsWith(`/esakha/ppap/${testPpapId}`)) {
        return Promise.resolve({ data: testPpap });
      }
      if (url.endsWith(`/esakha/ppap/${testPartialInitiatedPpapId}`)) {
        return Promise.resolve({ data: testPartialInitiatedPpap });
      }
      if (url.endsWith(API_RESOURCE_URLS.TASKS)) {
        return Promise.resolve({ data: testTodoList });
      }
      if (url.endsWith(API_RESOURCE_URLS.PPAP)) {
        return Promise.resolve({ data: testOverviewList });
      }
      if (url.endsWith(API_RESOURCE_URLS.PART_CATEGORIES)) {
        return Promise.resolve({ data: testPartCategories });
      }
      if (url.endsWith(API_RESOURCE_URLS.PPAP_SUBMISSIONLEVELS)) {
        return Promise.resolve({ data: testPpapSubmissionLevels });
      }
      if (url.endsWith(API_RESOURCE_URLS.PPAP_REASONS)) {
        return Promise.resolve({ data: testPpapReasons });
      }
      if (url.endsWith(API_RESOURCE_URLS.SUGGESTED_DOCUMENTS)) {
        return Promise.resolve({ data: testSuggestedDocuments });
      }
    });
  });

  it('should approve the stage', async () => {
    const { getByText, findByTestId, getByTestId, findAllByText } = render(
      <Process />
    );

    waitFor(async () => {

      const approveButton = getByText('APPROVE');
      fireEvent.click(approveButton);

      await waitFor(() => {
        const { _links: links } = testPpap;

        expect(API.post).toHaveBeenCalledWith(links.APPROVE.href, {
          remark: '',
        })
      });
    });
  });

  it('should revise the stage', async () => {
    const { getByText, findByTestId, getByTestId, findAllByText } = render(
      <Process />
    );

    waitFor(async () => {

    const reviseButton = getByText('REVISE');
    fireEvent.click(reviseButton);

      await waitFor(() => {
        const { _links: links } = testPpap;

        expect(API.post).toHaveBeenCalledWith(links.REVISION.href, {
          remark: '',
        })
      });
    })
  });
});


// it('should button not enabled untill details filled', async () => {
//   render(
//     <Process/>
//   );
//   const button = await getByText("NEW PROCESS")
//   fireEvent.click(button);

// })
