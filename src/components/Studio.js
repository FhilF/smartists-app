import React from "react";

import ImagePlaceHolder from "../assets/images/mountain-placeholder.jpg";

function Studio(props) {
  const {smartistsUser, history} = props;
  return (
    <div className="studio-root">
      <div className="studio-featured-portfolio-root card p-20">
        <h1 className="component-header">My Portfolio</h1>
        <div className="studio-featured-portfolio-container mt-30">
          <div className="studio-featured-portfolio-item mt-50">
            <div className="portfolio-about-root">
              <p className="p-header-text text-gray-900">
                What is Lorem Ipsum?
              </p>
              <p className="p-paragraph text-gray-600 mt-10">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.
              </p>
            </div>
            <div className="portfolio-image-root">
              <div
                className="portfolio-image"
                style={{
                  backgroundImage: `url(${ImagePlaceHolder})`,
                }}
              ></div>
            </div>
          </div>
          <div className="studio-featured-portfolio-item mt-50">
            <div className="portfolio-about-root">
              <p className="p-header-text text-gray-900">
                What is Lorem Ipsum?
              </p>
              <p className="p-paragraph text-gray-600 mt-10">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.
              </p>
            </div>
            <div className="portfolio-image-root invert">
              <div
                className="portfolio-image"
                style={{
                  backgroundImage: `url(${ImagePlaceHolder})`,
                }}
              ></div>
            </div>
          </div>
          <div className="studio-featured-portfolio-item mt-50">
            <div className="portfolio-about-root">
              <p className="p-header-text text-gray-900">
                What is Lorem Ipsum?
              </p>
              <p className="p-paragraph text-gray-600 mt-10">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.
              </p>
            </div>
            <div className="portfolio-image-root">
              <div
                className="portfolio-image"
                style={{
                  backgroundImage: `url(${ImagePlaceHolder})`,
                }}
              ></div>
            </div>
          </div>

          {/* Portfolio action */}
          <div className="featured-portfolio-action mt-20">
            <a
              className="profile-navigation-item"
              href={`/profile/${smartistsUser.username}#studio`}
              onClick={(e) => {
                e.preventDefault();
                history.push({
                  pathname: `/profile/${smartistsUser.username}`,
                  hash: "#view-portfolio",
                });
              }}
            >
              View Portfolio
            </a>
          </div>
        </div>
      </div>

      {/* Studio Featured Projects start */}

      <div className="studio-featured-project-root card p-20 mt-20">
        <div>
          <h1 className="component-header">Featured Projects</h1>
        </div>
        <div className="mt-40">content</div>
      </div>

      {/* Studio Featured Projects end */}
    </div>
  );
}

export default Studio;
