import React, { useState } from "react";
import placeHolder from "../assets/images/avatar-placeholder.png";
import { ReactComponent as FolderOpenOutlinedIcon } from "../assets/svg-icon/FolderOpenOutlinedIcon.svg";
import { ReactComponent as PersonOutlinedIcon } from "../assets/svg-icon/PersonOutlinedIcon.svg";
import { ReactComponent as FacebookIcon } from "../assets/svg-icon/FacebookIcon.svg";
import { ReactComponent as TwitterIcon } from "../assets/svg-icon/TwitterIcon.svg";
import { ReactComponent as InstagramIcon } from "../assets/svg-icon/InstagramIcon.svg";
import { ReactComponent as WebsiteIcon } from "../assets/svg-icon/WebsiteIcon.svg";
import classNames from "classnames";

function ProfileNavigation(props) {
  const { history, userProfile, isPageLoading } = props;

  const smartistsUser = userProfile.smartistsUser;

  const [tempImgUrls, setTempImgUrls] = useState();
  return (
    <div className="profile-root">
      <div className="card pb-20">
        <div className="profile-image-root">
          <div className="profile-banner"></div>
          <div
            style={{
              backgroundImage: `url(${
                tempImgUrls ? tempImgUrls : placeHolder
              })`,
            }}
            className="profile-display-picture"
          ></div>
        </div>
        <div className="p-20 pt-10 pb-10">
          <div className="profile-information mt-30">
            <p className="profile-name">Anonymous Person</p>
            <h1 className="profile-username text-gray-800">@fenrir09.id.blockstack</h1>
          </div>
          <div className="mt-10">
            <p className="p-subtext text-gray-500">
              {isPageLoading ? "" : smartistsUser.description}
            </p>

            <div className="mt-10">
              <p className="p-paragraph text-secondary">
                {isPageLoading ? "" : smartistsUser.description}
              </p>
            </div>
          </div>
        </div>

        <div className="pl-20 pr-20">
          <hr />
        </div>

        {isPageLoading ? null : (
          <div className="profile-navigation-root">
            <ul className="profile-navigation-list">
              <li
                className={classNames(
                  "profile-navigation-item-root",
                  history.location === `/profile/${smartistsUser.username}`
                    ? "profile-navigation-item-active"
                    : null
                )}
              >
                <a
                  className="profile-navigation-item"
                  href={`/profile/${smartistsUser.username}`}
                  onClick={(e) => {
                    e.preventDefault();
                    history.push({
                      pathname: `/profile/${smartistsUser.username}`,
                    });
                  }}
                >
                  <span className="profile-navigation-item-icon-root">
                    <PersonOutlinedIcon className="profile-navigation-item-icon" />
                  </span>
                  <span className="profile-navigation-item-text-root">
                    Profile
                  </span>
                </a>
              </li>
              <li
                className={classNames(
                  "profile-navigation-item-root",
                  history.location ===
                    `/profile/${smartistsUser.username}/studio`
                    ? "profile-navigation-item-active"
                    : null
                )}
              >
                <a
                  className="profile-navigation-item"
                  href={`/profile/${smartistsUser.username}/studio`}
                  onClick={(e) => {
                    e.preventDefault();
                    history.push({
                      pathname: `/profile/${smartistsUser.username}/studio`,
                    });
                  }}
                >
                  <span className="profile-navigation-item-icon-root">
                    <FolderOpenOutlinedIcon className="profile-navigation-item-icon" />
                  </span>
                  <span className="profile-navigation-item-text-root">
                    Studio
                  </span>
                </a>
              </li>
            </ul>
          </div>
        )}

        {/* <div className="pl-20 pr-20">
          <hr />
        </div> */}

        {/* <div className="profile-social-root pl-20 pr-20">
          <div>
            <ul className="profile-social list">
              <li className="profile-social-item p-paragraph text-gray-600">
                <span className="profile-social-item-icon-root">
                  <WebsiteIcon className="profile-social-item-icon" />
                </span>
                <span>test</span>
              </li>
              <li className="profile-social-item p-paragraph text-gray-600">
                <span className="profile-social-item-icon-root">
                  <FacebookIcon className="profile-social-item-icon" />
                </span>
                <span>test</span>
              </li>
              <li className="profile-social-item p-paragraph text-gray-600">
                <span className="profile-social-item-icon-root">
                  <TwitterIcon className="profile-social-item-icon" />
                </span>
                <span>test</span>
              </li>
              <li className="profile-social-item p-paragraph text-gray-600">
                <span className="profile-social-item-icon-root">
                  <InstagramIcon className="profile-social-item-icon" />
                </span>
                <span>test</span>
              </li>
            </ul>
          </div>
        </div> */}
      </div>
      <div className="card mt-20 p-20">
        <div>
          <p
            className="component-header text-secondary"
            style={{ fontSize: "1.1em" }}
          >
            Artist Info
          </p>
          <div className="mt-10">
            <div className="mt-20">
              <p className="p-paragraph text-gray-600">Skills as an artist</p>
              <ul className="list">
                {isPageLoading
                  ? null
                  : smartistsUser.isArtist.info.skills.map((el, index) => {
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
                {isPageLoading
                  ? null
                  : smartistsUser.isArtist.info.openWork
                  ? "Yes"
                  : "No"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-20 p-20">
        <div>
          <p
            className="component-header text-secondary"
            style={{ fontSize: "1.1em" }}
          >
            Artuser Info
          </p>
          <div className="mt-10">
            <div className="mt-20">
              <p className="p-paragraph text-gray-600">Major Interest</p>
              <p className="p-paragraph text-gray-800">
                {isPageLoading
                  ? null
                  : smartistsUser.isArtUser.info.majorInterest}
              </p>
            </div>
            <div className="mt-10">
              <p className="p-paragraph text-gray-600">Skills as an artist</p>
              <div className="mt-5">
                <ul className="list">
                  {isPageLoading
                    ? null
                    : smartistsUser.isArtUser.info.primaryInterest.map(
                        (el, index) => {
                          return (
                            <li
                              key={index}
                              className="p-paragraph text-gray-800"
                            >
                              {el}
                            </li>
                          );
                        }
                      )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileNavigation;
