import { useEffect, useState } from 'react';
import { PPAP_APP_RESOURCES } from '../constants';

const useAuthorizedEpApps = (isAuthenticated, authPolicies) => {
  const [authorizedEpApps, setAuthorizedEpApps] = useState([]);

  const getAuthorizedAppsFromAllowedPolicies = (allowedAppResources = []) => {
    const authorizedApps = allowedAppResources.map(
      appResource => PPAP_APP_RESOURCES[appResource] || appResource,
    );
    return authorizedApps;
  };

  useEffect(() => {
    if (isAuthenticated)
      setAuthorizedEpApps(
        getAuthorizedAppsFromAllowedPolicies(authPolicies?.allowed),
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authPolicies, isAuthenticated]);

  return authorizedEpApps;
};

export default useAuthorizedEpApps;