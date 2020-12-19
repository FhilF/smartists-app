import React, { useState, useEffect } from "react";

import DeleteSampleArtworkComponent from "./DeleteSampleArtwork";
import edit from "../assets/icons/edit.svg";

import placeHolder from "../assets/icons/placeholder-thumb.svg";

import classNames from "classnames";

function SampleArtwork(props) {
  const { index, artwork, studio } = props;
  const [activeAction, setActiveAction] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
    console.log("test");
  };
  return (
    <div>
      <div>
        <div>
          <div className="sample-artwork-container">
            <div
              style={{
                backgroundImage: `url(${
                  imageError ? placeHolder : artwork.image
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
              src={imageError ? placeHolder : artwork.image}
              onError={handleImageError}
              alt="alternative"
              style={{ display: "none" }}
            />

            <div
              className={classNames(
                "sample-artwork-action-container",
                activeAction ? "active" : null
              )}
            >
              <div className="sample-artwork-actions">
                <DeleteSampleArtworkComponent
                  setActiveAction={setActiveAction}
                  activeAction={activeAction}
                  studio={studio}
                  index={index}
                />
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <div>{artwork.title}</div>
            <div style={{ marginTop: "10px" }}>{artwork.description}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SampleArtwork;
