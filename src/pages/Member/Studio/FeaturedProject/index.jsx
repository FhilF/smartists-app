import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getProjectAsync } from "utils/redux/slice/projectSlice";
import { isEmpty } from "lodash";

import FeaturedProjectComponent from "./components/Card";
import AddFeaturedProject from "./components/Add";
import { userSession } from "utils/stacks-util/auth";
import { useAlert } from "react-alert";

function FeaturedProject(props) {
  const {
    isSessionedUser,
    signedInSmartistsUser,
    setSignedInSmartistsUser,
    smartistsUserData,
  } = props;

  const alert = useAlert();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const [isModifyingProject, setIsModifyingProject] = useState(false);

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    dispatch(getProjectAsync({ studioId: smartistsUserData.Studio.id }))
      .unwrap()
      .then((res) => {
        // console.log(res)
        setProjects(res.Projects);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        alert.error("There was an error fetching your projects", {
          timeout: 5000,
        });
      });
  }, []);
  return (
    <div>
      <div className="mb-6">
        <h1 className=" text-slate-800 text-4xl font-bold text tracking-tight">
          Projects
        </h1>
      </div>

      {!isLoading && (
        <>
          <div className="mt-12 grid grid-cols-3 gap-6">
            {isSessionedUser && projects.length < 3 && (
              <AddFeaturedProject
                userSession={userSession}
                setIsLoading={setIsLoading}
                signedInSmartistsUser={signedInSmartistsUser}
                isModifyingProject={isModifyingProject}
                setProjects={setProjects}
              />
            )}
            {projects.length > 0 &&
              projects.map((el, i) => {
                return (
                  <FeaturedProjectComponent
                    key={i}
                    project={el}
                    isSessionedUser={isSessionedUser}
                    smartistsUserData={smartistsUserData}
                    index={i}
                    isModifyingProject={isModifyingProject}
                  />
                );
              })}
          </div>

          {projects.length === 0 && !isSessionedUser && (
            <div className="w-full flex justify-center mt-16">
              <h3 className="text-base text-gray-400">No projects available</h3>
            </div>
          )}
        </>
      )}

    </div>
  );
}

export default FeaturedProject;
