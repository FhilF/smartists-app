import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import ReactBlockstack from "react-blockstack";

import { appConfig, finished } from "./UserSession.js";

import { Provider } from "react-redux";

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
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
