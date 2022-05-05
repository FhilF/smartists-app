import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import MemberFeed from "pages/MemberFeed";
// import StudioLayout from "layouts/SmartistsUser/Studio";
import SmartistsUserEdit from "pages/SmartistsUserEdit";
import NotAccessible from "pages/ErrorPages/NotAccessible";
import View from "pages/Member/Studio/NFT/View";
import Mint from "pages/Member/Studio/NFT/Mint";
function SmartistsUser(props) {
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
        <Route
          path="/edit"
          element={
            location.pathname ===
            `/${smartistsUserSession.walletAddress}/edit` ? (
              <SmartistsUserEdit
                smartistsUserSession={smartistsUserSession}
                setSignedInSmartistsUser={setSignedInSmartistsUser}
                setSmartistsUserData={setSmartistsUserData}
              />
            ) : (
              <NotAccessible />
            )
          }
        />

        <Route path="/studio/nft/mint" element={<Mint {...props} />} />

        {/* <Route
          path="studio/nft/genuine/:id"
          element={
            <View
              isSessionedUser={isSessionedUser}
              signedInSmartistsUser={signedInSmartistsUser}
              smartistsUserData={smartistsUserData}
              smartistsUserSession={smartistsUserSession}
            />
          }
        /> */}
      </Routes>
    </>
  );
}

export default SmartistsUser;
