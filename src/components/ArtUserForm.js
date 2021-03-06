import React, { useState } from "react";

function ArtistForm(props) {
  const { profile, setProfile, formLoading } = props;
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
    let newPrimaryInterest = [
      ...profile.isArtUser.info.primaryInterest,
      e.target.value,
    ];
    if (profile.isArtUser.info.primaryInterest.includes(e.target.value)) {
      newPrimaryInterest = newPrimaryInterest.filter(
        (day) => day !== e.target.value
      );
    }
    setProfile({
      ...profile,
      isArtUser: {
        ...profile.isArtUser,
        info: {
          ...profile.isArtUser.info,
          primaryInterest: newPrimaryInterest,
        },
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
    <div id="artuser-form art-form-item">
      <div>
        <h4 className="text-lg font-semibold text-gray-800">Introduce yourself as an <span className="text-secondary">Art-user</span></h4>
      </div>
      <div id="artuser-major-interest">
        <p className="input-label mt-2 text-gray-600">
          Your major interest to to join Smartists?
          <span className="required">*</span>
        </p>
        <div className="checkbox-group mt-1">
          {majorInterest.map((interest, index) => {
            return (
              <div className="checkbox-root" key={index}>
                <input
                  type="radio"
                  id={"majorInterest" + index}
                  name="majorInterest"
                  value={interest}
                  onChange={(e) => {
                    handleMajorInterest(e);
                  }}
                  disabled={formLoading}
                />
                <label htmlFor={"majorInterest" + index} className="text-sm font-normal text-gray-800 ml-2">{interest}</label>
                <br />
              </div>
            );
          })}
        </div>
      </div>

      <div id="artuser-primary-interest">
        <p className="input-label mt-2 text-gray-600">
          What is/are you primary interest(s)?
          <span className="required">*</span>
        </p>
        <div className="checkbox-group mt-1">
          {primaryInterest.map((interest, index) => {
            return (
              <div className="checkbox-root" key={index}>
                <input
                  type="checkbox"
                  id={"primaryInterest" + index}
                  name="primaryInterest"
                  value={interest}
                  onChange={(e) => {
                    handlePrimaryInterest(e);
                  }}
                  disabled={formLoading}
                />
                <label htmlFor={"primaryInterest" + index} className="text-sm font-normal text-gray-800 ml-2">{interest}</label>
                <br />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ArtistForm;
