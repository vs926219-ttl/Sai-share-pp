/* eslint-disable consistent-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import moment from 'moment';
import { CancelToken } from '../apis/api';

const DEFAULT_SCREEN_REFRESH_INTERVAL_TIME_MS = 60000;

const defaultOptions = {
  refreshInterval: DEFAULT_SCREEN_REFRESH_INTERVAL_TIME_MS,
  useCancelToken: false,
};

const useAjaxCallbackWithIntervals = (
  shouldBlockCall, // to delay call in cases where data is loading, or if there are active edits
  ajaxCallback,
  callBackParams, // array of parameters
  options = defaultOptions,
) => {
  const [lastRefreshedDate, setLastRefreshedDate] = useState(null);

  // effect to run the cb for the first time
  useEffect(() => {
    const { useCancelToken } = options;
    const cancelTokenSource = CancelToken?.source();

    ajaxCallback(
      ...callBackParams,
      useCancelToken && cancelTokenSource,
    ).then(() => setLastRefreshedDate(moment()));
    return () => useCancelToken && cancelTokenSource.cancel();
  }, [...callBackParams]);

  // effect to run the cb again in intervals
  useEffect(() => {
    const refreshInterval =
      options.refreshInterval || DEFAULT_SCREEN_REFRESH_INTERVAL_TIME_MS;
    const { useCancelToken } = options;
    const cancelTokenSource = CancelToken?.source();
    if(localStorage.getItem('stopApiCalls') === 'false'){
    const intervalID = setInterval(() => {
      if (!shouldBlockCall)
        ajaxCallback(
          ...callBackParams,
          useCancelToken && cancelTokenSource,
        ).then(() => setLastRefreshedDate(moment()));
    }, refreshInterval);
    return () => {
      clearInterval(intervalID);
      if (useCancelToken) cancelTokenSource.cancel();
    };
  }
  }, [...callBackParams, shouldBlockCall]);

  return lastRefreshedDate;
};

export default useAjaxCallbackWithIntervals;
