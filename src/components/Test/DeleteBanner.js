import React, { useState } from "react";
import close from "../assets/icons/close.svg";
import { useBlockstack } from "react-blockstack";

function DeleteBanner(props) {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (studio.attrs.banner) {
      const bannerForDelete = studio.attrs.banner;
      const result = /[^/]*$/.exec(bannerForDelete)[0];
      const file = "smartists/studio-banner/" + result;
      userSession
        .deleteFile(file)
        .then(
          (res) => {
            studio.update({
              banner: null,
            });
            return studio.save();
          },
          (err) => {
            let error = JSON.stringify(err);
            error = JSON.parse(error);
            if (error.code === "file_not_found") {
              studio.update({
                banner: null,
              });
              return studio.save();
            } else {
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
    } else {
      console.log("nothing to delete");
    }
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
                  padding: "20px",
                }}
              >
                <div style={{ marginTop: "10px" }}>
                  <div className="modal-header">
                    <h4 style={{ margin: 0 }}>
                      Are you sure do you want to delete this?
                    </h4>
                  </div>
                  {/* <div className="modal-body"></div> */}
                  <div className="modal-action mt-20">
                    <input
                      type="button"
                      value="Cancel"
                      onClick={(e) => {
                        e.preventDefault();
                        handleModal();
                      }}
                    />
                    <input
                      type="button"
                      value="Submit"
                      onClick={(e) => {
                        handleSubmit(e);
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

export default DeleteBanner;
