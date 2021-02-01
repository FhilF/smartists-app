import React, { useState, useEffect } from "react";
import ProfileLayoutComponent from "./ProfileLayout";
import { Route } from "react-router-dom";
import StudioPage from "../pages/Studio";
import ProfilePage from "../pages/Profile";
import FeaturedPortfolioPage from "../pages/FeaturedPortfolio";
import FeaturedProjectPage from "../pages/FeaturedProject";
import "../scss/profile.scss";
import StudioModel from "../models/Studio";

import StudioGatePage from "../pages/StudioGate";
import {
  fetchSmartistsMember,
  clearSmartistsMember,
} from "../utils/actions/smartistsMemberAction";
import { connect } from "react-redux";
import user from "radiks/lib/models/user";

function ProfileRoot(props) {
  const {
    history,
    match,
    smartistsUser,
    fetchSmartistsMember,
    smartistsMember,
    loadingSmartistsMember,
    clearSmartistsMember,
  } = props;
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isFetchingStudio, setIsFetchingStudio] = useState(true);
  const [isUser, setIsUser] = useState(null);
  const [userStudio, setUserStudio] = useState([]);
  useEffect(() => {
    const _smartistsUser = smartistsUser[0].attrs;
    const paramSmartistsMember = match.params.username;
    if (paramSmartistsMember === _smartistsUser.username) {
      setIsUser(true);
      if (_smartistsUser.isArtist.boolean) {
        StudioModel.fetchOwnList()
          .then((result) => {
            setUserStudio(result);
            setIsFetchingStudio(false);
          })
          .catch((error) => {
            console.log(error);
            setIsFetchingStudio(false);
          });
      }

      setIsPageLoading(false);
    } else {
      if (smartistsMember.length === 0) {
        const query = {
          smartistsMember: paramSmartistsMember,
          studioLookup: true,
        };
        setIsUser(false);
        fetchSmartistsMember(query);
        setIsPageLoading(false);
      }
    }
  }, [match.url]);

  return (
    <>
      {isPageLoading ? (
        <>Loading</>
      ) : (
        <>
          {isUser ? (
            <UserProfile
              userProfile={smartistsUser[0].attrs}
              userStudio={userStudio}
              setUserStudio={setUserStudio}
              isPageLoading={isPageLoading}
              history={history}
              match={match}
              isUser={isUser}
              isFetchingStudio={isFetchingStudio}
            />
          ) : (
            !loadingSmartistsMember && (
              <OtherUserProfile
                smartistsMember={smartistsMember}
                userStudio={userStudio}
                setUserStudio={setUserStudio}
                isPageLoading={isPageLoading}
                fetchSmartistsMember={fetchSmartistsMember}
                history={history}
                match={match}
                isUser={isUser}
              />
            )
          )}
        </>
      )}
      {/* <ProfileLayoutComponent
        userProfile={userProfile}
        history={history}
        isPageLoading={isPageLoading}
        isFetchingStudio={isFetchingStudio}
      >
        {isPageLoading ? null : (
          <>
            <Route path={`${match.url}/`} component={ProfilePage} exact />
            {isFetchingStudio ? null : userStudio.length === 0 ? (
              <Route
                path={`${match.url}/studio`}
                component={() => (
                  <StudioGatePage
                    userProfile={userProfile}
                    history={history}
                    match={match}
                    setUserStudio={setUserStudio}
                  />
                )}
              />
            ) : (
              <>
                <Route
                  path={`${match.url}/studio`}
                  component={() => (
                    <StudioPage
                      userProfile={userProfile}
                      history={history}
                      match={match}
                    />
                  )}
                />
                <Route
                  path={`${match.url}/featured-portfolio`}
                  component={() => (
                    <FeaturedPortfolioPage
                      userProfile={userProfile}
                      history={history}
                      match={match}
                      userStudio={userStudio}
                    />
                  )}
                />
                <Route
                  path={`${match.url}/featured-project`}
                  component={() => (
                    <FeaturedProjectPage
                      userProfile={userProfile}
                      history={history}
                      match={match}
                      userStudio={userStudio}
                    />
                  )}
                />
              </>
            )}
          </>
        )}
      </ProfileLayoutComponent> */}
    </>
  );
}

const UserProfile = (props) => {
  const {userProfile,
  userStudio,
  setUserStudio,
  isPageLoading,
  history,
  match,
  isUser,
  isFetchingStudio} = props;

  return (
    <>
      <ProfileLayoutComponent
        userProfile={userProfile}
        history={history}
        isFetchingStudio={isFetchingStudio}
        isLoading={isPageLoading}
      >
        {isPageLoading ? null : (
          <>
            <Route path={`${match.url}/`} component={ProfilePage} exact />
            {isFetchingStudio ? null : userStudio.length === 0 ? (
              <Route
                path={`${match.url}/studio`}
                component={() => (
                  <StudioGatePage
                    userProfile={userProfile}
                    history={history}
                    match={match}
                    setUserStudio={setUserStudio}
                  />
                )}
              />
            ) : (
              userProfile.isArtist && (
                <>
                  <Route
                    path={`${match.url}/studio`}
                    component={() => (
                      <StudioPage
                        userProfile={userProfile}
                        history={history}
                        match={match}
                        isUser={isUser}
                      />
                    )}
                  />
                  <Route
                    path={`${match.url}/featured-portfolio`}
                    component={() => (
                      <FeaturedPortfolioPage
                        userProfile={userProfile}
                        history={history}
                        match={match}
                        userStudio={userStudio}
                        isUser={isUser}
                      />
                    )}
                  />
                  <Route
                    path={`${match.url}/featured-project`}
                    component={() => (
                      <FeaturedProjectPage
                        userProfile={userProfile}
                        history={history}
                        match={match}
                        userStudio={userStudio}
                        isUser={isUser}
                      />
                    )}
                  />
                </>
              )
            )}
          </>
        )}
      </ProfileLayoutComponent>
    </>
  );
};

const OtherUserProfile = (props) => {
  const { smartistsMember, history, match, isUser } = props;
  const [userProfile, setUserProfile] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setUserProfile(smartistsMember[0]);
    setIsLoading(false);
  }, []);
  return (
    <>
      <ProfileLayoutComponent
        userProfile={userProfile}
        history={history}
        isLoading={isLoading}
      >
        {!isLoading && (
          <>
            <Route path={`${match.url}/`} component={ProfilePage} exact />
            {userProfile.isArtist && (
              <>
                <Route
                  path={`${match.url}/studio`}
                  component={() => (
                    <StudioPage
                      isUser={isUser}
                      userProfile={userProfile}
                      history={history}
                      match={match}
                    />
                  )}
                />
              </>
            )}
          </>
        )}
      </ProfileLayoutComponent>
    </>
  );
};


const mapStateToProps = (state) => ({
  smartistsMember: state.smartistsMemberReducer.smartistsMember,
  loadingSmartistsMember: state.smartistsMemberReducer.loadingSmartistsMember,
  errorSmartistsMember: state.smartistsMemberReducer.errorSmartistsMember,
});
export default connect(mapStateToProps, {
  fetchSmartistsMember,
  clearSmartistsMember,
})(ProfileRoot);
