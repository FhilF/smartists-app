import React, { useState } from "react";

function ArtistForm(props) {
  const { member, setMember, formLoading } = props;
  const handleArtistSkill = (e) => {
    let newSkills = [
      ...member.classification.isArtist.info.skills,
      e.target.value,
    ];
    if (member.classification.isArtist.info.skills.includes(e.target.value)) {
      newSkills = newSkills.filter((day) => day !== e.target.value);
    }
    setMember({
      ...member,
      classification: {
        ...member.classification,
        isArtist: {
          ...member.classification.isArtist,
          info: { ...member.classification.isArtist.info, skills: newSkills },
        },
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

    setMember({
      ...member,
      isArtist: {
        ...member.classification.isArtist,
        info: { ...member.classification.isArtist.info, openWork: result },
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
    <div id="artist-form art-form-item">
      <div>
        <p className="text-lg font-semibold leading-7 text-gray-900">
          Describe yourself as an Author or Artist
        </p>
      </div>
      <div id="artist-skills">
        <p className="mt-3 text-sm font-medium leading-tight text-gray-700">
          Your skills as an artist<span className=" text-red-900">*</span>
        </p>
        <div className="checkbox-group mt-1">
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
                  className="form-checkbox text-red-900"
                />
                <label
                  htmlFor={"skills" + index}
                  className="text-sm font-normal text-gray-800 ml-2"
                >
                  {skill}
                </label>
                <br />
              </div>
            );
          })}
        </div>
      </div>

      <div id="artist-demand" className="mt-3">
        <p className="text-sm font-medium leading-tight text-gray-700">
          Work on demand
        </p>
        <input
          type="checkbox"
          id="term&agreements1"
          name="term&agreements1"
          checked={member.classification.isArtist.info.openWork}
          onChange={(e) => {
            setMember({
              ...member,

              classification: {
                ...member.classification,
                isArtist: {
                  ...member.classification.isArtist,
                  info: {
                    ...member.classification.isArtist.info,
                    openWork: !member.classification.isArtist.info.openWork,
                  },
                },
              },
            });
          }}
          disabled={formLoading}
          className="form-checkbox text-red-900"
        />
        <label
          htmlFor="workDemandYes"
          className="text-sm font-normal text-gray-800 ml-2"
        >
          Open to work on demand
        </label>
      </div>
    </div>
  );
}

export default ArtistForm;
