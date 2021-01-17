import React, { useState, useEffect } from "react";

import { useConnect } from "@blockstack/connect";
import plusSign from "../assets/icons/plus.svg";
import placeHolderThumb from "../assets/icons/placeholder-thumb.svg";

import { handleMediaInputChange, handleCompress } from "../lib/image";

import { uploadFile } from "../lib/image";
function AddArtWork(props) {
  const { userSession, studio } = props;
  const [artwork, setArtwork] = useState({
    title: null,
    description: null,
    image: null,
  });

  const [file, setFile] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [tempImgUrls, setTempImgUrls] = useState();
  const [isCompressing, setIsCompressing] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);

  useEffect(() => {}, [isCompressing]);

  useEffect(() => {
    return () => {
      if (tempImgUrls) {
        window.URL.revokeObjectURL(tempImgUrls);
      }
    };
  }, [tempImgUrls]);

  function isEmpty(str) {
    if (!str || 0 === str.length || !str.trim()) {
      return null;
    }
    return str;
  }

  const handleModal = () => {
    var x = document.getElementsByTagName("BODY")[0];
    if (window.getComputedStyle(x).overflow === "visible") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }
    setShowForm(!showForm);
  };

  const handleSubmit = async () => {
    console.log(studio.attrs.artworks);
    setIsFormLoading(true);
    if (
      !isEmpty(artwork.title) ||
      !isEmpty(artwork.description) ||
      !artwork.image
    ) {
      console.log({ result: "error", info: "cannot be empty" });
      setIsFormLoading(false);
      return null;
    }

    handleCompress(artwork.image)
      .then((res) => {
        if (res.result === "success") {
          setIsCompressing(false);
          return uploadFile(
            userSession,
            "smartists/featuredArtwork",
            res.data,
            {
              encrypt: false,
            }
          );
        } else {
          setIsCompressing(false);
          throw res;
        }
      })
      .then((res) => {
        const data = {
          title: artwork.title,
          description: artwork.description,
          image: res,
        };
        const newArtworks = [...studio.attrs.artworks, data];
        studio.update({
          artworks: newArtworks,
        });

        return studio.save();
      })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
        setIsCompressing(false);
      });
  };

  return (
    <div>
      <div
        onClick={(e) => {
          e.preventDefault();
          handleModal();
        }}
        style={{
          border: "black 1px dashed",
          width: "180px",
          height: "180px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src={plusSign}
          alt="upload"
          style={{
            width: "50px",
            // backgroundColor: "#f5f4f4",
          }}
        />
      </div>

      {showForm ? (
        <div id="modal">
          <div className="modal-backdrop"></div>
          <div className="modal-content">
            <div className="modal-position">
              <div
                className="modal-paper"
                style={{
                  width: "800px",
                }}
              >
                <div style={{ padding: "20px" }}>
                  <div style={{ marginTop: "10px" }}>
                    <h4 style={{ margin: 0 }}>Add your artwork</h4>
                  </div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSubmit();
                    }}
                  >
                    <div style={{ display: "flex", marginTop: "10px" }}>
                      <div>
                        <div>
                          <input
                            accept="image/*,video/*"
                            style={{ display: "none" }}
                            id="raised-button-file"
                            type="file"
                            onChange={async (e) => {
                              setIsCompressing(true);
                              handleMediaInputChange(e, setIsCompressing)
                                .then((res) => {
                                  if (res.result === "success") {
                                    setTempImgUrls(res.data.compressedFile);
                                    setArtwork({
                                      ...artwork,
                                      image: res.data.rawFile,
                                    });
                                    setIsCompressing(false);
                                  } else {
                                    console.log(res);
                                    setIsCompressing(false);
                                  }
                                })
                                .catch((error) => {
                                  console.log();
                                  setIsCompressing(false);
                                });
                            }}
                          />
                          <label htmlFor="raised-button-file">
                            {tempImgUrls ? (
                              <div
                                style={{
                                  backgroundImage: `url(${tempImgUrls})`,
                                  width: "140px",
                                  height: "144px",
                                  cursor: "pointer",
                                  backgroundSize: "cover",
                                  backgroundPosition: "center",
                                }}
                              ></div>
                            ) : (
                              <img
                                src={plusSign}
                                alt="upload"
                                style={{
                                  width: "40px",
                                  padding: "50px",
                                  backgroundColor: "#f5f4f4",
                                }}
                              />
                            )}
                          </label>
                        </div>
                      </div>
                      <div
                        style={{
                          paddingLeft: "10px",
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <label htmlFor="title">Title</label>
                        <input
                          id="title"
                          value={artwork.title ? artwork.title : ""}
                          onChange={(e) => {
                            setArtwork({ ...artwork, title: e.target.value });
                          }}
                        />

                        <label htmlFor="description">Description</label>
                        <textarea
                          id="description"
                          name="description"
                          rows="4"
                          cols="50"
                          value={artwork.description ? artwork.description : ""}
                          onChange={(e) => {
                            setArtwork({
                              ...artwork,
                              description: e.target.value,
                            });
                          }}
                        ></textarea>
                      </div>
                    </div>
                    <div
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <input
                        type="button"
                        value="Cancel"
                        onClick={(e) => {
                          e.preventDefault();
                          handleModal();
                        }}
                      />
                      <input type="submit" value="Submit" />
                      {isCompressing ? <>loading</> : null}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default AddArtWork;
