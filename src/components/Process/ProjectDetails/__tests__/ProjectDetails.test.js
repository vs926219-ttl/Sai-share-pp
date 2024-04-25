/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable consistent-return */

import React from "react";
import { render, fireEvent } from "../../../../test-utils";
import ProjectDetails from "../ProjectDetails";

const ppap = {
  id: 101,
  aqCommodityGroup: "Test aqCommodityGroup",
  commodityGroup: "Test commodityGroup",
  part: {
    description: "Test Part description",
    drawingNumber: "0123456",
    number: "78945612",
    revisionId: "abcd-123456789",
    revisionLevel: "NR",
  },
  plant: {
    code: "0001",
    name: "Test plant",
  },
  purchaseBuyerName: "test buyer",
  state: "INITIATE",
  purchaseOrder: {
    number: "PO-123456",
  },
  supplier: {
    code: "Test-1234",
    groupCode: "Test-1234",
    id: "abcd-1234-5678",
    name: "Test LTD UNIT 1",
    address: {
      city: "TestCity",
      district: "",
      pincode: "123456",
      value: "PLOT NO-C-33 C-34 &C-35PHASEIVINDUSTRIAL AREA GAMARIA",
    },
  },
  project: {
    businessUnit: "ABCD",
    code: "123456",
    createdAt: 1640076117041,
    createdBy: "TestUser",
    id: "xyz-1234-5678",
    name: "Test-Project",
    projectMilestoneTimelines: [
      { projectMilestone: {name: "ALPHA", displayName: "ALPHA"}, 
        timeline: "2021-12-02" 
      },
      { projectMilestone: {name: "BETA", displayName: "BETA"}, 
        timeline: "2021-12-22" 
      },
      { projectMilestone: {name: "PO", displayName: "PO"}, 
        timeline: "2021-12-23" },
      { projectMilestone: {name: "PP", displayName: "PP"}, 
        timeline: "2021-12-24" },
      { projectMilestone: {name: "SOP", displayName: "SOP"}, 
        timeline: "2021-12-25" },
    ],
    vehicleLines: ["ARIA"],
    vehicleProjections: [
      { count: 98, year: "2021" },
      { count: 100, year: "2022" },
      { count: 100, year: "2023" },
      { count: 100, year: "2024" },
      { count: 100, year: "2025" },
    ],
  },
};

it("should render project details values", async () => {
  const { getByText, getByTestId } = render(
    <ProjectDetails ppap={ppap}>
      {({ content }) => (
        <div>{content}</div>
      )}
    </ProjectDetails>
  );

  const name = getByTestId("projectName");
  const code = getByText(ppap?.project?.code);
  const businessUnit = getByText(ppap?.project?.businessUnit);
  const plantName = getByText(ppap?.plant?.name);

  expect(name).toBeInTheDocument();
  expect(code).toBeInTheDocument();
  expect(businessUnit).toBeInTheDocument();
  expect(plantName).toBeInTheDocument();
});

it("should render projectMilestone", async () => {
  const { getByText, findByText } = render(
    <ProjectDetails ppap={ppap}>
      {({ content }) => (
        <div>{content}</div>
      )}
    </ProjectDetails>
  );

  const projectMilestone = getByText(
    ppap?.project?.projectMilestoneTimelines[0].projectMilestone.name
  );
  const timeline = findByText(
    ppap?.project?.projectMilestoneTimelines[0].timeline
  );

  expect(projectMilestone).toBeInTheDocument();
});

it("should render Vehicle Projection", async () => {
  const { getByText } = render(
    <ProjectDetails ppap={ppap}>
      {({ content }) => (
        <div>{content}</div>
      )}
    </ProjectDetails>
  );

  const year = getByText(ppap?.project?.vehicleProjections[0].year);
  const count = getByText(ppap?.project?.vehicleProjections[0].count);

  expect(year).toBeInTheDocument();
  expect(count).toBeInTheDocument();
});
