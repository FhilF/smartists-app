import React from "react";

import ImagePlaceHolder from "../assets/images/mountain-placeholder.jpg";
import IconButton from "../customComponents/IconButton";
import { ReactComponent as EditOutlinedIcon } from "../assets/svg-icon/EditOutlinedIcon.svg";
import { ReactComponent as AddOutlinedIcon } from "../assets/svg-icon/AddOutlinedIcon.svg";

import Button from "../customComponents/Button";

import AddPortfolioComponent from "./AddPortfolio"

function UserPortfolio() {
  return (
    <div className="portfolio-root">
      <div className="user-featured-portfolio-root card p-20 mb-20">
        <div className="header-container">
          <h1 className="component-header">Featured Portfolio</h1>
          <div>
            {/* <IconButton size="small" color="secondary">
              <EditOutlinedIcon className="svg-icon" />
            </IconButton> */}
            <Button color="secondary">Edit</Button>
          </div>
        </div>

        <div className="user-featured-portfolio-container mt-10">
          <div className="user-featured-portfolio-item p-10">
            <div className="user-featured-portfolio-item-image-root">
              <div
                className="user-featured-portfolio-item-image"
                style={{
                  backgroundImage: `url(${ImagePlaceHolder})`,
                }}
              ></div>
            </div>
            <div className="mt-10">
              <p className="p-header-text text-gray-900">
                What is Lorem Ipsum?
              </p>
              <p className="p-paragraph text-gray-600 mt-10">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
              </p>
            </div>
          </div>

          <div className="user-featured-portfolio-item p-10">
            <div className="user-featured-portfolio-item-image-root">
              <div
                className="user-featured-portfolio-item-image"
                style={{
                  backgroundImage: `url(${ImagePlaceHolder})`,
                }}
              ></div>
            </div>
            <div className="mt-10">
              <p className="p-header-text text-gray-900">
                What is Lorem Ipsum?
              </p>
              <p className="p-paragraph text-gray-600 mt-10">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
              </p>
            </div>
          </div>

          <div className="user-featured-portfolio-item p-10">
            <div className="user-featured-portfolio-item-image-root">
              <div
                className="user-featured-portfolio-item-image"
                style={{
                  backgroundImage: `url(${ImagePlaceHolder})`,
                }}
              ></div>
            </div>
            <div className="mt-10">
              <p className="p-header-text text-gray-900">
                What is Lorem Ipsum?
              </p>
              <p className="p-paragraph text-gray-600 mt-10">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="user-portfolio-root card p-20">
        <div className="header-container">
          <h1 className="component-header">My Portfolio</h1>
          <AddPortfolioComponent/>
        </div>
        <div className="user-portfolio-container mt-10">
          <div className="user-portfolio-item p-10">
            <div className="user-portfolio-image-root">
              <div
                className="user-portfolio-image"
                style={{
                  backgroundImage: `url(${ImagePlaceHolder})`,
                }}
              ></div>
            </div>
            <div className="mt-10">
              <p className="p-header-text text-gray-900">
                What is Lorem Ipsum?
              </p>
              <p className="p-paragraph text-gray-600 mt-10">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
              </p>
            </div>
          </div>

          <div className="user-portfolio-item p-10">
            <div className="user-portfolio-image-root">
              <div
                className="user-portfolio-image"
                style={{
                  backgroundImage: `url(${ImagePlaceHolder})`,
                }}
              ></div>
            </div>
            <div className="mt-10">
              <p className="p-header-text text-gray-900">
                What is Lorem Ipsum?
              </p>
              <p className="p-paragraph text-gray-600 mt-10">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
              </p>
            </div>
          </div>

          <div className="user-portfolio-item p-10">
            <div className="user-portfolio-image-root">
              <div
                className="user-portfolio-image"
                style={{
                  backgroundImage: `url(${ImagePlaceHolder})`,
                }}
              ></div>
            </div>
            <div className="mt-10">
              <p className="p-header-text text-gray-900">
                What is Lorem Ipsum?
              </p>
              <p className="p-paragraph text-gray-600 mt-10">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserPortfolio;
