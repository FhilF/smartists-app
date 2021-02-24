import React, { useState } from "react";

import { useConnect } from "@blockstack/connect";
import StudioModel from "../models/Studio";
import SmartistsUserModel from "../models/SmartistsUser";
import Button from "../customComponents/Button";
import { useBlockstack } from "react-blockstack";
import Loader from "react-loader-spinner";
import { result } from "lodash";
import { useAlert } from "react-alert";

function AddStudio(props) {
  const { match, handleStudio } = props;
  const alert = useAlert();

  const [formLoading, setFormLoading] = useState(false);

  const { userSession } = useBlockstack();
  const handleAddStudio = async (e) => {
    setFormLoading(true);
    e.preventDefault();
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      if (userData.username === match.params.username) {
        SmartistsUserModel.fetchOwnList()
          .then((result) => {
            if (result.length !== 0) {
              return StudioModel.fetchOwnList();
            } else {
              alert.error("Please sign in to continue");
              userSession.signUserOut(window.location.origin);
              throw "error";
            }
          })
          .then((result) => {
            if (result.length === 0) {
              const studioModel = new StudioModel({
                username: userData.username,
                banner: null,
              });
              return studioModel.save();
            } else {
              console.log("You already have one");
              return null;
            }
          })
          .then((result) => {
            if (result) {
            alert.success("Successfully created your studio");
              handleStudio(result);
            } else {
              throw "error";
            }
          })
          .catch((error) => {
            alert.error("There was an error submitting your form");
            setFormLoading(false);
          });
      } else {
        alert.error("Please sign in to continue");
        userSession.signUserOut(window.location.origin);
      }
    }
  };
  return (
    <div className="mt-8">
      <div className="flex justify-center">
        <div className="relative inline">
          <Button
            onClick={(e) => {
              handleAddStudio(e);
            }}
            variant="contained"
            color="secondary"
            disabled={formLoading}
          >
            {formLoading ? <>Creating Studio...</> : <>Create Studio</>}
          </Button>
          {formLoading && (
            <Loader
              className="btn-loader"
              type="Oval"
              color="#00BFFF"
              height={25}
              width={25}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default AddStudio;
