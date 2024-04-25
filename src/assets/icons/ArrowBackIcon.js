import React, { forwardRef } from 'react';
import { SvgIcon } from '@material-ui/core';

const ArrowBackIcon = forwardRef((props, ref) => (
  <SvgIcon viewBox="0 0 24 24" ref={ref} {...props}>
    <path d="M20,11H7.83l5.59-5.59L12,4,4,12l8,8,1.41-1.41L7.83,13H20Z" />
  </SvgIcon>
));

export default ArrowBackIcon;
