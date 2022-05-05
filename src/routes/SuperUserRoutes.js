import React from "react";
import { Routes, Route } from "react-router-dom";
import WelcomePage from "../pages/Welcome";
import SignUpPage from "../pages/SignUp";
// import NotFound from "../pages/NotFound";
// import Documentation from "../pages/Documentation";
// import { GlobalRoutes } from "./Global";

function SuperUserRoutes(props) {
  const { setSmartistsUser, handleSmartistsUser, setUserType } = props;
  return (
    <>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route
          path="/account-setup"
          element={<SignUpPage setUserType={setUserType} />}
        />
      </Routes>
    </>
  );
}

export default SuperUserRoutes;
