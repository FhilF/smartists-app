import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "pages/Member";
import AboutMe from "pages/Member/AboutMe";
import StudioLayout from "layouts/SmartistsUser/Studio";
import StudioGate from "pages/Member/Studio/Gate";
import NotArtist from "components/MemberNotArtist";
import NoStudio from "components/MemberNoStudio";
import NFT from "pages/Member/Studio/NFT";

function ChildRoutes(props) {
  const {
    isSessionedUser,
    signedInSmartistsUser,
    smartistsUserData,
    setSignedInSmartistsUser,
    setSmartistsUserData,
    smartistsUserSession,
  } = props;
  // console.log(smartistsUserData)
  const location = useLocation();
  return (
    <>
      <Routes>
        <Route path="/" element={<Home {...props} />} />
        <Route path="/about-me" element={<AboutMe {...props} />} />

        {!smartistsUserData.classification.isArtist.isTrue && (
          <Route
            path="/nft"
            element={
              <div className="p-6">
                <NFT {...props} isArtUser={true}/>
              </div>
            }
          />
        )}

        <Route
          path="/studio/*"
          element={
            smartistsUserData.classification.isArtist.isTrue ? (
              smartistsUserData.Studio ? (
                <StudioLayout {...props} />
              ) : isSessionedUser ? (
                <StudioGate {...props} />
              ) : (
                <NoStudio />
              )
            ) : (
              <NotArtist isSessionedUser={isSessionedUser} />
            )
          }
        />
      </Routes>
    </>
  );
}

export default ChildRoutes;
