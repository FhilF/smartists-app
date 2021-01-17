import React, { useState, useEffect } from "react";
import { useConnect } from "@blockstack/connect";

import SuperUserRoutes from "../routes/SuperUser";
import SmartistsUserRoutes from "../routes/SmartistsUser";

import "../scss/global.scss";
import "../scss/layout.scss";

import NavProfileMenu from "../components/NavProfileMenu";

function Content(props) {
  const { userSession, smartistsUser, setSmartistsUser, signOut,isfetchingUser } = props;
  const authenticated = userSession && userSession.isUserSignedIn();
  const [profile, setprofile] = useState({});
  const decentralizedID =
    userSession &&
    userSession.isUserSignedIn() &&
    userSession.loadUserData().decentralizedID;

  const { doOpenAuth } = useConnect();


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
      <div className="navbar primary-bg">
        <div className="nav-content">
          <div className="nav-brand">
            <div className="logo-text">Smartists</div>
          </div>
          <ul className="nav-menu-list">
            {userSession.isUserSignedIn() ? (
              <>
                {smartistsUser ? (
                  <>
                    <li className="nav-menu">
                      <a href="# ">Menu</a>
                    </li>
                  </>
                ) : null}
                <NavProfileMenu
                  profile={profile}
                  signOut={signOut}
                  userSession={userSession}
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

      <div className="content-body-root">
        {!authenticated && <div>Regular User Home</div>}
        {decentralizedID && (
          <>
            {!isfetchingUser ? smartistsUser.length !== 0 ? (
              <div className="content-body">
                <SmartistsUserRoutes smartistsUser={smartistsUser} isfetchingUser={isfetchingUser} />
              </div>
            ) : (
              <>
                <SuperUserRoutes setSmartistsUser={setSmartistsUser} />
              </>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

export default Content;
