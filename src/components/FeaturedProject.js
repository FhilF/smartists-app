import React, { useState } from "react";

import placeHolder from "../assets/icons/placeholder-thumb.svg";

function FeaturedProject(props) {
  const { featuredProject, isSelf } = props;
  const data = isSelf ? featuredProject.attrs : featuredProject;
  const [imageError, setImageError] = useState(false);

  let requiredSkills = data.requiredSkills;
  const artistSkills = [
    "Writing",
    "Visuals",
    "Music",
    "Performing",
    "Digital Editing",
  ];
  requiredSkills = artistSkills.filter(function (x) {
    return requiredSkills.includes(x);
  });
  requiredSkills = requiredSkills.join(", ");

  console.log(data);
  let isLookingFor = data.isLookingFor;
  const persons = ["Funding", "Clients", "Ambassadors / Supporters", "Other"];

  isLookingFor = persons.filter(function (x) {
    return isLookingFor.includes(x);
  });
  isLookingFor = isLookingFor.join(", ");

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
      <div style={{ display: "flex", marginTop: "10px" }}>
        <div>
          <div
            style={{
              backgroundImage: `url(${imageError ? placeHolder : data.image})`,
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
        <p className="info mt-5">{requiredSkills}</p>
        <p className="info-label mt-20">
          For this project I am open to listen to the audience's advice
        </p>
        <p className="info mt-5">{isListeningToAdvice()}</p>
        <p className="info-label mt-20">
          For this project I am also looking for
        </p>
        <p className="info mt-5">{isLookingFor}</p>
      </div>
    </div>
  );
}

export default FeaturedProject;
