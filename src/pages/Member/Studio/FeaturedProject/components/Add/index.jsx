import React, { useState, useEffect } from "react";

import { useAlert } from "react-alert";
import { ReactComponent as AddCollaborationProjectIcon } from "assets/svg-icon/AddCollaborationProjectIcon.svg";
import ProjectModal from "./ProjectModal";

function AddProject(props) {
  const {
    userSession,
    setIsLoading,
    signedInSmartistsUser,
    isModifyingProject,
    setProjects,
  } = props;

  const [openAddModal, setOpenAddModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [tempMediaUrls, setTempMediaUrls] = useState(null);
  const [handleDialog, setHandleDialog] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [other, setOther] = useState(false);
  const [dynamicInput, setDynamicInput] = useState([]);
  const [artistSkills, setArtistsSkills] = useState([
    { value: "Writing", status: false, isLookingFor: false },
    { value: "Visuals", status: false, isLookingFor: false },
    { value: "Music", status: false, isLookingFor: false },
    { value: "Performing", status: false, isLookingFor: false },
    { value: "Digital Editing", status: false, isLookingFor: false },
  ]);

  const [persons, setPersons] = useState([
    {
      value: "Funding",
      status: false,
      isLookingFor: false,
      isOtherOption: false,
    },
    {
      value: "Clients",
      status: false,
      isLookingFor: false,
      isOtherOption: false,
    },
    {
      value: "Ambassadors / Supporters",
      status: false,
      isLookingFor: false,
      isOtherOption: false,
    },
  ]);

  const [project, setProject] = useState({
    title: null,
    tagline: null,
    description: null,
    isListeningForAdvice: false,
    media: null,
  });

  const alert = useAlert();
  const handleModal = () => {
    var x = document.getElementsByTagName("BODY")[0];
    if (
      window.getComputedStyle(x).overflow === "visible" ||
      window.getComputedStyle(x).overflow === "auto"
    ) {
      document.body.style.overflow = "hidden";
    }
    setHandleDialog(!handleDialog);
  };

  useEffect(() => {
    if (!handleDialog) {
      document.body.style.overflow = "auto";
    }
  }, [handleDialog]);

  useEffect(() => {
    return () => {
      if (!handleDialog) {
        setArtistsSkills([
          { value: "Writing", status: false, isLookingFor: false },
          { value: "Visuals", status: false, isLookingFor: false },
          { value: "Music", status: false, isLookingFor: false },
          { value: "Performing", status: false, isLookingFor: false },
          { value: "Digital Editing", status: false, isLookingFor: false },
        ]);

        setPersons([
          {
            value: "Funding",
            status: false,
            isLookingFor: false,
            isOtherOption: false,
          },
          {
            value: "Clients",
            status: false,
            isLookingFor: false,
            isOtherOption: false,
          },
          {
            value: "Ambassadors / Supporters",
            status: false,
            isLookingFor: false,
            isOtherOption: false,
          },
        ]);

        setProject({
          title: null,
          tagline: null,
          description: null,
          isListeningForAdvice: false,
          media: null,
        });

        setTempMediaUrls(null);

        setDynamicInput([]);
        setOther(false);
      }
    };
  }, [handleDialog]);
  return (
    <>
      <div className="flex flex-col items-center justify-center px-16 py-14 border border-dashed rounded-lg border-red-900">
        <button
          onClick={(e) => {
            e.preventDefault();
            setOpenAddModal(true);
          }}
          disabled={formLoading || isModifyingProject}
        >
          <AddCollaborationProjectIcon className="cursor-pointer" />
        </button>
        {/* {isModifyingProject && (
          <Loader
            className="btn-loader"
            type="Oval"
            color="#00BFFF"
            height={25}
            width={25}
          />
        )} */}

        <ProjectModal
          project={project}
          open={openAddModal}
          setOpen={setOpenAddModal}
          signedInSmartistsUser={signedInSmartistsUser}
          setProjects={setProjects}
          // returnToStudioMain={returnToStudioMain}
          key={openAddModal}
        />
      </div>
    </>
  );
}

export default AddProject;
