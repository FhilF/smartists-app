import React, { useState } from "react";

import { useConnect } from "@blockstack/connect";

function ArtistForm(props) {
  const { profile, setProfile, formLoading } = props;
  const handleArtistSkill = (e) => {
    let newSkills = [...profile.isArtist.info.skills, e.target.value];
    if (profile.isArtist.info.skills.includes(e.target.value)) {
      newSkills = newSkills.filter((day) => day !== e.target.value);
    }
    setProfile({
      ...profile,
      isArtist: {
        ...profile.isArtist,
        info: { ...profile.isArtist.info, skills: newSkills },
      },
    });
  };

  const handleWorkDemand = (e) => {
    let result;
    if (e.target.value === "Yes") {
      result = true;
    } else {
      result = false;
    }

    setProfile({
      ...profile,
      isArtist: {
        ...profile.isArtist,
        info: { ...profile.isArtist.info, openWork: result },
      },
    });
  };

  const artistSkills = [
    "Writing",
    "Visuals",
    "Music",
    "Performing",
    "Digital Editing",
  ];
  return (
    <div id="artist-form">
      <div>
        <h4 className="component-header">
          Describe yourself as an Author or Artist
        </h4>
      </div>
      <div id="artist-skills">
        <p className="input-label mt-10">
          What is/are your skills?<span className="required">*</span>
        </p>
        <div className="checkbox-group mt-10">
          {artistSkills.map((skill, index) => {
            return (
              <div className="checkbox-root" key={index}>
                <input
                  type="checkbox"
                  id={"skills" + index}
                  name="artistSkills"
                  value={skill}
                  onChange={(e) => {
                    handleArtistSkill(e);
                  }}
                  disabled={formLoading}
                />
                <label htmlFor={"skills" + index}>{skill}</label>
                <br />
              </div>
            );
          })}
        </div>
      </div>

      <div id="artist-demand">
        <p className="input-label mt-10">
          Are you open to work on demand?<span className="required">*</span>
        </p>
        <div className="mt-10">
          <input
            type="radio"
            id="workDemandYes"
            name="workDemandOption"
            value="Yes"
            onChange={(e) => {
              handleWorkDemand(e);
            }}
            disabled={formLoading}
          />
          <label htmlFor="workDemandYes">Yes</label>
          <input
            type="radio"
            id="workDemandNo"
            name="workDemandOption"
            value="No"
            onChange={(e) => {
              handleWorkDemand(e);
            }}
            disabled={formLoading}
          />
          <label htmlFor="workDemandNo">No</label>
        </div>
      </div>
    </div>
  );
}

export default ArtistForm;
