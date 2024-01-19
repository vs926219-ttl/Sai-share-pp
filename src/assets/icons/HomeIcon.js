import React, { forwardRef } from "react";
import { SvgIcon } from "@material-ui/core";

const HomeIcon = forwardRef((props, ref) => (
  <SvgIcon
    border-radius="6px"
    background-color="#2b07f7"
    box-shadow=" 1px 3px 6px #0000004B"
    opacity="0.83"
    viewBox="0 0 24 28"
    ref={ref}
    {...props}
  >
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </SvgIcon>
));

export default HomeIcon;
