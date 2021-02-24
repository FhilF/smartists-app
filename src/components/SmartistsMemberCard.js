import React from "react";
import placeHolder from "../assets/images/avatar-placeholder.png";
import { isNil } from "lodash";

export default function SmartistsMemberCard(props) {
  const { smartistsMember } = props;
  const skills = (smartistsMember.isArtist.info.skills.toString()).replaceAll(",", " · ");
  return (
    <div className="card rounded-xl mt-4">
      <div className="p-4 pb-6 h-36">
        <div className="flex">
          <div
            className="rounded-full  w-16 h-16
                    bg-center bg-cover"
            style={{
              backgroundImage: `url(${placeHolder})`,
            }}
          ></div>
          <div className="flex-1 ml-4">
            <div className="flex items-center">
              <p className="font-semibold  text-base text-gray-800">
                {!isNil(smartistsMember.name)
                  ? smartistsMember.name
                  : "Anonymous Person"}
              </p>
              <p className="font-normal text-xs text-gray-400 ml-2">
                @{smartistsMember.username}
              </p>
            </div>

            <p className="font-semibold text-xs text-secondary mt-1">
              {skills}
            </p>
            <p className="font-normal text-xs text-gray-400 mt-2">
              {!isNil(smartistsMember.description)
                ? smartistsMember.description
                : "No available description"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
