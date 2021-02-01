import React, { useState, useEffect } from "react";

import ImagePlaceHolder from "../assets/images/mountain-placeholder.jpg";
import Button from "../customComponents/Button";
import PortfolioModel from "../models/Portfolio";
import ProjectModel from "../models/Project";
import { getMediaFile } from "../lib/media";
import AudioPlaceHolder from "../assets/images/audio-placeholder.jpg";

import "../scss/studio.scss";

import { fetchPortfolio } from "../utils/actions/portfolioAction";
import { fetchProject } from "../utils/actions/projectAction";
import { connect } from "react-redux";
import FeaturedProject from "./FeaturedProject";

function Studio(props) {
  const {
    userProfile,
    history,
    match,
    isUser,
    fetchPortfolio,
    fetchProject,
    fetchedPortfolio,
    fetchedProject,
    loadingPortfolio,
    loadingProject,
  } = props;

  const [isFetchingPortfolio, setIsFetchingPortfolio] = useState(true);
  const [portfolio, setPortfolio] = useState(null);
  const [isFetchingProject, setIsFetchingProject] = useState(true);
  const [project, setProject] = useState(null);

  const handlePortfolio = () => {
    setIsFetchingPortfolio(true);
    setIsFetchingProject(true);
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
        setIsFetchingPortfolio(false);
      })
      .catch((error) => {
        console.log(error);
        setIsFetchingPortfolio(false);
      });

    ProjectModel.fetchOwnList()
      .then((result) => {
        return Promise.all(
          result.map(async (el, i) => {
            return getMediaFile(match.params.username, el.attrs.fileName).then(
              (value) => {
                if (value) {
                  el.attrs.file = value;
                } else {
                  el.attrs.file = null;
                }
                // delete el.attrs.media["fileName"];
                return el;
              }
            );
          })
        );
      })
      .then((result) => {
        setProject(result);
        setIsFetchingProject(false);
      })
      .catch((error) => {
        console.log(error);
        setIsFetchingProject(false);
      });
  };

  useEffect(() => {
    if (isUser) {
      handlePortfolio();
    } else {
      const query = {
        studioId: userProfile.studio[0]._id,
      };
      if (fetchedPortfolio.length === 0) {
        fetchPortfolio(query);
      }

      if (fetchedProject.length === 0) {
        fetchProject(query);
      }
    }
  }, []);

  useEffect(() => {
    // console.log(portfolio);
  }, []);
  return (
    <div className="studio-root">
      <div className="user-featured-portfolio-root p-20 mb-20">
        <div className="pb-20">
          <h1 className="component-header" style={{ fontSize: "1.5rem" }}>
            Studio
          </h1>
          <p className="component-header-paragraph text-gray-500 mt-5">
            Welcome to your studio...
          </p>
        </div>
        {!loadingPortfolio && (
          <FeaturedPortfolio
            history={history}
            isUser={isUser}
            userProfile={userProfile}
            setIsFetchingPortfolio={setIsFetchingPortfolio}
            isFetchingPortfolio={isFetchingPortfolio}
            portfolio={portfolio}
            setPortfolio={setPortfolio}
            fetchedPortfolio={fetchedPortfolio}
            loadingPortfolio={loadingPortfolio}
          />
        )}

        {!loadingProject && (
          <FeaturedProjectStudio
            history={history}
            isUser={isUser}
            userProfile={userProfile}
            setIsFetchingProject={setIsFetchingProject}
            isFetchingProject={isFetchingProject}
            project={project}
            setProject={setProject}
            fetchedProject={fetchedProject}
            loadingProject={loadingProject}
          />
        )}
      </div>
    </div>
  );
}

