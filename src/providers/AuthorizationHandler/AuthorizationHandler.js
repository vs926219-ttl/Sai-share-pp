/* eslint-disable camelcase */
/* eslint-disable no-use-before-define */
/* eslint-disable import/no-named-as-default-member */
import React, { createContext, useState, useContext, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import moment from 'moment';
import { getUserProfile, buildErrorMessage } from '../../apis/calls';
import { usePopupManager } from '../PopupManager/PopupManager';
import { API_RESOURCE_URLS, USER_OPERATIONS, USER_STATUS } from '../../constants';
import { API } from '../../apis/api';
import { logoutAndClearData, getISTTime } from '../../utils/utils';


const initializeScript = src =>
  new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onError = e => reject(e);
    document.body.appendChild(script);
  });

export const AuthorizationContext = createContext(null);

const AuthorizationHandler = props => {
  const { showInternalError } = usePopupManager();
  const SSO_SESSION_CHECK_INTERVAL_MS = 60000;
  const [user, setUser] = useState({ isLoaded: false });
  const [keycloak, setKeycloak] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authPolicies, setAuthPolicies] = useState([]);
  const [authResources, setAuthResources] = useState({});
  const [authToken, setAuthToken] = useState(null);
  const [remainingTime, setRemainingTime]=useState(null)
  const [refresh, setRefresh]=useState(false)
  const [recentAPICalls, setRecentAPICalls] = useState([]);

  const checkSSOSessionStatePeriodically = () => {
    if(localStorage.getItem('stopApiCalls') === 'false'){
    keycloak
      .loadUserInfo()
      .then(() => setTimeout(
          checkSSOSessionStatePeriodically,
          SSO_SESSION_CHECK_INTERVAL_MS,
        ))
      .catch(error => {
        const {
          // eslint-disable-next-line no-unused-vars
          sub: userID,
          exp,
          iat,
          auth_time: authTime,
        } = keycloak.tokenParsed;
        console.error(
          `failed user check, error:${ 
            buildErrorMessage(error) 
            }; exp:${getISTTime(exp)} iat:${getISTTime(iat)} ` +
            `auth:${getISTTime(authTime)}`,
        );
        refreshTokenAndContinueUserSessionCheckElseLogout();
      });
    }
  };

  const refreshTokenAndContinueUserSessionCheckElseLogout = () =>{
    refreshToken()
      .then(() => { checkSSOSessionStatePeriodically()
      })
      .catch(error => {
        console.error({ error });
        console.error(
          `Failed to refresh the token, or the session has expired.Err:${ 
            buildErrorMessage(error) 
            } Logging user out...`,
        );
        console.error(buildErrorMessage(error));
        logoutUser();
      });
    }

  const loadAuthPolicy = async () => {
    try {
      const response = await API.get(API_RESOURCE_URLS.AUTH_BULK_RESOURCE, {
        params: {
          resourceGroup: 'esakha',
          operation: Object.values(USER_OPERATIONS), 
        },
      });
      setAuthPolicies(response.data);
    } catch (error) {
      console.error(buildErrorMessage(error));
    }
  };

  // eslint-disable-next-line consistent-return
  const loadAuthResources = async () => {
    try {
      const response = await API.get(API_RESOURCE_URLS.AUTH_ALLOWED_RESOURCE, {
        params: {
          resourceGroup: 'application-access',
          operation: 'access-application',
        },
      });
      setAuthResources(response.data);
    } catch (error) {
      console.error(buildErrorMessage(error));
    }
  };

  // eslint-disable-next-line consistent-return
  const generateUser = async token => {
    try {
      const { name, email, sub: userID, ppap_functions, vendorcode } = jwtDecode(token);
      let supplierCode = null;
      if (ppap_functions && ppap_functions.includes(USER_STATUS.SUPPLIER)){
        supplierCode = vendorcode;
      }
      const userProfile = await getUserProfile();
      return { name, email, userID, supplierCode, ...userProfile, isLoaded: true };
    } catch (err) {
      console.error(buildErrorMessage(err));
      showInternalError();
    }
  };

  const loadAuthData = async token => {
    // eslint-disable-next-line no-shadow
    const user = await generateUser(token);
    setUser(user);
    setAuthToken(token);
    loadAuthPolicy();
    loadAuthResources();
  };

  const logoutUser = () => {
    localStorage.setItem('stopApiCalls',false);
    logoutAndClearData(keycloak);
    setIsAuthenticated(false);
    setAuthToken(null);
    setUser(null);
  };

  const refreshToken = () =>
    keycloak
      .updateToken(-1) // -1 for force refresh
      .then(() => {
        setAuthToken(keycloak.token);
      });

  useEffect(() => {
    initializeScript(`${window.epAppData.AUTH_ENDPOINT}/js/keycloak.js`)
      .then(() => setKeycloak(window.Keycloak('/keycloak.json')))
      .catch(() => console.error('failed to load keycloak script'));
  }, []);

  useEffect(()=>{
    if(recentAPICalls.length>0){
      refreshToken().catch(err =>
        console.error(`failed to refresh token ${  buildErrorMessage(err)}`),
      );
    }
  },[recentAPICalls])

  useEffect(()=>{
    if(refresh){
      refreshToken().catch(err =>
        console.error(`failed to refresh token ${  buildErrorMessage(err)}`),
      );
      setRefresh(false)
    }  
  },[refresh])

  useEffect(() => {
		if (!authToken) return;
		const expirtytimeInUnixSeconds = keycloak.tokenParsed.exp;
		const currentTimeInUnixSeconds = moment().unix();
		const sixtySeconds = 60;
		const remainingTimeToRefreshInMS =
			(expirtytimeInUnixSeconds - currentTimeInUnixSeconds - sixtySeconds) *
			1000;
		setRemainingTime(remainingTimeToRefreshInMS);
	}, [authToken]);

  useEffect(() => {
    if (!keycloak) return;
    keycloak
      .init({
        onLoad: 'login-required',
        promiseType: 'native',
        pkceMethod: 'S256',
        checkLoginIframe: false,
      })
      .then(authenticated => {
        window.keycloak = keycloak;
        setIsAuthenticated(authenticated);
        if (authenticated) {
          loadAuthData(keycloak.token);
          checkSSOSessionStatePeriodically();
        }
      })
      .catch(error =>
        console.error('keycloack init error:', buildErrorMessage(error)),
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keycloak]);

  const authData = {
    user,
    isAuthenticated,
    logoutUser,
    authPolicies,
    authResources,
    authToken,
    remainingTime,
    setRefresh,
    setRecentAPICalls,
    setRemainingTime
  };

  return <AuthorizationContext.Provider value={authData} {...props} />;
};

export const useAuthorizationContext = () => useContext(AuthorizationContext);

export default AuthorizationHandler;
