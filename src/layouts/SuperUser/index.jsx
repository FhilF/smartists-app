import React from "react";
import SuperUserRoute from "routes/SuperUserRoutes";
import Header from "./Header";
import { useLocation } from "react-router-dom";
import Footer from "layouts/Footer";

function Index(props) {
  const { setUserType } = props;
  const location = useLocation();
  const routesWithoutHeader = ["/account-setup"];
  return (
    <div>
      {!routesWithoutHeader.includes(location.pathname) && <Header />}
      <div className="h-full flex flex-col mb-36" style={{ minHeight: "110vh " }}>
        <div className="h-full flex-grow" style={{ marginTop: "60px" }}>
          <SuperUserRoute setUserType={setUserType} />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Index;
