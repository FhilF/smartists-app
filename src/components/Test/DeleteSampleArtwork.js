import React, { useState, useEffect } from "react";

import { useConnect } from "@blockstack/connect";
import close from "../assets/icons/close.svg";

import { useBlockstack } from "react-blockstack";


function DeleteSampleArtwork(props) {
  const { activeAction, setActiveAction, studio, index } = props;
  const { userSession } = useBlockstack();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleDelete = () => {
    let artworks = studio.attrs.artworks;
    const artworkForDelete = studio.attrs.artworks[index];
    const result = /[^/]*$/.exec(artworkForDelete.image)[0];
    const file = "smartists/featuredArtwork/" + result;
    artworks.splice(index, 1);
    userSession
      .deleteFile(file)
      .then(
        (res) => {
          studio.update({
            artworks: artworks,
          });
          return studio.save();
        },
        (err) => {
          let error = JSON.stringify(err);
          error = JSON.parse(error);
          if (error.code === "file_not_found") {
            studio.update({
              artworks: artworks,
            });
            return studio.save();
          }else{
            throw err;
          }
        }
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div>
      <img
        className="action-button"
        src={close}
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
                  width: "600px",
                }}
              >
                <div style={{ padding: "20px" }}>
                  <div style={{ marginTop: "10px" }}>
                    <h4 style={{ margin: 0 }}>
                      Are you sure do you want to delete this?
                    </h4>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: "20px",
                    }}
                  >
                    <input
                      type="button"
                      value="No"
                      onClick={(e) => {
                        e.preventDefault();
                        handleModal();
                      }}
                    />
                    <input
                      type="button"
                      value="Yes"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete();
                      }}
                    />
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

export default DeleteSampleArtwork;
