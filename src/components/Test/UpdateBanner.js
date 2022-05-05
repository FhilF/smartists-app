import React, { useState, useEffect } from "react";

import { useConnect } from "@blockstack/connect";

import edit from "../assets/icons/edit.svg";
import plusSign from "../assets/icons/plus.svg";

import { useBlockstack } from "react-blockstack";
import {
  handleMediaInputChange,
  handleCompress,
  uploadFile,
} from "../lib/image";

function UpdateBanner(props) {
  const { activeAction, setActiveAction, studio, index } = props;
  const {  } = useBlockstack();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tempImgUrls, setTempImgUrls] = useState();
  const [isCompressing, setIsCompressing] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [banner, setBanner] = useState(false);

  const handleModal = () => {
    var x = document.getElementsByTagName("BODY")[0];
    if (window.getComputedStyle(x).overflow === "visible" || window.getComputedStyle(x).overflow === "auto") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }

    setActiveAction(!activeAction);
    setShowForm(!showForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsFormLoading(true);
    const bannerForDelete = studio.attrs.banner;
    const result = /[^/]*$/.exec(bannerForDelete)[0];
    const file = "smartists/studio-banner/" + result;
    if (!banner) {
      console.log({ result: "error", info: "cannot be empty" });
      setIsFormLoading(false);
      return null;
    }

    if (studio.attrs.banner) {
      userSession
        .deleteFile(file)
        .then(
          (res) => {
            return handleCompress(banner);
          },
          (err) => {
            let error = JSON.stringify(err);
            error = JSON.parse(error);
            if (error.code === "file_not_found") {
              return handleCompress(banner);
            } else {
              throw err;
            }
          }
        )
        .then((res) => {
          if (res.result === "success") {
            setIsCompressing(false);
            return uploadFile(
              "smartists/studio-banner",
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
          studio.update({
            banner: res,
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
    } else {
      handleCompress(banner)
        .then((res) => {
          if (res.result === "success") {
            setIsCompressing(false);
            return uploadFile(
              "smartists/studio-banner",
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
          studio.update({
            banner: res,
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
    }
  };

  return (
    <div>
      <img
        className="action-button"
        src={edit}
        alt="close"
        onClick={(e) => {
          handleModal(e);
        }}
      />

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
                    <h4 style={{ margin: 0 }}>Update studio banner</h4>

                    <div className="mt-20">
                      <form
                        onSubmit={(e) => {
                          handleSubmit(e);
                        }}
                      >
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
                                    setBanner(res.data.rawFile);
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
                                  width: "100%",
                                  height: "300px",
                                  cursor: "pointer",
                                  backgroundSize: "cover",
                                  backgroundPosition: "center",
                                }}
                              ></div>
                            ) : (
                              <div
                                className="mt-20"
                                style={{
                                  border: "black 1px dashed",
                                  width: "100%",
                                  height: "300px",
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
                            )}
                          </label>
                        </div>

                        <div className="modal-action mt-20">
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
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default UpdateBanner;
