import React, { useState } from "react";
import { ReactComponent as PencilIcon } from "../assets/svg-icon/PencilIcon.svg";
import ArtworkModal from "./FeaturedWork/Add/ArtworkModal";
import ProjectModal from "./Project/ProjectModal";

function EditButton({ type = 'artwork', artworkOrProject, returnToStudioMain }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div
        className="inline-flex space-x-2 items-center justify-center w-48 py-2 pl-2.5 pr-3 bg-white shadow border rounded-full border-gray-400 cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <PencilIcon />
        <p className="text-sm font-medium leading-none text-gray-900">Edit this {type}</p>
      </div>
      { type === 'artwork' ? (
        <ArtworkModal featuredArtwork={artworkOrProject} studioId={artworkOrProject.studioId} open={open} setOpen={setOpen} returnToStudioMain={returnToStudioMain} />
      ) : (
        <ProjectModal project={artworkOrProject} studioId={artworkOrProject.studioId} open={open} setOpen={setOpen} returnToStudioMain={returnToStudioMain} />
      )}
    </>
  )
}

export default EditButton;
