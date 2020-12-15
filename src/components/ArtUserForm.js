import React, { useState } from "react";

import { useConnect } from "@blockstack/connect";

function ArtistForm(props) {
  const { profile, setProfile } = props;
  const handleMajorInterest = (e) => {
    setProfile({
      ...profile,
      isArtUser: {
        ...profile.isArtUser,
        info: { ...profile.isArtUser.info, majorInterest: e.target.value },
      },
    });
  };

  const handlePrimaryInterest = (e) => {
    let newPrimaryInterest = [...profile.isArtUser.info.primaryInterest, e.target.value];
    if (profile.isArtUser.info.primaryInterest.includes(e.target.value)) {
      newPrimaryInterest = newPrimaryInterest.filter((day) => day !== e.target.value);
    }
    setProfile({
      ...profile,
      isArtUser: {
        ...profile.isArtUser,
        info: { ...profile.isArtUser.info, primaryInterest: newPrimaryInterest },
      },
    });
  };

  const majorInterest = ["Personal", "Professional", "Other"];

  const primaryInterest = [
    "On demand Artists",
    "Creative Collaborations",
    "Licensed Art work files on sale",
    "Other",
  ];

  return (
    <div id="artuser-form" style={{ margin: "0 10px 0 10px" }}>
      <div id="artuser-major-interest">
        <p>Your major interest to to join Smartists?</p>
        {majorInterest.map((interest, index) => {
          return (
            <div key={index}>
              <input
                type="radio"
                id={"majorInterest" + index}
                name="majorInterest"
                value={interest}
                onChange={(e) => {
                  handleMajorInterest(e);
                }}
              />
              <label htmlFor={"majorInterest" + index}>{interest}</label>
              <br />
            </div>
          );
        })}
      </div>

      <div id="artuser-primary-interest">
        <p>What is/are you primary interest(s)?</p>
        {primaryInterest.map((interest, index) => {
          return (
            <div key={index}>
              <input
                type="checkbox"
                id={"primaryInterest" + index}
                name="primaryInterest"
                value={interest}
                onChange={(e) => {
                  handlePrimaryInterest(e);
                }}
              />
              <label htmlFor={"primaryInterest" + index}>{interest}</label>
              <br />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ArtistForm;
