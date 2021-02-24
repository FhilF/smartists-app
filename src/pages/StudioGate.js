import React, { useState, useEffect } from "react";

import Button from "../customComponents/Button";

import StudioModel from "../models/Studio";
import { useBlockstack } from "react-blockstack";
import LoadingBar from "../components/LoadingBar"

function StudioGate(props) {
  const { setUserStudio, userProfile, match } = props;
  const { userSession } = useBlockstack();
  const [formLoading, setFormLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0)
  
  useEffect(() => {
    return () => {
      setLoadingProgress(100)
      setFormLoading(false)
    }
  }, [setUserStudio])
  const handleAddStudio = async (e) => {
    setFormLoading(true);
    setLoadingProgress(10)
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      if (userProfile.username === match.params.username) {
        StudioModel.fetchOwnList()
          .then((result) => {
            if (result.length === 0) {
              const studioModel = new StudioModel({
                username: userData.username,
                banner: null,
                artworks: [],
              });
              
              setLoadingProgress(90)
              return studioModel.save();
            } else {
              console.log("You already have one");
              return result;
            }
          })
          .then((result) => {
            setFormLoading(false);
            setUserStudio(result);
          })
          .catch((error) => {
            console.log(error);
            setFormLoading(false);
          });
      } else {
        console.log("cannot create that is not yours");
        setLoadingProgress(0)
        setFormLoading(false);
      }
    }
  };

  return (
    <div className="relative max-w-screen-lg xl:max-w-screen-xl mx-auto">
    <div className="flex justify-center">
      <LoadingBar loadingProgress={loadingProgress} setLoadingProgress={loadingProgress}/>
      <div className="studio-gate card p-20 pb-40">
        <div className="flex-column-center">
          <h1 className="mt-20 text-gray-800">Welcome to your own studio!</h1>
          <h4 className="mt-20 text-gray-500">Set up your studio</h4>
          <div className="mt-40 flex-column-center">
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={(e) => {
                e.preventDefault();
                handleAddStudio();
              }}
              disabled={formLoading}
            >
              Start Now
            </Button>
            <Button
              variant="contained"
              link="/documentation"
              className="mt-10"
              disabled={formLoading}
            >
              Learn More
            </Button>
            {/* <button>Know more</button> */}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default StudioGate;
