import React, { useState, useEffect } from "react";
import StandardInput from "../../customComponents/StandardInput";
import Button from "../../customComponents/Button";

function CreateUI(props) {
  const { dynamicInput, setDynamicInput, formLoading } = props;

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
        <div key={i} style={{ display: "flex" }}>
          <div className="col-md-8">
            <StandardInput
              className=""
              id="image-title"
              value={el.value || ""}
              onChange={(e) => {
                handleChange(i, e);
              }}
              autoComplete="off"
              disabled={formLoading}
              style={{ marginTop: 0 }}
            />
          </div>
          <Button
            variant="contained"
            className="mt-5 ml-10"
            onClick={(e) => {
              e.preventDefault();
              handleRemove();
            }}
          >
            Remove
          </Button>
        </div>
      ))}
    </div>
  );
}

function AddMultipleIsLookingFor(props) {
  const { dynamicInput, setDynamicInput, formLoading } = props;

  const AddInput = () => {
    setDynamicInput([
      ...dynamicInput,
      { value: "", status: false, isOtherOption: true },
    ]);
  };

  return (
    <div>
      <div>
        <CreateUI
          dynamicInput={dynamicInput}
          setDynamicInput={setDynamicInput}
          formLoading={formLoading}
        />
      </div>

      <Button
        variant="contained"
        className="mt-10"
        onClick={(e) => {
          e.preventDefault();
          AddInput();
        }}
      >
        Add
      </Button>
    </div>
  );
}

export default AddMultipleIsLookingFor;
