import React from "react";

import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";
import { isEmpty } from "lodash";
import FeaturedWork from "pages/Member/Studio/FeaturedWork";
import FeaturedProject from "pages/Member/Studio/FeaturedProject";
import NFT from "pages/Member/Studio/NFT";
import Mint from "pages/Member/Studio/NFT/Mint";
import StudioNotAvailable from "pages/Member/Studio/StudioNotAvailable";
import Button from "customComponents/Button";

function StudioRoutes(props) {
  const {
    isSessionedUser,
    signedInSmartistsUser,
    setSignedInSmartistsUser,
    smartistsUserData,
    setSmartistsUserData,
  } = props;

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to={`featured-work`} />} />
        <Route
          path="/featured-work"
          element={<FeaturedWork open={true} {...props} />}
        />
        <Route path="/project" element={<FeaturedProject {...props} />} />
        <Route path="/nft" element={<NFT {...props} />} />
        {/* <Route path="/mint-nft" element={<Mint {...props} />} /> */}
      </Routes>
    </>
  );
}

const NotAvailable = (props) => {
  const { smartistsUserData } = props;
  const navigate = useNavigate();
  const params = useParams();
  return (
    <div className="mt-16 px-8">
      <div className="w-full h-0.5 mt-1 bg-gray-100"></div>
      <div className="text-center mt-16">
        <h3 className=" text-xl leading-normal text-gray-500">
          User is not an artist
        </h3>
        <Button
          className="mt-4"
          onClick={(e) => {
            navigate(`/${params.address}`);
          }}
          variant="contained"
          color="secondary"
          style={{ borderRadius: "20px" }}
        >
          Back to member
        </Button>
      </div>
    </div>
  );
};

export default StudioRoutes;
