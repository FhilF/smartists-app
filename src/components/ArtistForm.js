import React, { useState } from "react";

import { useConnect } from "@blockstack/connect";

function ArtistForm(props) {
  const { profile, setProfile } = props;
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
    <div id="artist-form" style={{ margin: "0 10px 0 10px" }}>
      <div id="artist-skills">
        <p>Your skills?</p>
        {artistSkills.map((skill, index) => {
          return (
            <div key={index}>
              <input
                type="checkbox"
                id={"skills" + index}
                name="artistSkills"
                value={skill}
                onChange={(e) => {
                  handleArtistSkill(e);
                }}
              />
              <label htmlFor={"skills" + index}>{skill}</label>
              <br />
            </div>
          );
        })}
      </div>

      <div id="artist-demand">
        <br />
        <p>Are you open to work on demand?</p>
        <input
          type="radio"
          id="workDemandYes"
          name="workDemandOption"
          value="Yes"
          onChange={(e) => {
            handleWorkDemand(e);
          }}
        />
        <label htmlFor="workDemandYes">Yes</label>
        <br />
        <input
          type="radio"
          id="workDemandNo"
          name="workDemandOption"
          value="No"
          onChange={(e) => {
            handleWorkDemand(e);
          }}
        />
        <label htmlFor="workDemandNo">No</label>
        <br />
      </div>
    </div>
  );
}

export default ArtistForm;
