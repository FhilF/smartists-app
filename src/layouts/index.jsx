import React, { useEffect } from "react";
import User from "layouts/User";
import SuperUser from "layouts/SuperUser";
import SmartistsUser from "layouts/SmartistsUser";
import "../styles/scss/layout.scss";
import ErrorPage500 from "pages/ErrorPages/500";

function Index(props) {
  const {
    isSignedIn,
    setIsNewSignIn,
    userType,
    setUserType,
    errorSmartistsUser,
  } = props;


  return (
    <div className="h-full">
      {!isSignedIn && <User setIsNewSignIn={setIsNewSignIn} />}
      {isSignedIn && (
        <div className="h-full w-full flex flex-col p-4 mb-16 md:p-8 lg:p-0 lg:max-w-4xl xl:max-w-6xl 2xl:max-w-screen-xl mx-auto ">
          <div className="w-full flex-grow">
            {userType === "SuperUser-Type" && !errorSmartistsUser && (
              <SuperUser
                setIsNewSignIn={setIsNewSignIn}
                setUserType={setUserType}
              />
            )}

            {userType === "SmartistsUser-Type" && !errorSmartistsUser && (
              <SmartistsUser
                setIsNewSignIn={setIsNewSignIn}
                setUserType={setUserType}
              />
            )}

            {(userType === "SuperUser-Type" || userType === "SmartistsUser-Type") &&
              errorSmartistsUser === "CannotAccessServer" && <ErrorPage500 />}
          </div>
        </div>
      )}
    </div>
  );
}

export default Index;
