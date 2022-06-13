import React, { useEffect } from "react";
import Header from "./Header";
import SmartistsUserRoute from "routes/SmartistsUserRoutes";
import { selectUserSession } from "utils/redux/slice/userSessionSlice";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { userSession } from "utils/stacks-util/auth";
import { isMainnet } from "config";
import Footer from "layouts/Footer";

function Index(props) {
  const location = useLocation();

  const smartistsUserSession =
    useSelector(selectUserSession).smartistsUserSession.data;
  return (
    <div>
      <Header
        smartistsUserSession={smartistsUserSession}
        isMainnet={isMainnet}
      />
      <div className="h-full flex flex-col mb-36" style={{ minHeight: "110vh " }}>
        <div className="h-full flex-grow" style={{ marginTop: "60px" }}>
          <SmartistsUserRoute
            smartistsUserSession={smartistsUserSession}
            location={location}
            isMainnet={isMainnet}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Index;
