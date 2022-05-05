import React, { useState } from "react";
import placeHolder from "../assets/images/avatar-placeholder.png";
import { ReactComponent as FolderIcon } from "../assets/svg-icon/FolderIcon.svg";
import { ReactComponent as PersonIcon } from "../assets/svg-icon/PersonIcon.svg";
import { ReactComponent as FacebookIcon } from "../assets/svg-icon/FacebookIcon.svg";
import { ReactComponent as TwitterIcon } from "../assets/svg-icon/TwitterIcon.svg";
import { ReactComponent as InstagramIcon } from "../assets/svg-icon/InstagramIcon.svg";
import { ReactComponent as WebsiteIcon } from "../assets/svg-icon/WebsiteIcon.svg";
import classNames from "classnames";
import { isEmpty } from "lodash";

function MemberNavigation(props) {
  const { history, userMember, isPageLoading } = props;

  let smartistsUser = userMember;

  const [tempImgUrls, setTempImgUrls] = useState();
  return (
    <div className="member-nav-root">
      <div className="member-image-root">
        <div
          style={{
            backgroundImage: `url(${tempImgUrls ? tempImgUrls : placeHolder})`,
          }}
          className="member-display-picture"
        ></div>
        <div className="ml-10">
          <p className="p-paragraph-bold text-gray-800">
            {smartistsUser.name ? smartistsUser.name : "Anonymous Person"}
          </p>
          <p className="p-paragraph text-gray-600">{smartistsUser.username}</p>
        </div>
      </div>
      {isPageLoading ? null : (
        <div className="member-navigation-root mt-30">
          <ul className="member-navigation-list">
            <li
              className={classNames(
                "member-navigation-item-root",
                history.location ===
                  `/${
                    !isEmpty(smartistsUser) &&
                    smartistsUser.hasOwnProperty("username") &&
                    smartistsUser.username
                      ? `@${smartistsUser[0].attrs.username}`
                      : smartistsUser.identityAddress
                  }`
                  ? "member-navigation-item-active"
                  : null
              )}
            >
              <a
                className="member-navigation-item"
                href={`/${
                  !isEmpty(smartistsUser) &&
                  smartistsUser.hasOwnProperty("username") &&
                  smartistsUser.username
                    ? `@${smartistsUser[0].attrs.username}`
                    : smartistsUser.identityAddress
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  history.push({
                    pathname: `/${
                      !isEmpty(smartistsUser) &&
                      smartistsUser.hasOwnProperty("username") &&
                      smartistsUser.username
                        ? `@${smartistsUser[0].attrs.username}`
                        : smartistsUser.identityAddress
                    }`,
                  });
                }}
              >
                <span className="member-navigation-item-icon-root">
                  <FolderIcon className="member-navigation-item-icon" />
                </span>
                <span className="member-navigation-item-text-root">
                  Member
                </span>
              </a>
            </li>
            <li
              className={classNames(
                "member-navigation-item-root",
                history.location ===
                  `/${
                    !isEmpty(smartistsUser) &&
                    smartistsUser.hasOwnProperty("username") &&
                    smartistsUser.username
                      ? `@${smartistsUser[0].attrs.username}`
                      : smartistsUser.identityAddress
                  }/studio`
                  ? "member-navigation-item-active"
                  : null
              )}
            >
              <a
                className="member-navigation-item"
                href={`/${
                  !isEmpty(smartistsUser) &&
                  smartistsUser.hasOwnProperty("username") &&
                  smartistsUser.username
                    ? `@${smartistsUser[0].attrs.username}`
                    : smartistsUser.identityAddress
                }/studio`}
                onClick={(e) => {
                  e.preventDefault();
                  history.push({
                    pathname: `/${
                      !isEmpty(smartistsUser) &&
                      smartistsUser.hasOwnProperty("username") &&
                      smartistsUser.username
                        ? `@${smartistsUser[0].attrs.username}`
                        : smartistsUser.identityAddress
                    }/studio`,
                  });
                }}
              >
                <span className="member-navigation-item-icon-root">
                  <PersonIcon className="member-navigation-item-icon" />
                </span>
                <span className="member-navigation-item-text-root">
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

export default MemberNavigation;
