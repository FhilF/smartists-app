import React, { useEffect, useState } from "react";
import Dashboard from "../MemberDashboard";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import NavButton from "./NavButton";
import StudioRoutes from "routes/SmartistsUserRoutes/StudioRoutes";

function Studio(props) {
  const {
    smartistsUserData,
    signedInSmartistsUser,
    setSignedInSmartistsUser,
    isSessionedUser,
    setSmartistsUserData,
    isMainnet,
    smartistsUserSession
  } = props;
  const location = useLocation();
  const navigate = useNavigate();
  const navDetails = [
    {
      name: "Featured Works",
      pathname: `/${smartistsUserData[isMainnet ? "walletAddress" : "walletAddressTestnet"]}/studio/featured-work`,
    },
    {
      name: "Project",
      pathname: `/${smartistsUserData[isMainnet ? "walletAddress" : "walletAddressTestnet"]}/studio/project`,
    },
    {
      name: "NFT",
      pathname: `/${smartistsUserData[isMainnet ? "walletAddress" : "walletAddressTestnet"]}/studio/nft`,
    },
  ];
  return (
    <div className="w-full mt-12 pr-8">
      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-1">
          <ul className="grid gap-2">
            {navDetails.map((el, i) => {
              return (
                <NavButton
                  location={location}
                  navigate={navigate}
                  {...el}
                  key={i}
                />
              );
            })}
          </ul>
          <hr className="mt-2 border-gray-200" />
        </div>
        <div className="col-span-4">
          <StudioRoutes
            signedInSmartistsUser={signedInSmartistsUser}
            setSignedInSmartistsUser={setSignedInSmartistsUser}
            isSessionedUser={isSessionedUser}
            smartistsUserData={smartistsUserData}
            setSmartistsUserData={setSmartistsUserData}
            smartistsUserSession={smartistsUserSession}
          />
        </div>
      </div>
    </div>
  );
}

export default Studio;
