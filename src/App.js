import React, { Component, useState, useEffect } from "react";
import { Connect } from "@blockstack/connect";
import { useBlockstack, useConnectOptions } from "react-blockstack";
import { connectOptions } from "./UserSession";
import { configure, User, getConfig, Model } from "radiks";
import "./App.css";

import SmartistsUserModel from "./models/SmartistsUser";

import Content from "./layouts";

const handleRadiksSignIn = async (
  setIsSigningIn,
  setSmartistsUser,
  setIsFetchingUser
) => {
  setIsSigningIn(true);
  const query = { sortByDateStart: true };
  try {
    await User.createWithCurrentUser();
    const smartistsUser = await SmartistsUserModel.fetchOwnList();
    setSmartistsUser(smartistsUser);
    setIsSigningIn(false);
    setIsFetchingUser(false)
  } catch (error) {
    console.log(error);
    setSmartistsUser([]);
    setIsSigningIn(false);
    setIsFetchingUser(false)
  }
};

const handleUser = async (userSession, setSmartistsUser,setIsFetchingUser) => {
  if (userSession) {
    if (userSession.isUserSignedIn()) {
      try {
        const smartistsUser = await SmartistsUserModel.fetchOwnList();
        setSmartistsUser(smartistsUser);
        setIsFetchingUser(false)
      } catch (error) {
        setSmartistsUser([]);
        console.log(error);
        setIsFetchingUser(false)
      }
    }
  }
};

function App(props) {
  const {} = props;
  const [loading, setLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [userSession, setUserSession] = useState();
  const [smartistsUser, setSmartistsUser] = useState(null);
  const [isfetchingUser, setIsFetchingUser] = useState(true);
  const { userSession: session, signOut } = useBlockstack();

  useEffect(() => {
    setUserSession(session);
  }, [session]);

  useEffect(() => {
    configure({
      apiServer: "http://localhost:5002",
      userSession,
    });

    handleUser(userSession, setSmartistsUser, setIsFetchingUser);
  }, [userSession]);

  useEffect(() => {}, [isSigningIn]);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div>
      <Connect
        authOptions={useConnectOptions(
          connectOptions(({ userSession }) => {
            setUserSession(userSession);
            const userData = userSession.loadUserData();
            handleRadiksSignIn( setIsSigningIn, setSmartistsUser, setIsFetchingUser);
          })
        )}
      >
        {loading ? (
          <div>Loading</div>
        ) : isSigningIn ? (
          <div>signing in user</div>
        ) : (
          <Content
            userSession={userSession}
            handleUser={handleUser}
            smartistsUser={smartistsUser}
            setSmartistsUser={setSmartistsUser}
            signOut={signOut}
            isfetchingUser={isfetchingUser}
          />
        )}
      </Connect>
    </div>
  );
}

export default App;
