import React, { useEffect } from 'react';
import { Switch } from 'react-router-dom';
import PrivateRoute from './routing/PrivateRoute';
import HeaderAndFooter from './layouts/HeaderAndFooter/HeaderAndFooter';
import { overrideConsole } from './utils/loggingErrors';
import { useAuthorizationContext } from './providers/AuthorizationHandler/AuthorizationHandler';
import ApiBasedInactivityCheck from './apis/ApiBasedInactivityCheck';
import { 
  LandingPage,
  CreateProcess,
  ProjectMaster,
  DocumentMaster,
  CreateProject,
  Process
} from './pages';

function App() {
  const { isAuthenticated, user } = useAuthorizationContext();

  const addLoggingHooks = () => {
    window.onerror = (message, source, lineno, colno, error) => {
      if (error.stack) {
        const sourceFunction = error.stack.split('\n')[1];
        console.error(new Error(message + sourceFunction));
      } else {
        console.error(error);
      }
    };
    const newConsole = overrideConsole(window.console, user?.userId);
    window.console = newConsole;
  };

  useEffect(() => {
    if (isAuthenticated) {
      addLoggingHooks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  return (
    <div className="App">
      <Switch>
        <HeaderAndFooter>
          <PrivateRoute exact path="/" component={LandingPage} />
          <PrivateRoute exact path="/process" component={Process} />
          <PrivateRoute exact path="/project-master" component={ProjectMaster} />
          <PrivateRoute exact path="/document-master" component={DocumentMaster} />
          <PrivateRoute exact path="/create-project" component={CreateProject} />
          <PrivateRoute exact path="/create-project/:id" component={CreateProject} />
          <PrivateRoute exact path="/project-details/:id" component={CreateProject} />
          <PrivateRoute exact path="/create-process" component={CreateProcess} />
        </HeaderAndFooter>
      </Switch>
      <ApiBasedInactivityCheck/>
    </div>
  );
}

export default App;
