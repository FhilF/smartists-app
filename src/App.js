import React, { Component, useState, useEffect } from "react";
import { Connect } from "@blockstack/connect";
import { useBlockstack, useConnectOptions } from "react-blockstack";
import { connectOptions } from "./UserSession";
import { configure, User, getConfig, Model } from "radiks";
import "./App.css";

import SmartistUserModel from "./models/SmartistUser";

import Content from "./layouts";

const handleRadiksSignIn = async (
  userData,
  setIsSigningIn,
  setShowForm,
  setSmartistUser
) => {
  setIsSigningIn(true);
  const query = { sortByDateStart: true };
  try {
    await User.createWithCurrentUser();
    const smartistUser = await SmartistUserModel.fetchOwnList();
    if (!smartistUser.length) {
      setShowForm(true);
    } else {
      setSmartistUser(smartistUser);
    }
    // if (!smartistUser.length) {
    //   const smartistUserModel = new SmartistUserModel({
    //     name: null,
    //     username: userData.username,
    //   });
    //   await smartistUserModel.save();
    // }
    setIsSigningIn(false);
  } catch (error) {
    console.log(error);
    setIsSigningIn(false);
  }
};

const handleUser = async (userSession, setShowForm, setSmartistUser) => {
  if (userSession) {
    if (userSession.isUserSignedIn()) {
      try {
        const smartistUser = await SmartistUserModel.fetchOwnList();
        if (!smartistUser.length) {
          setShowForm(true);
        } else {
          setSmartistUser(smartistUser);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
};

function App(props) {
  const {} = props;
  const [loading, setLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [userSession, setUserSession] = useState();
  const [smartistUser, setSmartistUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { userSession: session } = useBlockstack();

  useEffect(() => {
    setUserSession(session);
  }, [session]);

  useEffect(() => {
    configure({
      apiServer: "http://localhost:5002",
      userSession,
    });

    handleUser(userSession, setShowForm, setSmartistUser);
  }, [userSession, setShowForm]);

  useEffect(() => {
  }, [isSigningIn]);

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
            handleRadiksSignIn(
              userData,
              setIsSigningIn,
              setShowForm,
              setSmartistUser
            );
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
            showForm={showForm}
            setShowForm={setShowForm}
            smartistUser={smartistUser}
          />
        )}
      </Connect>
    </div>
  );
}

export default App;
