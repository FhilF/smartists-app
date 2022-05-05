import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Child from "layouts/SmartistsUser/Child";
import MembersList from "pages/Members";
import FeaturedWorkView from "pages/Member/Studio/FeaturedWork/View";
import FeaturedProjectView from "pages/Member/Studio/FeaturedProject/View";
import ViewNFT from "pages/Member/Studio/NFT/View";

function SmartistsUser(props) {
  const { smartistsUserSession, location, isMainnet } = props;
  const staticRoutes = ["/test", "/members"];
  return (
    <>
      <Routes>
        <Route path="/members" element={<MembersList />} />
        <Route path="/nft/:assetContractName/:id" element={<ViewNFT {...props} />} />
        <Route
          path="/"
          element={<Navigate to={`/${smartistsUserSession[isMainnet ? "walletAddress" : "walletAddressTestnet"]}`} />}
        />
        <Route
          path="/:address/studio/featured-work/:id"
          element={<FeaturedWorkView {...props} />}
        />
        <Route
          path="/:address/studio/project/:id"
          element={<FeaturedProjectView {...props} />}
        />

        <Route
          path="/:address/studio/project/:id"
          element={<FeaturedProjectView {...props} />}
        />
        {/* <Route
              path="/:address/studio/nft/genuine/:id"
              element={<>test</>}
            /> */}
        <Route path="/:address/*" element={<Child {...props} />} />
      </Routes>
    </>
  );
}

export default SmartistsUser;
