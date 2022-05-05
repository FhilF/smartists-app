import React, { useState } from "react";

import UpdateBannerComponent from "./UpdateBanner";
import DeleteBannerComponent from "./DeleteBanner";
import classNames from "classnames";
import placeHolder from "../assets/icons/placeholder-thumb.svg";

function Banner(props) {
  const { studio, isSelf, userSession } = props;
  const [activeAction, setActiveAction] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div>
      <div className="banner-container">
        <div
          className="banner"
          style={{
            background: `${
              imageError
                ? "#84170e"
                : studio.attrs.banner
                ? "url(" + studio.attrs.banner + ") center center / cover"
                : "#84170e"
            }`,
          }}
        ></div>
        <img
          src={imageError ? placeHolder : studio.banner}
          onError={handleImageError}
          alt="alternative"
          className="dummy-image"
        />

        <div
          className={classNames(
            "banner-action-container",
            activeAction ? "active" : null
          )}
        >
          <div className="banner-actions">
            <UpdateBannerComponent
              setActiveAction={setActiveAction}
              activeAction={activeAction}
              studio={studio}
            />
            <DeleteBannerComponent
              setActiveAction={setActiveAction}
              activeAction={activeAction}
              studio={studio}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Banner;
