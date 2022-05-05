import React, { useEffect, useState } from "react";
import { ReactComponent as AddFeaturedArtWorkIcon } from "assets/svg-icon/AddFeaturedArtWorkIcon.svg";
import ArtworkTypeModal from "./ArtworkTypeModal";
import ArtworkModal from "./ArtworkModal";
import { userSession } from "utils/stacks-util/auth";
import { isValidURL } from "lib/data";
import { IoCloudUploadOutline } from "react-icons/io5";

function Index(props) {
  const { setSignedInSmartistsUser, setFeaturedWorks, smartistsUserData } =
    props;
  const [formLoading, setFormLoading] = useState(false);
  const [isModifyingFeaturedArtwork, setIsModifyingFeaturedArtwork] =
    useState(false);
  const [openTypeModal, setOpenTypeModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [tempMediaUrls, setTempMediaUrls] = useState(null);
  const [mediaType, setMediaType] = useState(null);

  // const [featuredWork, setFeaturedArtwork] = useState({
  //   media: { fileType: null, file: null, url: null },
  //   title: null,
  //   description: null,
  // });

  // const selectMediaType = (mediaType) => {
  //   setFeaturedArtwork({
  //     media: { fileType: mediaType, file: null, url: null },
  //     title: "",
  //     description: "",
  //   });
  //   setOpenTypeModal(false);
  //   setTimeout(function () {
  //     setOpenAddModal(true);
  //   }, 1000);
  // };

  useEffect(() => {
    return () => {
      if (tempMediaUrls) {
        window.URL.revokeObjectURL(tempMediaUrls);
      }
    };
  }, [tempMediaUrls]);

  return (
    <>
      <div className="flex flex-col items-center justify-center px-16 py-14 border border-dashed rounded-lg border-red-900">
        <button
          onClick={(e) => {
            e.preventDefault();
            setOpenTypeModal(true);
          }}
          disabled={formLoading || isModifyingFeaturedArtwork}
        >
          {/* <AddFeaturedArtWorkIcon className="cursor-pointer" /> */}
          <div className="text-center w-full">
            <div className="w-full flex justify-center">
              <h2 className="text-6xl text-red-900">
                <IoCloudUploadOutline />
              </h2>
            </div>
            <h4 className="text-lg 2xl:text-xl font-semibold leading-7">
              Publish Artwork
            </h4>
            <p className="mt-4 leading-7 font-normal text-gray-500">
              Publish a featured work or a NFT for sale. Privately or publicly
            </p>
          </div>
        </button>
      </div>
      <ArtworkTypeModal
        open={openTypeModal}
        setOpen={setOpenTypeModal}
        setMediaType={setMediaType}
        setOpenTypeModal={setOpenTypeModal}
        setOpenAddModal={setOpenAddModal}
      />
      <ArtworkModal
        mediaType={mediaType}
        setSignedInSmartistsUser={setSignedInSmartistsUser}
        smartistsUserData={smartistsUserData}
        open={openAddModal}
        setOpen={setOpenAddModal}
        setFeaturedWorks={setFeaturedWorks}
      />
    </>
  );
}

export default Index;
