import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import ContextHandler from '@tmlconnected/avant-garde-components-library/ContextHandler/ContextHandler';
import './index.css';
import { StylesProvider } from '@material-ui/core/styles';
import { BrowserRouter as Router } from 'react-router-dom';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './redux';
import { AuthorizationHandler, PopupManager } from './providers';

ReactDOM.render(
  <React.StrictMode>
    <StylesProvider injectFirst>
      <ContextHandler>
        <Provider store={store}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <PopupManager>
              <AuthorizationHandler>
                <Router>
                  <App />
                </Router>
              </AuthorizationHandler>
            </PopupManager>
          </MuiPickersUtilsProvider>
        </Provider>
      </ContextHandler>
    </StylesProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
