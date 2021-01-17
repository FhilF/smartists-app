import React, { useState, useEffect } from "react";
import ProfileLayoutComponent from "./ProfileLayout";
import { Route } from "react-router-dom";
import StudioPage from "../pages/Studio";
import ProfilePage from "../pages/Profile";
import PortfolioPage from "../pages/Portfolio";
import "../scss/profile.scss";

function ProfileRoot(props) {
  const { history, match, smartistsUser } = props;
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [userProfile, setUserProfile] = useState({
    isUser: null,
    smartistsUser: null,
  });
  useEffect(() => {
    const user = smartistsUser[0].attrs;
    if (match.params.username === user.username) {
      setUserProfile({ isUser: true, smartistsUser: user });
    }
  }, [match.url]);

  useEffect(() => {
    setIsPageLoading(false);
  }, []);

  return (
    <>
      <ProfileLayoutComponent
        userProfile={userProfile}
        history={history}
        isPageLoading={isPageLoading}
      >
        {isPageLoading ? null : (
          <>
            <Route path={`${match.url}/`} component={ProfilePage} exact />
            <Route
              path={`${match.url}/studio`}
              component={() => <StudioPage userProfile={userProfile} history={history} />}
            />
            <Route
              path={`${match.url}/portfolio`}
              component={() => <PortfolioPage userProfile={userProfile} history={history} />}
            />
          </>
        )}
      </ProfileLayoutComponent>
    </>
  );
}

export default ProfileRoot;
