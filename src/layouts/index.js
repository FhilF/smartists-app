import React, { useState, useEffect } from "react";
import SignInButtonComponent from "../components/SignInButton";
import SignOutButtonComponent from "../components/SignOutButton";
import FormPage from "../pages/Form";

import SuperUserRoutes from "../routes/SuperUser";

function Content(props) {
  const { userSession, showForm, setShowForm, smartistUser } = props;
  const authenticated = userSession && userSession.isUserSignedIn();
  const decentralizedID =
    userSession &&
    userSession.isUserSignedIn() &&
    userSession.loadUserData().decentralizedID;

  useEffect(() => {
  }, [showForm]);

  useEffect(() => {
    if (userSession) {
      if (userSession.isUserSignedIn()) {
        // userSession
        //   .listFiles(function (filename) {
        //     console.log(filename);
        //     return true; // to continue files listing
        //   })
        //   .then(function (filesCount) {
        //     console.log("Files count: " + filesCount);
        //     // console.log(files);
        //   });
      }
    }
  }, [userSession]);

  return (
    <div>
      {!authenticated && (
        <div>
          <SignInButtonComponent />
        </div>
      )}
      {decentralizedID && (
        <div>
          <SignOutButtonComponent />{
          showForm ? (
          <div>
            <FormPage setShowForm={setShowForm} />
          </div>
          ) : (
          <div>
            <SuperUserRoutes smartistUser={smartistUser}/>
          </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Content;
