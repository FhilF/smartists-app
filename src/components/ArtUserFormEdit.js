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

  const handlePrimaryInterest = (e,i) => {
    const newPrimaryInterests = [...profile.isArtUser.info.primaryInterest];
    newPrimaryInterests[i].isChecked = !newPrimaryInterests[i].isChecked;
    setProfile({
      ...profile,
      isArtUser: {
        ...profile.isArtUser,
        info: {
          ...profile.isArtUser.info,
          primaryInterest: newPrimaryInterests,
        },
      },
    });
  };

  const majorInterest = ["Personal", "Professional", "Other"];

  

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
                  checked={interest === profile.isArtUser.info.majorInterest}
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
          {profile.isArtUser.info.primaryInterest.map((el, i) => {
            return (
              <div className="checkbox-root" key={i}>
                <input
                  type="checkbox"
                  id={"primaryInterest" + i}
                  name="primaryInterest"
                  value={el.value}
                  checked={el.isChecked}
                  onChange={(e) => {
                    handlePrimaryInterest(e, i);
                  }}
                  disabled={formLoading}
                />
                <label htmlFor={"primaryInterest" + i} className="text-sm font-normal text-gray-800 ml-2">{el.value}</label>
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
