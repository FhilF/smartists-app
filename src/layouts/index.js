import React, { useState, useEffect } from "react";
import { useConnect } from "@blockstack/connect";

import SuperUserRoutes from "../routes/SuperUser";
import SmartistsUserRoutes from "../routes/SmartistsUser";
import NavProfileMenu from "../components/NavProfileMenu";

import LandingPage from "../pages/LandingPage"

import { useHistory } from "react-router-dom";

import "../styles/scss/layout.scss"

function Content(props) {
  const { userSession, smartistsUser, setSmartistsUser, signOut,isfetchingUser } = props;
  const authenticated = userSession && userSession.isUserSignedIn();
  const [profile, setprofile] = useState({});
  const decentralizedID =
    userSession &&
    userSession.isUserSignedIn() &&
    userSession.loadUserData().decentralizedID;

  const { doOpenAuth } = useConnect();
  
  const history = useHistory();


  useEffect(() => {
    if (userSession) {
      if (userSession.isUserSignedIn()) {
        setprofile(userSession.loadUserData());
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

  useEffect(() => {
    // console.log({fetchingUser:isfetchingUser})
  }, []);

  return (
    <div>
      <div className="navbar bg-primary">
        <div className="nav-content">
          <div className="nav-brand">
            <div className="logo-text">Smartists</div>
          </div>
          <ul className="nav-menu-list text-gray-600 hover:text-gray-900">
            {userSession.isUserSignedIn() ? (
              <>
                {smartistsUser ? (
                  <>
                    {/* <li className="nav-menu">
                      <a href="# ">Menu</a>
                    </li> */}
                  </>
                ) : null}
                <NavProfileMenu
                  profile={profile}
                  signOut={signOut}
                  userSession={userSession}
                  history={history}
                  smartistsUser={smartistsUser}
                />
              </>
            ) : (
              <>
                <li className="nav-menu">
                  <a
                    href="/documentation"
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                  >
                    Documentation
                  </a>
                </li>
                <li className="nav-menu">
                  <a
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      doOpenAuth(true);
                    }}
                  >
                    Sign in
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      <div className="content-body-root mb-20">
        {!authenticated && <LandingPage/>}
        {decentralizedID && (
          <>
            {!isfetchingUser ? smartistsUser.length !== 0 ? (
              <div className="">
                <SmartistsUserRoutes  setSmartistsUser={setSmartistsUser} smartistsUser={smartistsUser} isfetchingUser={isfetchingUser} />
              </div>
            ) : (
              <div className="">
                <SuperUserRoutes setSmartistsUser={setSmartistsUser} />
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

export default Content;
