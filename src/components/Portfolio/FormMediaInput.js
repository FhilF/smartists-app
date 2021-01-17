import React from "react";
import StandardInput from "../../customComponents/StandardInput";
import StandardTextArea from "../../customComponents/StandardTextArea";
import { isEmpty } from "../../lib/data";

const FormMediaInput = (props) => {
  const { setPortfolio, porfolio, formLoading } = props;
  return (
    <>
      <StandardInput
        className="mt-20"
        label="Title"
        id="image-title"
        value={porfolio.title ? porfolio.title : ""}
        onChange={(e) => {
          if (!isEmpty(e.target.value)) {
            setPortfolio({ ...porfolio, title: null });
            return false;
          }
          setPortfolio({ ...porfolio, title: e.target.value });
        }}
        autoComplete="off"
        disabled={formLoading}
      />
      <StandardTextArea
        className="mt-20"
        label="Description"
        id="image-description"
        rows={4}
        value={porfolio.description ? porfolio.description : ""}
        onChange={(e) => {
          if (!isEmpty(e.target.value)) {
            setPortfolio({ ...porfolio, description: null });
            return false;
          }
          setPortfolio({ ...porfolio, description: e.target.value });
        }}
        disabled={formLoading}
      />
    </>
  );
};

export default FormMediaInput;
