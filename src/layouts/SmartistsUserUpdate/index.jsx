import React from "react";
import SuperUserRoute from "routes/SuperUserRoutes";
import Header from "./Header";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "layouts/Footer";
import { Routes, Route } from "react-router-dom";
import globalRoutes from "routes/GlobalRoutes";
import { userSession } from "utils/stacks-util/auth";
import { useSelector, useDispatch } from "react-redux";
import {
  addFileToStorage,
  deleteFileFromStorage,
} from "utils/stacks-util/storage";
import axios from "axios";
import { apiServer } from "config";
import { getPublicKeyFromPrivate } from "@stacks/encryption";
import {
  defineSmartistsUserSession,
  updateSmartistsUserSession,
} from "utils/redux/slice/userSessionSlice";
import { useAlert } from "react-alert";
import { isMainnet } from "config";

function Index(props) {
  const { setUserType } = props;
  const location = useLocation();
  const routesWithoutHeader = ["/account-setup"];
  return (
    <div>
      <Header />
      <div
        className="h-full flex flex-col mb-36"
        style={{ minHeight: "110vh " }}
      >
        <div className="h-full flex-grow" style={{ marginTop: "60px" }}>
          <Routes>
            <Route path="/" element={<Content setUserType={setUserType} />} />
            {globalRoutes.map((component) => component)}
          </Routes>
        </div>
      </div>
      <Footer />
    </div>
  );
}

const Content = (props) => {
  const { setUserType } = props;
  const alert = useAlert();
  const navigate = useNavigate();
  const userData = userSession.loadUserData();
  const walletAddress = userData.profile.stxAddress.mainnet;
  const walletAddressTestnet = userData.profile.stxAddress.testnet;
  const dispatch = useDispatch();

  const updateInformation = () => {
    axios
      .put(`${apiServer}/existingsmartistsusers/${walletAddress}`, {
        walletAddressTestnet,
        publicKey: getPublicKeyFromPrivate(userData.appPrivateKey),
      })
      .then((res) => {
        return dispatch(updateSmartistsUserSession(res.data.SmartistsUser));
      })
      .then((res) => {
        const data = { SmartistsUser: res.payload };
        sessionStorage.setItem("SmartistsUser", JSON.stringify(data));
        dispatch(defineSmartistsUserSession(data.SmartistsUser));
        setUserType("SmartistsUser-Type");
        navigate(
          `/${
            data.SmartistsUser[
              isMainnet ? "walletAddress" : "walletAddressTestnet"
            ]
          }/`,
        );
      })
      .catch((err) => {
        alert.error(
          "There was a problem submitting the form please try again later!"
        );
        // navigate(`/${smartistsMemberCopy.walletAddress}/about-me`);
        // setFormLoading(false);
        // console.log(err);
      });
  };
  return (
    <div className="flex justify-center">
      <div className="mt-20 text-center max-w-3xl w-full">
        <h1 className=" text-4xl font-medium">Update Account Information</h1>
        <p className=" mt-8">
          We will be updating existing member's information from our server by
          adding testnet wallet address in order to identify members from{" "}
          <a
            target="_blank"
            rel="noreferrer"
            href="/faqs/16"
            className=" text-red-900 underline"
          >
            testnet environment
          </a>{" "}
          and public key to encrypt your files for minting and transferring nft.
        </p>
        <p className="m-4">
          You won’t be able to access further if we don't update your
          information.
        </p>
        <button
          className="mt-8 bg-red-800 text-white p-4 rounded-lg hover:bg-red-900"
          onClick={() => {
            updateInformation();
          }}
        >
          Update Information
        </button>
      </div>
    </div>
  );
};

export default Index;
