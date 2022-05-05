import classNames from "classnames";
import React from "react";
import { useMatch } from "react-router-dom";

function NavButton(props) {
  const { location, navigate, name, pathname } = props;
  //   console.log(props);
  //     console.log(useMatch(":address/studio/featured-artwork12"))
  return (
    <li
      className={classNames(
        " font-medium flex",
        useMatch(pathname) ? " bg-custom-secondary border-l-4 border-solid border-red-900 text-gray-900" : "text-gray-500"
      )}
    >
      <a
        className="px-8 py-3 w-full"
        href={pathname}
        onClick={(e) => {
          e.preventDefault();
          navigate(pathname);
        }}
      >
        {name}
      </a>
    </li>
  );
}

export default NavButton;
