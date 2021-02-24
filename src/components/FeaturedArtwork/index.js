import React from "react";

import imagePlaceHolder from "../../assets/images/mountain-placeholder.jpg";
import AudioPlaceHolder from "../../assets/images/audio-placeholder.jpg";
import DeleteFeaturedArtwork from "./Delete";

import IconButton from "../../customComponents/IconButton";

function FeaturedArtwork(props) {
  const {
    index,
    featuredArtwork,
    isUser,
    userSession,
    handleDeleteUpdateList,
    isModifyingFeaturedArtwork,
  } = props;
  const artwork = isUser ? featuredArtwork.attrs : featuredArtwork;
  return (
    <div className="bg-white card">
      <div className="relative">
        <div>
          {artwork.media.fileType === "Image" && (
            <div
              className="w-full h-52 bg-center bg-cover"
              style={{ backgroundImage: `url(${artwork.media.file})` }}
            ></div>
          )}

          {artwork.media.fileType === "Audio" && (
            <div className=" h-52  w-full" style={{ position: "relative" }}>
              <div
                className="h-full w-full bg-cover bg-center border-gray-400 border border-solid"
                style={{
                  backgroundImage: `url(${AudioPlaceHolder})`,
                }}
              ></div>
              <div className="absolute left-0 right-0 top-0 bottom-0">
                <div className="audio-container flex items-end w-full h-full">
                  <audio
                    className="w-full mx-4 h-10 mb-2 no-focus-media"
                    controls
                    controlsList="nodownload"
                  >
                    <source
                      src={artwork.media.file}
                      type={artwork.media.file.type}
                    />
                    Your browser does not support the video tag.
                  </audio>
                </div>
              </div>
            </div>
          )}

          {artwork.media.fileType === "Video" && (
            <video
              className="h-52 w-full border-gray-400 border border-solid no-focus-media"
              controls
              controlsList="nodownload"
            >
              <source src={artwork.media.file} type={artwork.media.file.type} />
              Your browser does not support the video tag.
            </video>
          )}

          <div className="p-4">
            <p className="font-semibold text-lg text-gray-800">
              {artwork.title}
            </p>
            <p className="font-normal text-sm text-gray-400 mt-4">
              {artwork.description}
            </p>
          </div>
        </div>
        {isUser && (
          <div className="absolute top-1 right-1">
            <DeleteFeaturedArtwork
              index={index}
              featuredArtwork={featuredArtwork}
              userSession={userSession}
              handleDeleteUpdateList={handleDeleteUpdateList}
              isModifyingFeaturedArtwork={isModifyingFeaturedArtwork}
            />
          </div>
          // <div className="absolute z-10">
          //   <div className="px-2 py-2">
          //     <div className="float-right">
          //       <DeleteFeaturedArtwork index={index} featuredArtwork={featuredArtwork} userSession={userSession} handleDeleteUpdateList={handleDeleteUpdateList} isModifyingFeaturedArtwork={isModifyingFeaturedArtwork}/>
          //     </div>
          //   </div>
          // </div>
        )}
      </div>
    </div>
  );
}

export default FeaturedArtwork;
