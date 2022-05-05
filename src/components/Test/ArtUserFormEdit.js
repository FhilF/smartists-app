import React, { useState } from "react";

function ArtistForm(props) {
  const { member, setMember, formLoading } = props;
  const handleMajorInterest = (e) => {
    setMember({
      ...member,
      classification: {
        ...member.classification,
        isArtUser: {
          ...member.classification.isArtUser,
          info: { ...member.classification.isArtUser.info, majorInterest: e.target.value },
        },
      },
    });
  };

  const handlePrimaryInterest = (e, i) => {
    const newPrimaryInterests = [...member.classification.isArtUser.info.primaryInterest];
    newPrimaryInterests[i].isChecked = !newPrimaryInterests[i].isChecked;
    setMember({
      ...member,
      classification: {
        ...member.classification,
        isArtUser: {
          ...member.classification.isArtUser,
          info: {
            ...member.classification.isArtUser.info,
            primaryInterest: newPrimaryInterests,
          },
        },
      },
    });
  };

  const majorInterest = ["Personal", "Professional", "Other"];

  return (
    <div id="artuser-form art-form-item">
      <p className="text-lg font-semibold leading-7 text-gray-900">
        Describe yourself as an Art-user
      </p>
      <div id="artuser-major-interest">
        <p className="mt-3 text-sm font-medium leading-tight text-gray-700">
          Your major interest to to join Smartists?<span className=" text-red-900">*</span>
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
                  className="form-checkbox text-red-900"
                  checked={interest === member.classification.isArtUser.info.majorInterest}
                />
                <label
                  htmlFor={"majorInterest" + index}
                  className="text-sm font-normal text-gray-800 ml-2"
                >
                  {interest}
                </label>
                <br />
              </div>
            );
          })}
        </div>
      </div>

      <div id="artuser-primary-interest" className="mt-3">
        <p className="text-sm font-medium leading-tight text-gray-700">
          What is/are you primary interest(s)?<span className=" text-red-900">*</span>
        </p>
        <div className="checkbox-group mt-1">
          {member.classification.isArtUser.info.primaryInterest.map((interest, index) => {
            return (
              <div className="checkbox-root" key={index}>
                <input
                  type="checkbox"
                  id={"primaryInterest" + index}
                  name="primaryInterest"
                  value={interest.value}
                  onChange={(e) => {
                    handlePrimaryInterest(e, index);
                  }}
                  disabled={formLoading}
                  className="form-checkbox text-red-900"
                  checked={interest.isChecked}
                />
                <label
                  htmlFor={"primaryInterest" + index}
                  className="text-sm font-normal text-gray-800 ml-2"
                >
                  {interest.value}
                </label>
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
