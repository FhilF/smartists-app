import { React, useState, useEffect } from "react";
import { authenticate, signOut, userSession } from "utils/stacks-util/auth";
import ParentLayout from "layouts";

import { useSelector, useDispatch } from "react-redux";
import {
  defineSmartistsUserSession,
  getSmartistsUserListAsync,
  getSmartistsUserMainnetTestnetAsync,
} from "utils/redux/slice/userSessionSlice";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isNewSignIn, setIsNewSignIn] = useState(false);
  const [isSignedIn, setisSignedIn] = useState(false);
  const [userType, setUserType] = useState("User-Type");
  // signOut( )

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <div className="App">
      {!isLoading && (
        <Content
          isNewSignIn={isNewSignIn}
          setIsNewSignIn={setIsNewSignIn}
          isSignedIn={isSignedIn}
          setisSignedIn={setisSignedIn}
          userType={userType}
          setUserType={setUserType}
        />
      )}
    </div>
  );
}

const Content = (props) => {
  const {
    isNewSignIn,
    setIsNewSignIn,
    isSignedIn,
    setisSignedIn,
    userType,
    setUserType,
  } = props;

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [errorSmartistsUser, setErrorSmartistsUser] = useState(null);
  // const smartistsUserSession = useSelector((state) => {
  //   const data = state.smartistsUserReducer.smartistsUser;
  //   return data;
  // });
  // // console.log("aaa")

  // useEffect(() => {
  //   // signOut()
  //   // console.log(smartistsUserSession);
  // }, [smartistsUserSession]);

  useEffect(() => {
    if (isNewSignIn) {
      if (userSession) {
        if (userSession.isUserSignedIn()) {
          const userData = userSession.loadUserData();
          const walletAddressMainnet = userData.profile.stxAddress.mainnet;
          const walletAddressTestnet = userData.profile.stxAddress.testnet;
          const userSessionStorage = sessionStorage.getItem("SmartistsUser");
          if (!userSessionStorage) {
            dispatch(
              getSmartistsUserMainnetTestnetAsync({
                walletAddress: walletAddressMainnet,
                walletAddressTestnet,
              })
            )
              .unwrap()
              .then((res) => {
                if (res.hasOwnProperty("SmartistsUser")) {
                  if (
                    res.SmartistsUser.walletAddress &&
                    res.SmartistsUser.walletAddressTestnet
                  ) {
                    dispatch(defineSmartistsUserSession(res.SmartistsUser));
                    sessionStorage.setItem(
                      "SmartistsUser",
                      JSON.stringify(res)
                    );
                    setUserType("SmartistsUser-Type");
                    setIsLoading(false);
                  } else {
                    setUserType("SmartistsUserUpdate-Type");
                    setIsLoading(false);
                  }
                } else {
                  setUserType("SuperUser-Type");
                  setIsLoading(false);
                }
              })
              .catch((err) => {
                setUserType("SuperUser-Type");
                setErrorSmartistsUser("CannotAccessServer");
                setIsLoading(false);
                return true;
              });
          } else {
            dispatch(
              defineSmartistsUserSession(
                JSON.parse(userSessionStorage).SmartistsUser
              )
            );
            setUserType("SmartistsUser-Type");
            setIsLoading(false);
          }
          setisSignedIn(true);
        } else {
          setIsLoading(false);
        }
      }
    }
  }, [isNewSignIn]);

  useEffect(() => {
    if (userSession) {
      if (userSession.isUserSignedIn()) {
        const userData = userSession.loadUserData();
        const walletAddressMainnet = userData.profile.stxAddress.mainnet;
        const walletAddressTestnet = userData.profile.stxAddress.testnet;
        const userSessionStorage = sessionStorage.getItem("SmartistsUser");
        if (!userSessionStorage) {
          dispatch(
            getSmartistsUserMainnetTestnetAsync({
              walletAddress: walletAddressMainnet,
              walletAddressTestnet,
            })
          )
            .unwrap()
            .then((res) => {
              if (res.hasOwnProperty("SmartistsUser")) {
                if (
                  res.SmartistsUser.walletAddress &&
                  res.SmartistsUser.walletAddressTestnet
                ) {
                  dispatch(defineSmartistsUserSession(res.SmartistsUser));
                  sessionStorage.setItem("SmartistsUser", JSON.stringify(res));
                  setUserType("SmartistsUser-Type");
                  setIsLoading(false);
                } else {
                  setUserType("SmartistsUserUpdate-Type");
                  setIsLoading(false);
                }
              } else {
                setUserType("SuperUser-Type");
                setIsLoading(false);
              }
            })
            .catch((err) => {
              console.log(err);
              console.log(JSON.parse(err.message));
              setUserType("SuperUser-Type");
              setErrorSmartistsUser("CannotAccessServer");
              setIsLoading(false);
              return true;
            });
        } else {
          dispatch(
            defineSmartistsUserSession(
              JSON.parse(userSessionStorage).SmartistsUser
            )
          );
          setUserType("SmartistsUser-Type");
          setIsLoading(false);
        }
        setisSignedIn(true);
      } else {
        setIsLoading(false);
      }
    }
  }, []);

  return (
    <>
      {!isLoading && (
        <div>
          <ParentLayout
            isSignedIn={isSignedIn}
            setIsNewSignIn={setIsNewSignIn}
            userType={userType}
            setUserType={setUserType}
            errorSmartistsUser={errorSmartistsUser}
          />
        </div>
      )}
    </>
  );
};

export default App;