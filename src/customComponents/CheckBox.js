import React, { useState} from "react";
import { ReactComponent as CheckBoxBlankIcon } from "../assets/svg-icon/CheckBoxBlankIcon.svg";
import { ReactComponent as CheckBoxIcon } from "../assets/svg-icon/CheckBoxIcon.svg";

function CheckBox(props) {
  const { id, value, name, onChange, checked, label } = props;
  const [isChecked, setIsChecked] = useState(checked);


  return (
    <div
      className="checkbox-root"
    >
      <span className="checkbox-button-base-root">
        <span className="checkbox-base">
          <input
            type="checkbox"
            id={id}
            name={name}
            onChange={onChange}
            className="checkbox-input"
            value={name}
          />
          {checked ? (
            <CheckBoxIcon className="proxy-checkbox-input" />
          ) : (
            <CheckBoxBlankIcon className="proxy-checkbox-input" />
          )}
        </span>
      </span>
      <label htmlFor={name}>{label}</label>
    </div>
  );
}

export default CheckBox;
