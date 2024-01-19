/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable consistent-return */
import React from "react";
import { render, fireEvent } from "../../../../test-utils";
import ProcessBasicInfo from "../ProcessBasicInfo";

const ppap = {
  id: 13,
  aqCommodityGroup: "CV AQ Body",
  commodityGroup: "Central Powertrain",
  part: {
    description: "TOE PANEL ASSY,LH",
    drawingNumber: "2680626789625",
    number: "268062610106",
    revisionId: "8d1226ad-037d-449d-bc11-ca3906be8297",
    revisionLevel: "NR",
  },
  plant: {
    code: "2001",
    name: "CV Jamshedpur",
  },
  purchaseBuyerName: "test buyer",
  state: "INITIATE",
  purchaseOrder: {
    number: "3540049182",
  },
  supplier: {
    code: "A13130",
    groupCode: "A13130",
    id: "30a9dfa0-44de-4256-8e52-85ac17f9fbc7",
    name: "AUTOPROFILES LTD UNIT 1",
    address: {
      city: "JAMSHEDPUR",
      district: "",
      pincode: "832108",
      value: "PLOT NO-C-33 C-34 &C-35PHASEIVINDUSTRIAL AREA GAMARIA",
    },
  },
  requirement: {
    status: "PENDING_SUBMISSION"
  }
};
const activeClassForcurrentStage = "activeState";

it("should render values", async () => {
  const { getByText } = render(
    <ProcessBasicInfo ppap={ppap}>
      {({ content }) => (
        <div>{content}</div>
      )}
    </ProcessBasicInfo>
  );

  const poNumber = getByText(ppap?.purchaseOrder?.number);
  const partNumber = getByText(ppap?.part?.number);
  const plantName = getByText(ppap?.plant?.name);
  const purchaseBuyerName = getByText(ppap?.purchaseBuyerName);
  const currentStage = getByText("Initiate");

  expect(poNumber).toBeInTheDocument();
  expect(partNumber).toBeInTheDocument();
  expect(plantName).toBeInTheDocument();
  expect(purchaseBuyerName).toBeInTheDocument();

  expect(currentStage).toHaveClass(activeClassForcurrentStage);
});
