import React from 'react'
import PropTypes from 'prop-types'
import { CustomTab } from '../../../atomicComponents'

function ProcessTabs({ classNames = {}, tabs, selectedTab, handleTabChange }) {
  return (
    <>
      {
        tabs.map((tab, index) => (
          <CustomTab
            classNames={classNames}
            key={tab.label}
            isSelected={selectedTab === index}
            title={tab.title}
            withOutCount={tab.withOutCount}
            count={tab.count}
            handleClick={() => handleTabChange(index)}
          />
        ))
      }
    </>
  )
}

ProcessTabs.propTypes = {
  classNames: PropTypes.object,
  tabs: PropTypes.array,
  selectedTab: PropTypes.number,
  handleTabChange: PropTypes.func
}

export default ProcessTabs;