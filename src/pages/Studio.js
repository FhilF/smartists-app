import React, { useState, useEffect } from "react";
import { useBlockstack } from "react-blockstack";

import StudioModel from "../models/Studio";
import CreateStudioComponent from "../components/CreateStudio";
import AddArtworkComponent from "../components/AddArtwork";
import AddAddFeaturedProjectComponent from "../components/AddFeaturedProject";
import SampleArtwork from "../components/SampleArtwork";

import BannerComponent from "../components/Banner";
import FeaturedProjectComponent from "../components/FeaturedProject";

import ProjectModel from "../models/Project";

import "../css/studio.scss";
import "../css/modal.scss";

function Studio(props) {
  const { match, smartistUser, history } = props;
  const { userSession } = useBlockstack();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [userProfile, setUserProfile] = useState();
  const [studio, setStudio] = useState([]);
  const [isSelf, setIsUser] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const handleUserStudio = async () => {
    const studio = await StudioModel.fetchOwnList();
    setStudio(studio);
  };

  useEffect(() => {
    const username = match.params.username;
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      if (userData.username === username) {
        setIsUser(true);
        setUserProfile(smartistUser);
        handleUserStudio();
      } else {
        setIsUser(false);
      }
    }
  }, [match, userSession, smartistUser, setIsUser, setUserProfile]);

  useEffect(() => {
    if (studio.length !== 0) {
    }
  }, [studio]);

  useEffect(() => {
    setIsPageLoading(false);
  }, []);

  return (
    <div style={{ height: "150vh" }}>
      {!isPageLoading && (
        <div>
          {isSelf ? (
            userProfile && (
              <div>
                {studio ? (
                  studio.length !== 0 ? (
                    <div>
                      <Content
                        userProfile={userProfile}
                        isSelf={isSelf}
                        userSession={userSession}
                        studio={studio[0]}
                      />
                    </div>
                  ) : (
                    <div>
                      <CreateStudioComponent
                        handleUserStudio={handleUserStudio}
                        userSession={userSession}
                        username={match.params.username}
                        setFormLoading={setFormLoading}
                      />
                    </div>
                  )
                ) : null}
              </div>
            )
          ) : (
            <div>not me</div>
          )}
        </div>
      )}
    </div>
  );
}

const HandleIsArtist = (props) => {
  const { isArtistInfo } = props;
  return (
    <div>
      <br />
      <div>Artist Profile</div>
      <div>
        {isArtistInfo.openWork ? "Open" : "Not open"} to work on demand.
      </div>
      <div>
        <div>Skills</div>
        <div style={{ display: "flex" }}>
          {isArtistInfo.skills.length !== 0
            ? isArtistInfo.skills.map((skill, index) => {
                return <div key={index}>{skill},&nbsp;</div>;
              })
            : null}
        </div>
      </div>
    </div>
  );
};

function Content(props) {
  const { userProfile, isSelf, userSession, studio } = props;

  const [featuredProjects, setFeaturedProjects] = useState(null);

  const handleFeaturedProject = async (id) => {
    const projects = await ProjectModel.fetchOwnList({ studioId: id });
    setFeaturedProjects(projects);
  };

  useEffect(() => {
    handleFeaturedProject(studio.attrs._id);
  }, [userSession, studio]);

  return (
    <div>
      {isSelf ? (
        <UserOwnedStudio
          userProfile={userProfile}
          isSelf={isSelf}
          userSession={userSession}
          studio={studio}
          featuredProjects={featuredProjects}
        />
      ) : null}
    </div>
  );
}

function UserOwnedStudio(props) {
  const { userProfile, isSelf, userSession, studio, featuredProjects } = props;
  return (
    <div>
      <div>
        <BannerComponent isSelf={isSelf} studio={studio} />
        <div>{userProfile.username}</div>
        <div>skills</div>
        <div>
          {userProfile.isArtist ? (
            userProfile.isArtist.boolean ? (
              <HandleIsArtist isArtistInfo={userProfile.isArtist.info} />
            ) : null
          ) : null}
        </div>
        <div>
          <p>Show case your artworks</p>
          <p>You can upload up to 3 artworks</p>
          <div>
            <div style={{ display: "flex" }}>
              {studio.attrs.artworks
                ? studio.attrs.artworks.length !== 0
                  ? studio.attrs.artworks.map((artwork, index) => {
                      return (
                        <SampleArtwork
                          key={index}
                          artwork={artwork}
                          studio={studio}
                          index={index}
                        />
                      );
                    })
                  : null
                : null}

              {studio.attrs.artworks ? (
                studio.attrs.artworks.length > 2 ? null : (
                  <AddArtworkComponent
                    userSession={userSession}
                    studio={studio}
                  />
                )
              ) : null}
            </div>
          </div>
        </div>

        <div>
          <br />
          <div>
            {isSelf ? (
              <AddAddFeaturedProjectComponent
                userSession={userSession}
                studio={studio}
              />
            ) : null}
          </div>

          <div>
            {featuredProjects &&
              featuredProjects.map((featuredProject, index) => {
                return (
                  <FeaturedProjectComponent
                    key={index}
                    featuredProject={featuredProject}
                    isSelf={isSelf}
                  />
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

function OtherUserOwnedStudio(props) {
  const {} = props;
  return <div></div>;
}

export default Studio;
