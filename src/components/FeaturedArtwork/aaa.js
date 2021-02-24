import React, { useEffect, useState } from "react";
import { Route } from "react-router-dom";

import StudioLayout from "./StudioLayout";
import StudioPage from "../../pages/Studio";

import StudioModel from "models/Studio";

function Studio(props) {
  const { history, match, smartistsUser, location } = props;
  const [isUser, setIsUser] = useState();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [smartistsMember, setSmartistsMember] = useState(null);
  const [studio, setStudio] = useState([]);
  const usernameLink = match.params.username;
  const smartistsUserSignedIn = smartistsUser[0].attrs;

  useEffect(() => {
    setIsPageLoading(true);
    if (usernameLink === smartistsUserSignedIn.username) {
      if (smartistsUserSignedIn.isArtist.boolean) {
        StudioModel.fetchOwnList().then((result) => {
          console.log("test")
          const smartistsMemberCopy = Object.assign({}, smartistsUserSignedIn);
          setSmartistsMember({ ...smartistsMemberCopy, studio: result });
          setIsUser(true);
          setIsPageLoading(false);
        });
      } else {
        setSmartistsMember(smartistsUserSignedIn);
        setIsUser(true);
        setIsPageLoading(false);
      }
    }
    return () => {
    };
  }, []);

  return (
    <>
      {!isPageLoading && smartistsMember.isArtist.boolean ? (
        <StudioLayout
          smartistsMember={smartistsMember}
          history={history}
          match={match}
          location={location}
        >
          <StudioPage
            history={history}
            match={match}
            location={location}
            isUser={isUser}
            smartistsMember={smartistsMember}
          />
        </StudioLayout>
      ) : (
        <div>Not an artist</div>
      )}
    </>
  );
}

export default Studio;
