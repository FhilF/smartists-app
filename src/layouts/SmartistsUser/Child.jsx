import React, { useEffect, useState } from "react";
import MemberDashboard from "./MemberDashboard";
import {
  useLocation,
  useParams,
  useNavigate,
  useMatch,
} from "react-router-dom";
import MemberRoutes from "routes/SmartistsUserRoutes/MemberRoutes";
import { useSelector, useDispatch } from "react-redux";
import { isEmpty } from "lodash";
import {
  defineSmartistsUserSession,
  getSmartistsUserListAsync,
  getSmartistsUserAsync,
} from "utils/redux/slice/userSessionSlice";
import classNames from "classnames";

import Button from "customComponents/Button";
import ChildRoutes from "routes/SmartistsUserRoutes/ChildRoutes";

function Index(props) {
  const { smartistsUserSession, isMainnet } = props;
  const dispatch = useDispatch();
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();

  // console.log(urlAddress)

  const [smartistsUserData, setSmartistsUserData] = useState();
  const [isSessionedUser, setIsSessionedUser] = useState(true);
  const [isLoading, setisLoading] = useState(true);
  const [signedInSmartistsUser, setSignedInSmartistsUser] = useState();
  const urlAddress = params.address;
  const superUserRoutes = ["account-setup"];

  const editMembershipRoute = useMatch(":address/edit");
  const mintRoute = useMatch(":address/studio/nft/mint");
  const nftItemRoute = useMatch(":address/studio/nft/genuine/:id");

  const routesWithoutDashboard = [editMembershipRoute, nftItemRoute, mintRoute];
  // console.log(routesWithoutDashboard.some(el => !!el))

  // function otherThanNull(arr) {
  //   return arr.some(el => el !== null);
  // }

  useEffect(() => {
    if (!isEmpty(urlAddress)) {
      if (!superUserRoutes.includes(urlAddress)) {
        if (urlAddress !== smartistsUserSession[isMainnet ? "walletAddress" : "walletAddressTestnet"]) {
          dispatch(getSmartistsUserAsync({ walletAddress: urlAddress }))
            .unwrap()
            .then((res) => {
              if (!isEmpty(res)) {
                setSmartistsUserData(res.SmartistsUser);
                setIsSessionedUser(false);
                setisLoading(false);
              } else {
                setSmartistsUserData({});
                setIsSessionedUser(false);
                setisLoading(false);
              }
            })
            .catch((err) => {
              setSmartistsUserData({});
              setIsSessionedUser(false);
              setisLoading(false);
            });
        } else {
          setSignedInSmartistsUser(smartistsUserSession);
          setSmartistsUserData(smartistsUserSession);
          setIsSessionedUser(true);
          setisLoading(false);
        }
      }
    } else {
      setSignedInSmartistsUser(smartistsUserSession);
      setSmartistsUserData(smartistsUserSession);
      setIsSessionedUser(true);
      setisLoading(false);
    }
  }, [urlAddress]);

  // useEffect(() => {
  //   console.log(smartistsUserSession);
  // }, [smartistsUserSession]);

  // useEffect(() => {
  //   if (!mounted.current) {
  //     // do componentDidMount logic
  //     mounted.current = true;
  //   } else {
  //     // do componentDidUpdate logic
  //     console.log(mounted);
  //   }
  // }, []);

  return (
    <div>
      {!isLoading &&
        (routesWithoutDashboard.some((el) => !!el) ? (
          <MemberRoutes
            isMainnet={isMainnet}
            isSessionedUser={isSessionedUser}
            signedInSmartistsUser={signedInSmartistsUser}
            setSignedInSmartistsUser={setSignedInSmartistsUser}
            smartistsUserData={smartistsUserData}
            setSmartistsUserData={setSmartistsUserData}
            smartistsUserSession={smartistsUserSession}
          />
        ) : (
          <MemberDashboard
            isMainnet={isMainnet}
            signedInSmartistsUser={signedInSmartistsUser}
            smartistsUserData={smartistsUserData}
            isSessionedUser={isSessionedUser}
            setSmartistsUserData={setSmartistsUserData}
            setSignedInSmartistsUser={setSignedInSmartistsUser}
          >
            {!isEmpty(smartistsUserData) ? (
              <ChildRoutes
                isMainnet={isMainnet}
                location={location}
                navigate={navigate}
                isSessionedUser={isSessionedUser}
                signedInSmartistsUser={signedInSmartistsUser}
                smartistsUserData={smartistsUserData}
                setSmartistsUserData={setSmartistsUserData}
                setSignedInSmartistsUser={setSignedInSmartistsUser}
                smartistsUserSession={smartistsUserSession}
              />
            ) : (
              <UserNotFound
                isMainnet={isMainnet}
                smartistsUserSession={smartistsUserSession}
                navigate={navigate}
              />
            )}
          </MemberDashboard>
        ))}
    </div>
  );
}

const UserNotFound = (props) => {
  const { smartistsUserSession, navigate, isMainnet } = props;
  return (
    <div className="mt-16 px-8">
      <div className="text-center mt-16">
        <h3 className=" text-2xl leading-normal text-gray-500">
          User not found
        </h3>
        <Button
          className="mt-4"
          onClick={(e) => {
            navigate(`/${smartistsUserSession[isMainnet ? "walletAddress" : "walletAddressTestnet"]}`);
          }}
          variant="contained"
          color="secondary"
          style={{ borderRadius: "20px" }}
        >
          My info
        </Button>
      </div>
    </div>
  );
};

export default Index;
