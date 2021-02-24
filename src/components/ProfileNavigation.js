import React, { useState } from "react";
import placeHolder from "../assets/images/avatar-placeholder.png";
import { ReactComponent as FolderIcon } from "../assets/svg-icon/FolderIcon.svg";
import { ReactComponent as PersonIcon } from "../assets/svg-icon/PersonIcon.svg";
import { ReactComponent as FacebookIcon } from "../assets/svg-icon/FacebookIcon.svg";
import { ReactComponent as TwitterIcon } from "../assets/svg-icon/TwitterIcon.svg";
import { ReactComponent as InstagramIcon } from "../assets/svg-icon/InstagramIcon.svg";
import { ReactComponent as WebsiteIcon } from "../assets/svg-icon/WebsiteIcon.svg";
import classNames from "classnames";

function ProfileNavigation(props) {
  const { history, userProfile, isPageLoading } = props;

  let smartistsUser = userProfile;

  const [tempImgUrls, setTempImgUrls] = useState();
  return (
    <div className="profile-nav-root">
      <div className="profile-image-root">
        <div
          style={{
            backgroundImage: `url(${tempImgUrls ? tempImgUrls : placeHolder})`,
          }}
          className="profile-display-picture"
        ></div>
        <div className="ml-10">
          <p className="p-paragraph-bold text-gray-800">
            {smartistsUser.name ? smartistsUser.name : "Anonymous Person"}
          </p>
          <p className="p-paragraph text-gray-600">{smartistsUser.username}</p>
        </div>
      </div>
      {isPageLoading ? null : (
        <div className="profile-navigation-root mt-30">
          <ul className="profile-navigation-list">
            <li
              className={classNames(
                "profile-navigation-item-root",
                history.location === `/member/${smartistsUser.username}`
                  ? "profile-navigation-item-active"
                  : null
              )}
            >
              <a
                className="profile-navigation-item"
                href={`/member/${smartistsUser.username}`}
                onClick={(e) => {
                  e.preventDefault();
                  history.push({
                    pathname: `/member/${smartistsUser.username}`,
                  });
                }}
              >
                <span className="profile-navigation-item-icon-root">
                  <FolderIcon className="profile-navigation-item-icon" />
                </span>
                <span className="profile-navigation-item-text-root">
                  Profile
                </span>
              </a>
            </li>
            <li
              className={classNames(
                "profile-navigation-item-root",
                history.location === `/member/${smartistsUser.username}/studio`
                  ? "profile-navigation-item-active"
                  : null
              )}
            >
              <a
                className="profile-navigation-item"
                href={`/member/${smartistsUser.username}/studio`}
                onClick={(e) => {
                  e.preventDefault();
                  history.push({
                    pathname: `/member/${smartistsUser.username}/studio`,
                  });
                }}
              >
                <span className="profile-navigation-item-icon-root">
                  <PersonIcon className="profile-navigation-item-icon" />
                </span>
                <span className="profile-navigation-item-text-root">
                  Studio
                </span>
              </a>
            </li>
          </ul>
        </div>
      )}
      <hr style={{ borderTop: "1.5px solid rgba(0, 0, 0, 0.1)" }} />

      {!isPageLoading && smartistsUser.isArtist.boolean && (
        <div className="mt-20">
          <div>
            <p
              className="component-header text-gray-800"
              style={{ fontSize: "1.1em" }}
            >
              Artist Info
            </p>
            <div className="mt-10">
              <div className="">
                <p className="p-paragraph text-gray-600">Skills as an artist</p>
                <ul className="list">
                  {smartistsUser.isArtist.info.skills.map((el, index) => {
                    return (
                      <li key={index} className="p-paragraph text-gray-900">
                        {el}
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="mt-10">
                <p className="p-paragraph text-gray-600">Open for work?</p>
                <p className="p-paragraph text-gray-800">
                  {smartistsUser.isArtist.info.openWork ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileNavigation;
