/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable consistent-return */
import React from "react";
import { render, fireEvent } from "../../../../test-utils";
import ProcessComplete from "../ProcessComplete";
import { PPAP_COMPLETE_STATE } from '../../../../constants';

const ppap = {
  id: 156,
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
  project: {
    id: "ab1c0675-b24d-4e5f-9466-b90d3ccdc0bb",
    name: "HX2022"
  },
  purchaseBuyerName: "test buyer",
  state: "COMPLETE",
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
  _links: {
    PIPC: {href: "https://api.ep-dev.tatamotors.com/ppap/ppap/156/stage/c7d3c590-d6ab-4004-aeb2-9b92e7277fb3"},
    PIST: {href: "https://api.ep-dev.tatamotors.com/ppap/ppap/156/stage/b58718a0-7d0c-4f25-857e-e0d33e29bae7"},
    PSW: {href: "https://api.ep-dev.tatamotors.com/ppap/ppap/156/stage/4b96f63a-51fb-46a9-9ce0-90034440f4dc"},
    self: {href: "https://api.ep-dev.tatamotors.com/ppap/ppap/156"},
  }
};

const {_links: links } = ppap;

it("should render ppap and all stages", async () => {
  const { getByText } = render(
    <ProcessComplete  
        ppap={ppap}
        highlightMandatoryFields={false}
        setHighlightMandatoryFields={jest.fn()}
        reloadData={jest.fn()}
    >
      {({ content }) => (
        <div>{content}</div>
      )}
    </ProcessComplete>
  );

  // const projectName = getByText(ppap?.project?.name);
  // expect(projectName).toBeInTheDocument();

  Object.keys(links).forEach(key => {
      if(PPAP_COMPLETE_STATE.indexOf(key) !== -1){
        const stage = getByText(key);
        // eslint-disable-next-line jest/no-conditional-expect
        expect(stage).toBeInTheDocument();
      }
  });
});
