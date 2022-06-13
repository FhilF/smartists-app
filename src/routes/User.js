import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import FAQs from "pages/FAQs";
import globalRoutes from "routes/GlobalRoutes";

function UserRoutes(props) {
  const { authenticate, setIsNewSignIn } = props;
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<LandingPage setIsNewSignIn={setIsNewSignIn} />}
        />
        {globalRoutes.map(component => component)}
      </Routes>
    </>
  );
}

export default UserRoutes;
