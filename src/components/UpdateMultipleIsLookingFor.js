import React, { useState, useEffect } from "react";

function CreateUI(props) {
  const { newFeaturedProject, setNewFeaturedProject } = props;

  const handleRemove = (i) => {
    let values = [...newFeaturedProject.isLookingFor.otherOptions];
    values.splice(i, 1);
    setNewFeaturedProject({
      ...newFeaturedProject,
      isLookingFor: {
        ...newFeaturedProject.isLookingFor,
        otherOptions: [...values],
      },
    });
  };

  const handleChange = (i, event) => {
    let values = [...newFeaturedProject.isLookingFor.otherOptions];
    values[i].value = event.target.value;
    setNewFeaturedProject({
      ...newFeaturedProject,
      isLookingFor: {
        ...newFeaturedProject.isLookingFor,
        otherOptions: [...values],
      },
    });
  };

  const handleIsDoneLookingFor = (i) => {
    let values = [...newFeaturedProject.isLookingFor.otherOptions];
    values[i].status = !values[i].status;
    setNewFeaturedProject({
      ...newFeaturedProject,
      isLookingFor: {
        ...newFeaturedProject.isLookingFor,
        otherOptions: [...values],
      },
    });
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
      {newFeaturedProject.isLookingFor.otherOptions.map((el, i) => (
        <div key={i}>
          <input
            type="text"
            value={el.value || ""}
            onChange={(e) => {
              handleChange(i, e);
            }}
          />
          <input
            type="radio"
            id={"found-other-person" + i}
            name={"found-other-person" + i}
            value={true}
            onClick={(e) => {
              handleIsDoneLookingFor(i);
            }}
            onChange={(e) => {}}
            checked={el.status}
          />
          <input
            type="button"
            value="remove"
            onClick={(e) => {
              handleRemove(i);
            }}
          />
        </div>
      ))}
    </div>
  );
}

function AddMultipleIsLookingFor(props) {
  const { newFeaturedProject, setNewFeaturedProject } = props;
  const AddInput = () => {
    setNewFeaturedProject({
      ...newFeaturedProject,
      isLookingFor: {
        ...newFeaturedProject.isLookingFor,
        otherOptions: [
          ...newFeaturedProject.isLookingFor.otherOptions,
          { value: "", status: false, isOtherOption: true },
        ],
      },
    });
  };

  return (
    <div>
      <CreateUI
        newFeaturedProject={newFeaturedProject}
        setNewFeaturedProject={setNewFeaturedProject}
      />
      <input
        type="button"
        value="Add input"
        onClick={(e) => {
          e.preventDefault();
          AddInput();
        }}
      />
    </div>
  );
}

export default AddMultipleIsLookingFor;
