import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import ReactBlockstack from "react-blockstack";

import { appConfig, finished } from "./UserSession.js";

import "./styles/tailwind.css";

import "./styles/scss/global.scss";

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
import { MdCheckCircle, MdError, MdInfo, MdClose } from "react-icons/md";

const options = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_RIGHT,
  timeout: 5000,
  // you can also just use 'scale'
  transition: transitions.FADE,
  containerStyle: {
    zIndex: 2000,
  },
};

const AlertTemplate = ({ style, options, message, close }) => (
  <div
    className={classNames(
      "py-4 px-4 rounded-md",
      options.type === "info" && "bg-blue-400",
      options.type === "success" && "snackbar-success",
      options.type === "error" && "bg-red-500",
      options.type === "warning" && "warning-snackbar"
    )}
    style={style}
  >
    <div
      className="flex items-center text-gray-100 text-xl
    "
    >
      <div className="flex-grow flex items-center">
        <div>
          {options.type === "info" && <MdInfo className="snackbar-icon" />}
          {options.type === "success" && (
            <MdCheckCircle className="snackbar-icon" />
          )}
          {options.type === "error" && <MdError className="snackbar-icon" />}
        </div>
        <span className="px-2 snackbar-message">{message}</span>
      </div>
      <div>
        <MdClose className="snackbar-icon cursor-pointer" onClick={close} />
      </div>
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
