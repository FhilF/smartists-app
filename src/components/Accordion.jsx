import React, { useState } from "react";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import parse from "html-react-parser";
import { useNavigate } from "react-router-dom";

function Accordion(props) {
  const navigate = useNavigate();
  const { title, description, childRef, index, paramsId, onClick, link } =
    props;
  const [isActive, setIsActive] = useState(
    paramsId && paramsId - 1 === index ? true : false
  );

  const ContentTitle = () => {
    return (
      <p className="flex items-center font-semibold text-lg">
        {description && (
          <span className="text-2xl mr-4">
            {isActive ? (
              <MdOutlineKeyboardArrowUp />
            ) : (
              <MdOutlineKeyboardArrowDown />
            )}
          </span>
        )}
        {title}
      </p>
    );
  };

  return (
    <li
      className="w-full 2xl:w-3/5 border-b border-solid border-gray-600/20 py-6"
      ref={childRef}
    >
      {link ? (
        <a
          className="cursor-pointer inline-block"
          href={link}
          target="_blank"
          rel="noreferrer"
        >
          <ContentTitle />
        </a>
      ) : (
        <div
          className="cursor-pointer inline-block"
          onClick={(e) => {
            if (description) {
              setIsActive((isActive) => setIsActive(!isActive));
              return true;
            } else {
              if (onClick) {
                onClick();
                return true;
              }
              if (link) {
                navigate(link);
              }
              return false;
            }
          }}
        >
          <ContentTitle />
        </div>
      )}
      {isActive && !link && description && (
        <div className="mt-4 px-10 accordion-desc">
          <p>{parse(description)}</p>
        </div>
      )}
    </li>
  );
}

export default Accordion;
