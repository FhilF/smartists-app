import React, { useState, useEffect } from "react";

import classNames from "classnames";

import placeHolder from "../assets/icons/placeholder-thumb.svg";
import EditFeaturedProjectComponent from "./EditFeaturedProject";
import DeleteFeaturedProjectComponent from "./DeleteFeaturedProject";

function FeaturedProject(props) {
  const { featuredProject, isSelf, userSession } = props;
  const data = isSelf ? featuredProject.attrs : featuredProject;
  const [imageError, setImageError] = useState(false);

  const [activeAction, setActiveAction] = useState(false);

  useEffect(() => {
    console.log(data);
  }, [data]);

  //requiredSkills
  let requiredSkills = data.requiredSkills;
  let newRequiredSkill = [];

  const artistSkills = [
    "Writing",
    "Visuals",
    "Music",
    "Performing",
    "Digital Editing",
  ];

  artistSkills.forEach((artistSkill, i) => {
    requiredSkills.forEach((requiredSkill, i) => {
      if (artistSkill === requiredSkill.skill) {
        newRequiredSkill = [...newRequiredSkill, requiredSkill];
      }
    });
  });

  //isLookingFor
  let isLookingFor = data.isLookingFor;
  let newIsLookingFor = [];
  let isLookingForModified = [];
  let isLookingForOtherModified = [];

  const persons = ["Funding", "Clients", "Ambassadors / Supporters"];

  persons.forEach((person, i) => {
    isLookingFor.forEach((isLookingFor, i) => {
      if (person === isLookingFor.option) {
        isLookingForModified = [...isLookingForModified, isLookingFor];
      }
    });
  });

  isLookingForOtherModified = isLookingFor.filter(
    (e) => !isLookingForModified.includes(e)
  );

  newIsLookingFor = [...isLookingForModified, ...isLookingForOtherModified];

  function isListeningToAdvice() {
    if (data.isListeningForAdvice) {
      return "Yes";
    } else {
      return "No";
    }
  }

  const handleImageError = () => {
    setImageError(true);
    console.log("test");
  };
  return (
    <div className="mt-30">
      <div className="featured-project-container">
        <div style={{ display: "flex", marginTop: "10px" }}>
          <div>
            <div
              style={{
                backgroundImage: `url(${
                  imageError ? placeHolder : data.image
                })`,
                width: "180px",
                height: "180px",
                cursor: "pointer",
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
              }}
            ></div>
            <img
              src={imageError ? placeHolder : data.image}
              onError={handleImageError}
              alt="alternative"
              style={{ display: "none" }}
            />
          </div>
          <div
            style={{
              paddingLeft: "10px",
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h1 className="no-m">{data.title}</h1>
            <p className="info-label mt-10">Tagline</p>
            <p className="info">{data.tagline}</p>
            <p className="info-label">Description</p>
            <p className="info">{data.description}</p>
          </div>
        </div>
        <div>
          <p className="info-label mt-20">
            For this project I am looking for creative partners or collaborators
            with the following skills
          </p>
          <div>
            <ul>
              {newRequiredSkill.map((requiredSkill, index) => {
                return <li key={index}>{requiredSkill.skill}</li>;
              })}
            </ul>
          </div>
          {/* <p className="info mt-5">{requiredSkills}</p> */}
          <p className="info-label mt-20">
            For this project I am open to listen to the audience's advice
          </p>
          <p className="info mt-5">{isListeningToAdvice()}</p>
          <p className="info-label mt-20">
            For this project I am also looking for
          </p>
          <div>
            <ul>
              {newIsLookingFor.map((isLookingFor, index) => {
                return <li key={index}>{isLookingFor.option}</li>;
              })}
            </ul>
          </div>
        </div>

        <div
          className={classNames(
            "featured-project-action-container",
            activeAction ? "active" : null
          )}
        >
          <div className="featured-project-actions">
            <EditFeaturedProjectComponent
              activeAction={activeAction}
              setActiveAction={setActiveAction}
              featuredProject={featuredProject}
              userSession={userSession}
            />
            <DeleteFeaturedProjectComponent
              activeAction={activeAction}
              setActiveAction={setActiveAction}
              featuredProject={featuredProject}
              userSession={userSession}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeaturedProject;
