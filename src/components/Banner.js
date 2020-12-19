import React, { useState } from "react";

import EditBannerComponent from "./EditBanner";
import classNames from "classnames";

function Banner() {
  const [activeAction, setActiveAction] = useState(false);
  return (
    <div>
      <div className="banner-container" style={{ position: "relative" }}>
        <div
          style={{
            background: "#84170e",
            height: "300px",
          }}
        ></div>

        <div className={activeAction ? "active-banner" : "banner"}>
          <div>
            <div className="banner-actions">
              <EditBannerComponent
                setActiveAction={setActiveAction}
                activeAction={activeAction}
              />
              {/* <DeleteSampleArtworkComponent
                setActiveAction={setActiveAction}
                activeAction={activeAction}
                studio={studio}
                index={index}
              /> */}
              {/* <img className="svg-button" src={edit} alt="close" /> */}
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Banner;
