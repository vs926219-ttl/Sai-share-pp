import React from 'react';
import './GridLoadingSpinner.css';

/*
 * note: this component needs to be wrapped in a container(div) to be rendered
 */
const GridLoadingSpinner = () => (
  <div className="la-ball-grid-pulse la-blue la-3x">
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
  </div>
);

export default GridLoadingSpinner;
