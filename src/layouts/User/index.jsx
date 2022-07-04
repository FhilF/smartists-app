import { React, useEffect } from "react";
import { useLocation } from 'react-router-dom'
import Header from "./Header";
import UserRoutes from "routes/User";
import Footer from "layouts/Footer";
import classNames from "classnames";

function Index(props) {
  const { setIsNewSignIn } = props;
  const location = useLocation();
  
  return (
    <div className={classNames("h-full w-full flex flex-col p-4 md:p-8 lg:p-0", location.pathname === "/" && "lg:max-w-4xl xl:max-w-6xl 2xl:max-w-screen-xl mx-auto ")}>
      <Header setIsNewSignIn={setIsNewSignIn} />
      <div className="h-full flex flex-col mb-20" style={{ minHeight: "100vh " }}>
        <div className="h-full flex-grow" style={{ marginTop: "60px" }}>
          <UserRoutes setIsNewSignIn={setIsNewSignIn} />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Index;
