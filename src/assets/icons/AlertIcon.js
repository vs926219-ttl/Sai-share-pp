import React, { forwardRef } from "react";
import { SvgIcon } from "@material-ui/core";

const AlertIcon = forwardRef((props, ref) => (
  <SvgIcon viewBox="0 0 33.423 29.154" ref={ref} {...props}>
    <path
      style={{
        fill: "none",
        stroke: "#d8d8d8",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: "2px",
      }}
      d="M14.15 2.44L1.45 23.65A3 3 0 004 28.15h25.4a3 3 0 002.57-4.5l-12.7-21.2a3 3 0 00-5.13 0z"
    />
    <g transform="translate(-1873.549 -294.423)">
      <path
        style={{
          fill: "none",
          stroke: "#d8d8d8",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "3px",
        }}
        d="M18,13.5v6"
        transform="translate(1872.26 291.077)"
      />
      <path
        style={{
          fill: "none",
          stroke: "#d8d8d8",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "3px",
        }}
        d="M18,25.5h0"
        transform="translate(1872.26 291.077)"
      />
    </g>
  </SvgIcon>
));

export default AlertIcon;
