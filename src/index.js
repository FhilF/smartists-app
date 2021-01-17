import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "./scss/index-site.scss";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import ReactBlockstack from "react-blockstack";

import { appConfig, finished } from "./UserSession.js";

import { Provider } from "react-redux";
import store from "./utils/store";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import classNames from "classnames";

import { ReactComponent as SuccessOutlinedIcon } from "./assets/svg-icon/SuccessOutlinedIcon.svg";
import { ReactComponent as ErrorOutlinedIcon } from "./assets/svg-icon/ErrorOutlineOutlinedIcon.svg";
import { ReactComponent as WarningOutlinedIcon } from "./assets/svg-icon/ReportProblemOutlinedIcon.svg";
import { ReactComponent as InfoOutlinedIcon } from "./assets/svg-icon/InfoOutlinedIcon.svg";
import { ReactComponent as CloseIcon } from "./assets/svg-icon/CloseIcon.svg";
// import AlertTemplate from "react-alert-template-basic";

const options = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_RIGHT,
  timeout: 5000,
  // you can also just use 'scale'
  transition: transitions.FADE,
  containerStyle: {
    zIndex: 2000
  }
};

const AlertTemplate = ({ style, options, message, close }) => (
  <div
    className={classNames(
      "snackbar",
      options.type === "info" && "info-snackbar",
      "snackbar",
      options.type === "success" && "success-snackbar",
      "snackbar",
      options.type === "error" && "error-snackbar",
      "snackbar",
      options.type === "warning" && "warning-snackbar"
    )}
    style={style}
  >
    <div className="snackbar-container">
      {options.type === "info" && (
        <InfoOutlinedIcon className="snackbar-icon snackbar-logo" />
      )}
      {options.type === "success" && (
        <SuccessOutlinedIcon className="snackbar-icon snackbar-logo" />
      )}
      {options.type === "error" && (
        <ErrorOutlinedIcon className="snackbar-icon snackbar-logo" />
      )}
      <span className="snackbar-message">{message}</span>
      <CloseIcon className="snackbar-icon btn snackbar-close" onClick={close} />
    </div>
  </div>
);

const blockstack = ReactBlockstack({ appConfig });
(() => {
  if (blockstack.userSession.isSignInPending()) {
    blockstack.userSession.handlePendingSignIn().then((userData) => {
      finished(() => {
        console.log("handling pending sign in on launch");
      })({ userSession: blockstack.userSession });
    });
  }
})();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AlertProvider template={AlertTemplate} {...options}>
          <App />
        </AlertProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
