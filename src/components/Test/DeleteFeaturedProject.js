import React, { useState, useEffect } from "react";

function DeleteFeaturedProject(props) {
  const { activeAction, setActiveAction, featuredProject, userSession } = props;
  const [showForm, setShowForm] = useState(false);
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

  const handleDelete = async (e) => {
    e.preventDefault();
    console.log(featuredProject);
    const featturedProjectImageForDelete = featuredProject.attrs.image;
    const result = /[^/]*$/.exec(featturedProjectImageForDelete)[0];
    const file = "smartists/featuredProject/" + result;
    userSession
      .deleteFile(file)
      .then((res) => {
        return featuredProject.destroy();
      },
      (err) => {
        let error = JSON.stringify(err);
        error = JSON.parse(error);
        if (error.code === "file_not_found") {
          return featuredProject.destroy();
        }else{
          throw err;
        }
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
      <button
        className="action-button"
        onClick={(e) => {
          handleModal(e);
        }}
      >
        Delete
      </button>
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
                        handleDelete(e);
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

export default DeleteFeaturedProject;
