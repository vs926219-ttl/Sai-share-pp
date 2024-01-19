import React, { useEffect, useState } from 'react';
import { SessionTimeoutModal } from '@tmlconnected/avant-garde-components-library';
import { INACTIVITY_EXCEPTION_URLS } from '../constants';
import { useAuthorizationContext } from '../providers/AuthorizationHandler/AuthorizationHandler';
import { API } from './api';

const ApiBasedInactivityCheck = () => {
  const {
    remainingTime,
    setRefresh,
    logoutUser,
    authToken,
    setRecentAPICalls,
    user
  } = useAuthorizationContext();

  const [showSessionTimeout, setShowSessionTimeout] = useState(false);

  const isExceptionUrl = (url, vc) => {
    if (
      Object.values(INACTIVITY_EXCEPTION_URLS).filter((exurl) =>
        typeof exurl === 'string' ? url === exurl : url === exurl(vc)
      ).length > 0
    )
      return true;
    return false;
  };
  const loadApiRequestAuthInterceptor = (instance) => {
    const vc = user?.vendorCode;
    const newAuthInterceptor = instance.interceptors.request.use((req) => {
      if (req && req.url) {
        if (isExceptionUrl(req.url, vc)) {
          let recentCalls = localStorage.getItem('recentApiUrls');
          recentCalls += ',invalid';
          localStorage.setItem('recentApiUrls', recentCalls);
        } else {
          let recentCalls = localStorage.getItem('recentApiUrls');
          recentCalls += `,${req.url}`;
          localStorage.setItem('recentApiUrls', recentCalls);
        }
      }
      return req;
    });
    return newAuthInterceptor;
  };

  const checkIfApiCalled = () => {
    const filteredUrls = localStorage
      .getItem('recentApiUrls')
      .split(',')
      .filter((url) => url !== 'initial' && url !== 'invalid');
    if (filteredUrls) {
      setRecentAPICalls(filteredUrls);
      localStorage.setItem('recentApiUrls', 'initial');
    }
  };

  useEffect(() => {
    setInterval(() => {
      checkIfApiCalled();
    }, 60000);
    localStorage.setItem('stopApiCalls', false);
    localStorage.setItem('recentApiUrls', 'initial');
  }, []);

  useEffect(() => {
    if (user && user.isLoaded) loadApiRequestAuthInterceptor(API);
  }, [user]);

  useEffect(() => {
    let timer;
    if (remainingTime) {
      timer = setTimeout(() => {
        setShowSessionTimeout(true);
        localStorage.setItem('stopApiCalls', true);
      }, remainingTime);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [remainingTime, authToken]);

  return (
    <SessionTimeoutModal
      handleClose={() => {
        setShowSessionTimeout(false);
      }}
      open={showSessionTimeout}
      setOpen={setShowSessionTimeout}
      setRefresh={() => setRefresh(true)}
      logoutUser={() => {
        logoutUser();
      }}
    />
  );
};

export default ApiBasedInactivityCheck;
