import React, { useState, useEffect } from "react";

function CreateUI(props) {
  const { dynamicInput, setDynamicInput } = props;

  const handleRemove = (i) => {
    let values = [...dynamicInput];
    values.splice(i, 1);
    setDynamicInput([...values]);
  };

  const handleChange = (i, event) => {
    let values = [...dynamicInput];
    values[i].value = event.target.value;
    setDynamicInput([...values]);
  };

  return (
    <div>
      {dynamicInput.map((el, i) => (
        <div key={i}>
          <input
            type="text"
            value={el.value || ""}
            onChange={(e) => {
              handleChange(i, e);
            }}
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
  const { dynamicInput, setDynamicInput } = props;

  const AddInput = () => {
    setDynamicInput([
      ...dynamicInput,
      { value: "", status: false, isOtherOption: true },
    ]);
  };

  return (
    <div>
      <CreateUI dynamicInput={dynamicInput} setDynamicInput={setDynamicInput} />
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
