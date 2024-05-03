/* eslint-disable object-shorthand */
/* eslint-disable arrow-body-style */
/* eslint-disable import/prefer-default-export */
/* eslint-disable func-names */
import { log } from '../apis/calls';
import { LOG_LEVEL } from '../constants';

const formattedMessage = (message, ...options) =>
  [options].reduce((p, c) => p?.replace(/%s/, c), message);

const buildWarningMessage = originalMessage => {
  const traceArray = originalMessage.split('\n');
  let newMessage = traceArray[0];
  let sourceFunctionCount = 0;
  for (let i = 1; sourceFunctionCount < 3 && i < traceArray.length; ) {
    if (traceArray[i].includes('at')) {
      newMessage += `\n${traceArray[i]}`;
      sourceFunctionCount += 1;
    }
    i += 1;
  }
  return newMessage;
};

export const overrideConsole = (oldConsole, user) => {
  return {
    ...oldConsole,

    info: function (message, ...options) {
      oldConsole.info(message, ...options);
      log(formattedMessage(message, ...options), LOG_LEVEL.INFO, user);
    },
    warn: function (originalMessage) {
      oldConsole.warn(originalMessage);
      const message = buildWarningMessage(originalMessage);
      log(message, LOG_LEVEL.WARN, user);
    },
    error: function (message, ...options) {
      if (message?.indexOf('Warning') === 0) {
        // console.warn(message, ...options);
      } else {
        oldConsole.error(message, ...options);
        log(formattedMessage(message, ...options), LOG_LEVEL.ERROR, user);
      }
    },
  };
};
