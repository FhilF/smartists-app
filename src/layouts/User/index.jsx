import { React, useEffect } from "react";
import Header from "./Header";
import UserRoutes from "routes/User";
import Footer from "layouts/Footer";

function Index(props) {
  const { setIsNewSignIn } = props;
  return (
    <div className="h-full w-full flex flex-col p-4 md:p-8 lg:p-0 lg:max-w-4xl xl:max-w-6xl 2xl:max-w-screen-xl mx-auto ">
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
