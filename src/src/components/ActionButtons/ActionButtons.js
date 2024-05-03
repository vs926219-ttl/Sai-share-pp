import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Button } from '@tmlconnected/avant-garde-components-library';
import styles from './ActionButtons.module.css';


function ActionButtons({ secondaryActions, primaryAction }) {
  return (
    <>
      {secondaryActions &&
        secondaryActions.length &&
        secondaryActions.map((action) => {
          if (action.showButton)
            return (
              <Button
                key={action.name}
                className={clsx(
                  styles.actionButton,
                  action.classNames && action.classNames.btn
                    ? action.classNames.btn
                    : null
                )}
                variant="primary"
                onClick={() => action.actionFn()}
              >
                {action.name}
              </Button>
            );
          return null;
        })}
      {primaryAction && primaryAction.showButton ? (
        <Button
          key={primaryAction.name}
          className={clsx(styles.actionButton, styles.primaryActionButton)}
          variant="primary"
          onClick={() => primaryAction.actionFn()}
          disabled={primaryAction.isDisable}
        >
          {primaryAction.name}
        </Button>
      ) : null}
    </>
  );
}

ActionButtons.propTypes = {
  secondaryActions: PropTypes.array,
  primaryAction: PropTypes.object,
}

export default ActionButtons;
