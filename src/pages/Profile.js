import React, { useState, useEffect } from "react";

import { useBlockstack } from "react-blockstack";

import placeHolder from "../assets/images/avatar-placeholder.png";
import SmartistUserModel from "../models/SmartistUser";

function Profile(props) {
  const { match, smartistUser, history } = props;
  const { userSession } = useBlockstack();
  const [isSelf, setIsUser] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [profile, setProfile] = useState();
  console.log(smartistUser);

  useEffect(() => {
    const userData = userSession.loadUserData();
    const username = match.params.username;
    if (userData.username === username) {
      setIsUser(true);
      setProfile(smartistUser);
    } else {
      setIsUser(false);
    }
  }, [match, userSession, smartistUser, setIsUser, setProfile]);

  useEffect(() => {
    setIsPageLoading(false);
  }, []);

  return (
    <div>
      {!isPageLoading && (
        <div>
          {isSelf ? (
            smartistUser && (
              <div>
                <UserProfile smartistUser={smartistUser} history={history} />
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

const HandleIsArtUser = (props) => {
  const { isArtUserInfo } = props;
  return (
    <div>
      <br />
      <div>Artuser Profile</div>
      <div>
        <div>Major interest</div>
        {isArtUserInfo.majorInterest ? isArtUserInfo.majorInterest : null}
      </div>
      <br />
      <div>
        <div>Primary Interest</div>
        <div style={{ display: "flex" }}>
          {isArtUserInfo.primaryInterest.length !== 0
            ? isArtUserInfo.primaryInterest.map((interest, index) => {
                return <div key={index}>{interest},&nbsp;</div>;
              })
            : null}
        </div>
      </div>
    </div>
  );
};

function UserProfile(props) {
  const { smartistUser, history } = props;
  const user = smartistUser[0].attrs;

  return (
    <div>
      <div
        style={{
          backgroundImage: `url(${
            user.displayPicture ? user.displayPicture : placeHolder
          })`,
          borderRadius: "50%",
          borderColor: "gray",
          border: "3px solid ",
          width: "100px",
          height: "100px",
          cursor: "pointer",
          backgroundSize: "cover",
        }}
      ></div>
      <div>{user.name ? user.name : "Anonymous Person"}</div>
      <div>{user.username}</div>
      <div>
        {user.isArtist ? (
          user.isArtist.boolean ? (
            <HandleIsArtist isArtistInfo={user.isArtist.info} />
          ) : null
        ) : null}

        {user.isArtUser ? (
          user.isArtUser.boolean ? (
            <HandleIsArtUser isArtUserInfo={user.isArtUser.info} />
          ) : null
        ) : null}
      </div>
      <br />
      <div>{user.websiteUrl ? user.websiteUrl : null}</div>
      <div>{user.description ? user.description : null}</div>

      <div>
        <button
          onClick={(e) => {
            e.preventDefault();
            if (user.isArtist) {
              if (user.isArtist.boolean) {
                history.push(`/studio/${user.username}`);
              } else {
                console.log("not an artist");
              }
            }
          }}
        >
          My Studio
        </button>
      </div>
    </div>
  );
}

function OtherUserProfile(props) {
  const {} = props;
  return <div></div>;
}

export default Profile;
