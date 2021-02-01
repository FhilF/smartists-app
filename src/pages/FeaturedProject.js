import React, { useState, useEffect } from "react";
import { useBlockstack } from "react-blockstack";

import AddProject from "../components/Project/AddProject";
import "../scss/featured-project.scss";
import ProjectModel from "../models/Project";
import { getMediaFile } from "../lib/media";
import ImagePlaceHolder from "../assets/images/mountain-placeholder.jpg";
import DeleteProject from "../components/Project/DeleteProject";
import UpdateProject from "../components/Project/UpdateProject";

import { MdMoreHoriz } from "react-icons/md";


function FeaturedProject(props) {
  const { userProfile, history, match, userStudio } = props;
  const { userSession } = useBlockstack();

  const [isfetching, setIsFetching] = useState(true);
  const [project, setProject] = useState(null);

  const handleProject = () => {
    setIsFetching(true);
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
        setIsFetching(false);
      })
      .catch((error) => {
        console.log(error);
        setIsFetching(false);
      });
  };

  useEffect(() => {
    handleProject();
  }, []);

  useEffect(() => {}, [isfetching]);

  return (
    <div className="page-root">
      <div className=" p-20 pb-40">
        <div className="header-w-controller">
          <h1 className="component-header header-f">
            Projects In Progress looking for collaborators
          </h1>
          {!isfetching && (
            <AddProject userSession={userSession} userStudio={userStudio[0]} />
          )}
        </div>

        <hr className="mt-40" />

        <div className="mt-20">
          <div>
            {isfetching ? (
              <>Loading</>
            ) : (
              <>
                {project.map((el, index) => {
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
                                el.attrs.file ? el.attrs.file : ImagePlaceHolder
                              })`,
                            }}
                          ></div>
                        </div>
                        <div className="col-item col-12 col-lg-8 bb">
                          <div className="header-w-controller">
                            <p className="p-text-bold text-gray-900 header-f">
                              {el.attrs.title}
                            </p>
                            {/* <DeletePortfolio
                          portfolio={el}
                          handlePortfolio={handlePortfolio} */}
                            {/* /> */}
                            <div style={{display:"flex"}}>
                              <UpdateProject projectOld={el}userSession={userSession} handleProject={handleProject}/>
                              <DeleteProject
                                project={el}
                                handleProject={handleProject}
                              />
                            </div>
                          </div>
                          <p className="p-text text-secondary mt-5">
                            {el.attrs.tagline}
                          </p>
                          <p className="p-paragraph text-gray-600 mt-5">
                            {el.attrs.description}
                          </p>
                        </div>
                      </div>
                      <div>
                        <hr className="mt-20" />
                        <div style={{ display: "flex" }} className="">
                          <p className="p-paragraph text-gray-600">
                            For this project I am open to listen to the
                            audience's advice:
                          </p>
                          <p className="p-paragraph text-secondary">
                            &nbsp;
                            {el.attrs.isListeningForAdvice ? (
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
                            {el.attrs.requiredSkills.map((skill, index) => {
                              return <li key={index}>{skill.value}</li>;
                            })}
                          </ul>
                        </div>

                        <p className="p-paragraph text-gray-600">
                          For this project I am also looking for:
                        </p>
                        <div className="p-paragraph text-gray-800">
                          <ul className="mt-5">
                            {el.attrs.extraUsers.map((skill, index) => {
                              return <li key={index}>{skill.value}</li>;
                            })}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeaturedProject;
