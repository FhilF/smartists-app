import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import { store } from "utils/redux/store";
import { Provider } from "react-redux";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import classNames from "classnames";
import { MdCheckCircle, MdError, MdInfo, MdClose } from "react-icons/md";

import { BrowserRouter } from "react-router-dom";

import "./styles/tailwind.css";

import "./styles/scss/global.scss";
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
      "py-4 px-4 rounded-md !mr-8 !mb-8",
      options.type === "info" && "bg-blue-400",
      options.type === "success" && "bg-green-500",
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
        <span className="pl-2 pr-8 text-sm">{message}</span>
      </div>
      <div>
        <MdClose className="snackbar-icon cursor-pointer" onClick={close} />
      </div>
    </div>
  </div>
);

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
