import React, { useEffect } from "react";
import SmartistsUser from "../../routes/SmartistsUser";
import classNames from "classnames";

import "../../styles/scss/studioLayout.scss";
import { isEmpty } from "lodash";

function StudioLayout(props) {
  const { children, location, history, match, smartistsMember, isUser } = props;
  useEffect(() => {}, []);
  return (
    <div>
      <div className="w-full h-72 2xl:h-96 bg-secondary"></div>
      <div className="relative max-w-screen-lg xl:max-w-screen-xl mx-auto">
        <div className="mt-6">
          <div className="text-center">
            <p className="text-gray-800 font-semibold text-2xl">
              {smartistsMember.name !== null
                ? smartistsMember.name
                : "Anonymous Person"}
            </p>
            <p className="text-gray-600 text-base mt-1 font-normal">
              {smartistsMember.username}
            </p>
            <ul className="text-secondary text-sm mt-1 inline-flex">
              {smartistsMember.isArtist.info.skills.map((el, index) => {
                return (
                  <li key={index} className="px-1">
                    {el}
                  </li>
                );
              })}
            </ul>
            <div className="flex justify-center mt-4">
              <p className="text-gray-400 text-sm font-normal w-3/4">
                {smartistsMember.description !== null
                  ? smartistsMember.description
                  : "This user has no description yet"}
              </p>
            </div>
          </div>
          {isUser && !isEmpty(smartistsMember.studio) || (!isUser)? (
            <div className="mt-10 flex justify-center">
              <div>
                <div>
                  <ul className="flex">
                    <li
                      className={classNames(
                        "px-4 text-gray-800 text-sm font-semibold",
                        location.pathname === match.url && "nav-button-active"
                      )}
                    >
                      <a
                        href=" #"
                        onClick={(e) => {
                          e.preventDefault();
                          history.push(`${match.url}`);
                        }}
                      >
                        Featured Artworks
                      </a>
                    </li>
                    <li
                      className={classNames(
                        "px-4 text-gray-800 text-sm font-semibold",
                        location.pathname === `${match.url}/project` &&
                          "nav-button-active"
                      )}
                    >
                      <a
                        href=" #"
                        onClick={(e) => {
                          e.preventDefault();
                          history.push(`${match.url}/project`);
                        }}
                      >
                        Project in Progress
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ) : null}
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

export default StudioLayout;
