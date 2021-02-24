import React, { useState } from "react";

import { useConnect } from "@blockstack/connect";

function ArtistForm(props) {
  const { profile, setProfile, formLoading } = props;

  const handleArtistSkill = (e, i) => {
    const newSkills = [...profile.isArtist.info.skills];
    newSkills[i].isChecked = !newSkills[i].isChecked;
    setProfile({
      ...profile,
      isArtist: {
        ...profile.isArtist,
        info: { ...profile.isArtist.info, skills: newSkills },
      },
    });
  };

  
  return (
    <div id="artist-form art-form-item">
      <div>
        <h4 className="text-lg font-semibold text-gray-800">
          Describe yourself as an <span className="text-secondary">Author</span>{" "}
          or <span className="text-secondary">Artist</span>
        </h4>
      </div>
      <div id="artist-skills">
        <p className="input-label mt-2 text-gray-600">
          What is/are your skills?<span className="required">*</span>
        </p>
        <div className="checkbox-group mt-1">
          {profile.isArtist.info.skills.map((el, i) => {
            return (
              <div className="checkbox-root" key={i}>
                <input
                  type="checkbox"
                  id={"skills" + i}
                  name="artistSkills"
                  value={el.value}
                  checked={el.isChecked}
                  onChange={(e) => {
                    handleArtistSkill(e,i);
                  }}
                  disabled={formLoading}
                />
                <label
                  htmlFor={"skills" + i}
                  className="text-sm font-normal text-gray-800 ml-2"
                >
                  {el.value}
                </label>
                <br />
              </div>
            );
          })}
        </div>
      </div>

      <div id="artist-demand" className="mt-2">
        <input
          type="checkbox"
          id="term&agreements1"
          name="term&agreements1"
          checked={profile.isArtist.info.openWork}
          onChange={(e) => {
            setProfile({
              ...profile,
              isArtist: {
                ...profile.isArtist,
                info: {
                  ...profile.isArtist.info,
                  openWork: !profile.isArtist.info.openWork,
                },
              },
            });
          }}
          disabled={formLoading}
        />
        <label
          htmlFor="workDemandYes"
          className="ml-2 input-label mt-4 text-gray-600"
        >
          Are you open to work on demand?
        </label>
      </div>
    </div>
  );
}

export default ArtistForm;
