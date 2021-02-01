import React, { useState, useEffect } from "react";
import { useBlockstack } from "react-blockstack";

import AddArtworkComponent from "../components/Portfolio/AddArtwork";
import PortfolioModel from "../models/Portfolio";
import { getMediaFile } from "../lib/media";
import ImagePlaceHolder from "../assets/images/mountain-placeholder.jpg";
import DeletePortfolio from "../components/Portfolio/DeletePortfolio";
import AudioPlaceHolder from "../assets/images/audio-placeholder.jpg";

import "../scss/featured-portfolio.scss";
import { Profile } from "blockstack";

function FeaturedPortfolio(props) {
  const { userProfile, history, match, userStudio, isUser } = props;
  const { userSession } = useBlockstack();

  const [isfetching, setIsFetching] = useState(true);
  const [portfolio, setPortfolio] = useState(null);

  const handlePortfolio = () => {
    setIsFetching(true);
    PortfolioModel.fetchOwnList()
      .then((result) => {
        if (result.length > 3) {
          result = result.splice(0, 3);
        }

        return Promise.all(
          result.map(async (el, i) => {
            return getMediaFile(
              match.params.username,
              el.attrs.media.fileName
            ).then((value) => {
              if (value) {
                el.attrs.media.file = value;
              } else {
                el.attrs.media.file = null;
              }
              // delete el.attrs.media["fileName"];
              return el;
            });
          })
        );
      })
      .then((result) => {
        setPortfolio(result);
        setIsFetching(false);
      })
      .catch((error) => {
        console.log(error);
        setIsFetching(false);
      });
  };

  useEffect(() => {
    if (isUser) {
      handlePortfolio();
    }
  }, []);

  useEffect(() => {
    // console.log(portfolio)
  }, [portfolio]);
  return (
    <div className="page-root">
      <div className=" p-20 pb-40">
        <div className="header-w-controller">
          <h1 className="component-header header-f">Featured Portfolio</h1>
          {!isfetching && (
            <AddArtworkComponent
              userSession={userSession}
              userStudio={userStudio}
              handlePortfolio={handlePortfolio}
              portfolioList={portfolio}
            />
          )}
        </div>

        <hr className="mt-40"/>

        <div className="mt-20">
          <div>
            {isfetching ? (
              <>Loading</>
            ) : (
              <>
                {portfolio.map((el, index) => {
                  return (
                    <div
                      className="card row featured-portfolio-item row-gap-5 bb pt-20 pb-20 mt-10 pl-10 pr-10"
                      key={index}
                      style={{ borderRadius: "4px" }}
                    >
                      <div className="media-container col-item col-12 col-lg-4 bb">
                        {el.attrs.media.fileType === "Image" && (
                          <div
                            className="featured-portfolio featured-portfolio-image"
                            style={{
                              backgroundImage: `url(${
                                el.attrs.media.file
                                  ? el.attrs.media.file
                                  : ImagePlaceHolder
                              })`,
                            }}
                          ></div>
                        )}

                        {el.attrs.media.fileType === "Video" && (
                          <video
                            className="featured-portfolio featured-portfolio-video"
                            controls
                            controlsList="nodownload"
                            disablePictureInPicture
                          >
                            <source
                              src={el.attrs.media.file}
                              type={el.attrs.media.file.type}
                            />
                            Your browser does not support the video tag.
                          </video>
                        )}

                        {el.attrs.media.fileType === "Audio" && (
                          <div
                            className="featured-portfolio-audio "
                            style={{ position: "relative" }}
                          >
                            <div
                              className="audio-image-placeholder"
                              style={{
                                backgroundImage: `url(${AudioPlaceHolder})`,
                              }}
                            ></div>
                            <div className="portfolio-audio">
                              <div className="audio-container">
                                <audio
                                  className="audio-player"
                                  controls
                                  controlsList="nodownload"
                                >
                                  <source
                                    src={el.attrs.media.file}
                                    type={el.attrs.media.file.type}
                                  />
                                  Your browser does not support the video tag.
                                </audio>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="col-item col-12 col-lg-8 bb">
                        <div className="header-w-controller">
                          <p className="p-text-bold text-gray-900 header-f">
                            {el.attrs.title}
                          </p>
                          <DeletePortfolio
                            portfolio={el}
                            handlePortfolio={handlePortfolio}
                          />
                        </div>
                        <p className="p-paragraph text-gray-600 mt-10">
                          {el.attrs.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
          {/* <div className="row featured-portfolio-item row-gap-5 bb mt-20">
              <div className="media-container col-item col-12 col-lg-4 bb">
                <div
                  className="featured-portfolio-image"
                  style={{
                    backgroundImage: `url(${ImagePlaceHolder})`,
                  }}
                ></div>
              </div>
              <div className="col-item col-12 col-lg-8 bb">
                <p className="p-header-text text-gray-900">
                  What is Lorem Ipsum?
                </p>
                <p className="p-paragraph text-gray-600 mt-10">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </p>
              </div>
            </div>
                  <div></div> */}
        </div>
      </div>
    </div>
  );
}

export default FeaturedPortfolio;