const FeaturedPortfolio = (props) => {
  const {
    history,
    isUser,
    userProfile,
    isFetchingPortfolio,
    setIsFetchingPortfolio,
    portfolio,
    setPortfolio,
    fetchedPortfolio,
    loadingPortfolio,
  } = props;
  useEffect(() => {
    if (!isUser) {
      Promise.all(
        fetchedPortfolio.map(async (el, i) => {
          return getMediaFile(userProfile.username, el.media.fileName).then(
            (value) => {
              if (value) {
                el.media.file = value;
              } else {
                el.media.file = null;
              }
              // delete el.attrs.media["fileName"];
              return el;
            }
          );
        })
      )
        .then((result) => {
          setPortfolio(result);
          setIsFetchingPortfolio(false);
        })
        .catch((error) => {
          console.log(error);
          setIsFetchingPortfolio(false);
        });
    }
  }, []);
  return (
    <>
      <div className="header-container mt-20">
        <h1 className="component-header">Featured Portfolio</h1>
        <div>
          {/* <IconButton size="small" color="secondary">
      <EditOutlinedIcon className="svg-icon" />
    </IconButton> */}
          {isUser && (
            <Button
              color="secondary"
              link="featured-portfolio"
              onClick={(e) => {
                e.preventDefault();
                history.push(
                  `/profile/${userProfile.username}/featured-portfolio`
                );
              }}
            >
              Edit
            </Button>
          )}
        </div>
      </div>

      <div className="user-featured-portfolio-container mt-10">
        {isFetchingPortfolio ? (
          <>Loading</>
        ) : (
          portfolio.map((el, index) => {
            let portfolioEl;
            if ("attrs" in el) {
              portfolioEl = el.attrs;
            } else {
              portfolioEl = el;
            }
            return (
              <div className="grid-item card" key={index}>
                <div className="studio-featured-portfolio-item">
                  <div className="media-container">
                    {portfolioEl.media.fileType === "Image" && (
                      <div
                        className="studio-featured-media studio-featured-image"
                        style={{
                          backgroundImage: `url(${
                            portfolioEl.media.file
                              ? portfolioEl.media.file
                              : ImagePlaceHolder
                          })`,
                        }}
                      ></div>
                    )}

                    {portfolioEl.media.fileType === "Video" && (
                      <video
                        className="studio-featured-media studio-featured-video"
                        controls
                        controlsList="nodownload"
                        disablePictureInPicture
                      >
                        <source
                          src={portfolioEl.media.file}
                          type={portfolioEl.media.file.type}
                        />
                        Your browser does not support the video tag.
                      </video>
                    )}

                    {portfolioEl.media.fileType === "Audio" && (
                      <div
                        className="studio-featured-media studio-featured-audio"
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
                                src={portfolioEl.media.file}
                                type={portfolioEl.media.file.type}
                              />
                              Your browser does not support the video tag.
                            </audio>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-20 pt-10">
                    <p className="p-header-text text-gray-900">
                      {portfolioEl.title}
                    </p>
                    <p className="p-paragraph text-gray-600 mt-10">
                      {portfolioEl.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

const FeaturedProjectStudio = (props) => {
  const {
    history,
    isUser,
    userProfile,
    isFetchingProject,
    setIsFetchingProject,
    project,
    setProject,
    fetchedProject,
    loadingProject,
  } = props;

  useEffect(() => {
    if (!isUser) {
      Promise.all(
        fetchedProject.map(async (el, i) => {
          return getMediaFile(userProfile.username, el.fileName).then(
            (value) => {
              if (value) {
                el.file = value;
              } else {
                el.file = null;
              }
              // delete el.attrs.media["fileName"];
              return el;
            }
          );
        })
      )
        .then((result) => {
          console.log(result);
          setProject(result);
          setIsFetchingProject(false);
        })
        .catch((error) => {
          console.log(error);
          setIsFetchingProject(false);
        });
    }
  }, []);
  return (
    <div className="featured-project-root mb-20 mt-40">
      <div className="header-container mt-20">
        <h1 className="component-header">
          Projects In Progress looking for collaborators
        </h1>
        <div>
          {/* <IconButton size="small" color="secondary">
              <EditOutlinedIcon className="svg-icon" />
            </IconButton> */}
          {isUser && (
            <Button
              color="secondary"
              link="featured-project"
              onClick={(e) => {
                e.preventDefault();
                history.push(
                  `/profile/${userProfile.username}/featured-project`
                );
              }}
            >
              Add
            </Button>
          )}
        </div>
      </div>
      <div className="mt-10">
        {isFetchingProject ? (
          <>Loading</>
        ) : (
          project.map((el, index) => {
            let portfolioEl;
            if ("attrs" in el) {
              portfolioEl = el.attrs;
            } else {
              portfolioEl = el;
            }
            return (
              <div
                className="card featured-project-item bb mt-10 p-20"
                key={index}
                style={{ borderRadius: "4px" }}
              >
                <div className="row row-gap-5 bb">
                  <div className="media-container col-item col-12 col-lg-4 bb">
                    <div
                      className="featured-project featured-project-image"
                      style={{
                        backgroundImage: `url(${
                          portfolioEl.file ? portfolioEl.file : ImagePlaceHolder
                        })`,
                      }}
                    ></div>
                  </div>
                  <div className="col-item col-12 col-lg-8 bb">
                    <div className="header-w-controller">
                      <p className="p-text-bold text-gray-900 header-f">
                        {portfolioEl.title}
                      </p>
                    </div>
                    <p className="p-text text-secondary mt-5">
                      {portfolioEl.tagline}
                    </p>
                    <p className="p-paragraph text-gray-600 mt-5">
                      {portfolioEl.description}
                    </p>
                  </div>
                </div>
                <div>
                  <hr className="mt-20" />
                  <div style={{ display: "flex" }} className="">
                    <p className="p-paragraph text-gray-600">
                      For this project I am open to listen to the audience's
                      advice:
                    </p>
                    <p className="p-paragraph text-secondary">
                      &nbsp;
                      {portfolioEl.isListeningForAdvice ? (
                        <>&#10003;</>
                      ) : (
                        <>&#10005;</>
                      )}
                    </p>
                  </div>

                  <p className="p-paragraph text-gray-600 pt-10">
                    For this project I am looking for creative partners or
                    collaborators with the following skills:
                  </p>
                  <div className="p-paragraph text-gray-800">
                    <ul className="mt-5">
                      {portfolioEl.requiredSkills.map((skill, index) => {
                        return <li key={index}>{skill.value}</li>;
                      })}
                    </ul>
                  </div>

                  <p className="p-paragraph text-gray-600">
                    For this project I am also looking for:
                  </p>
                  <div className="p-paragraph text-gray-800">
                    <ul className="mt-5">
                      {portfolioEl.extraUsers.map((skill, index) => {
                        return <li key={index}>{skill.value}</li>;
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  fetchedPortfolio: state.portfolioReducer.portfolio,
  loadingPortfolio: state.portfolioReducer.loadingPortfolio,
  errorPortfolio: state.portfolioReducer.errorPortfolio,
  fetchedProject: state.projectReducer.project,
  loadingProject: state.projectReducer.loadingProject,
  errorProject: state.projectReducer.errorProject,
});
export default connect(mapStateToProps, {
  fetchPortfolio,
  fetchProject,
})(Studio);
