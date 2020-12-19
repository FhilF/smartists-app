import React, { useState, useEffect } from "react";

import { useConnect } from "@blockstack/connect";
import close from "../assets/icons/close.svg";

import { useBlockstack } from "react-blockstack";

function DeleteSampleArtwork(props) {
  const { activeAction, setActiveAction, studio, index } = props;
  const { userSession } = useBlockstack();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleForm = () => {
    setActiveAction(!activeAction);
    setShowForm(!showForm);
  };

  const handleDelete = () => {
    let artworks = studio.attrs.artworks;
    const artworkForDelete = studio.attrs.artworks[index];
    const result = /[^/]*$/.exec(artworkForDelete.image)[0];
    const file = "smartists/featuredArtwork/" + result;
      
    userSession
      .deleteFile(file)
      .then((res) => {
        console.log(res);
        studio.update({
          artworks: artworks,
        });
        return studio.save();
      })
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
          handleForm(e);
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
                        handleForm();
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
