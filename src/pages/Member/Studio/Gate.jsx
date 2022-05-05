import React, { useState, useEffect } from "react";
import Button from "customComponents/Button";
import { Oval } from "react-loader-spinner";
import { useAlert } from "react-alert";
import { userSession, signOut } from "utils/stacks-util/auth";
import { useSelector, useDispatch } from "react-redux";
import { defineStudioUserSession } from "utils/redux/slice/userSessionSlice";
import axios from "axios";
import { apiServer } from "config";

function StudioGate(props) {
  const {
    signedInSmartistsUser,
    setSignedInSmartistsUser,
    setSmartistsUserData,
    isMainnet
  } = props;
  const dispatch = useDispatch();
  const alert = useAlert();
  const [formLoading, setFormLoading] = useState(false);
  
  return (
    <div>
      <CreateStudio
        formLoading={formLoading}
        setFormLoading={setFormLoading}
        dispatch={dispatch}
        setSignedInSmartistsUser={setSignedInSmartistsUser}
        setSmartistsUserData={setSmartistsUserData}
      />
    </div>
  );
}

const CreateStudio = (props) => {
  const {
    setFormLoading,
    formLoading,
    dispatch,
    setSignedInSmartistsUser,
    setSmartistsUserData,
  } = props;
  const handleCreateStudio = async (e) => {
    setFormLoading(true);
    e.preventDefault();
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      const userWalletAddress = userData.profile.stxAddress.mainnet;
      axios
        .post(`${apiServer}/studios`, { userWalletAddress })
        .then((res) => {
          return dispatch(defineStudioUserSession({ Studio: res.data.studio }));
        })
        .then((res) => {
          const Studio = res.payload.Studio;
          let userSessionStorage = sessionStorage.getItem("SmartistsUser");
          userSessionStorage = JSON.parse(userSessionStorage);

          userSessionStorage.SmartistsUser = {
            ...userSessionStorage.SmartistsUser,
            Studio,
          };
          setSmartistsUserData(userSessionStorage.SmartistsUser);
          setSignedInSmartistsUser(userSessionStorage.SmartistsUser);
          sessionStorage.setItem(
            "SmartistsUser",
            JSON.stringify(userSessionStorage)
          );
          setFormLoading(false);
        })
        .catch((err) => {
          const error = JSON.parse(err.response.data);
          if (error.name === "SequelizeUniqueConstraintError") {
            alert.error(
              "Your studio has already been created, try refreshing your session!"
            );
          } else {
            alert.error(
              "There was a problem submitting the form please try again later!"
            );
          }
          setFormLoading(false);
        });
    } else {
      alert.error("Please sign in to continue");
      signOut();
    }
  };
  return (
    <div className="mt-8 mx-8">
      <div className="inline-flex flex-col items-start justify-start p-12 border border-dashed rounded-lg border-gray-300 w-full">
        <div className="flex flex-col space-y-5 items-start justify-start">
          <div className="flex flex-col space-y-1.5 items-start justify-start w-4/6">
            <p className="text-2xl font-medium leading-loose">
              Create your studio
            </p>
            <p className="text-base leading-normal text-gray-500">
              After creating your studio you will be able to publish featured
              works and collaboration projects to share with your audience
              privately.
            </p>
          </div>
          <div className="relative">
            <Button
              onClick={(e) => {
                handleCreateStudio(e);
              }}
              variant="contained"
              color="secondary"
              disabled={formLoading}
              style={{ borderRadius: "20px" }}
            >
              {formLoading ? <>Creating Studio...</> : <>Create Studio</>}
            </Button>
            {formLoading && (
              <Oval
                className="btn-loader"
                type="contained"
                color="#00BFFF"
                height={25}
                width={25}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudioGate;
