import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import TestPage from "../pages/TestPage";
import InvitationModal from "components/InvitationModal";
// import GlobalRoutes from "./GlobalRoutes";

function UserRoutes(props) {
  const { authenticate, setIsNewSignIn } = props;
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<LandingPage setIsNewSignIn={setIsNewSignIn} />}
        />
        <Route path="/test" element={<TestPage />} />
        {/* {GlobalRoutes} */}
        {/* <Route
          exact
          path="/"
          Component
          render={(routeProps) => (
            // <LandingPage {...routeProps} authenticate={authenticate} />
            <div>sss</div>
          )}
        /> */}
        {/* <Route
          path="/:userIdentity"
          render={() => <InvitationModal authenticate={authenticate} />}
        />
        {GlobalRoutes} */}
      </Routes>
    </>
  );
}

export default UserRoutes;
