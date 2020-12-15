import React, { useState } from "react";

import { useConnect } from "@blockstack/connect";
import StudioModel from "../models/Studio";

function CreateStudio(props) {
  const { setFormLoading, userSession, username,handleUserStudio} = props;
  const handleCreateStudio = async (e) => {
    setFormLoading(true);
    e.preventDefault();
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      if (userData.username === username) {
        StudioModel.fetchOwnList()
          .then((result) => {
            if (result.length === 0) {
              const studioModel = new StudioModel({
                username: userData.username,
                banner: null,
                artworks: [],
              });
              //   console.log(studioModel);
              return studioModel.save();
            } else {
              console.log("You already have one");
              return null;
            }
          })
          .then((result) => {
            if (result) {
              console.log("success");
              handleUserStudio();
              setFormLoading(false);
            } else {
              handleUserStudio();
              setFormLoading(false);
            }
          })
          .catch((error) => {
            console.log(error);
            setFormLoading(false);
          });
      } else {
        console.log("cannot create that is not yours");
      }
    }
  };
  return (
    <div>
      <button
        onClick={(e) => {
          handleCreateStudio(e);
        }}
      >
        Create Studio
      </button>
    </div>
  );
}

export default CreateStudio;
