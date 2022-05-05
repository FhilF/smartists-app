import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import placeHolder from "../assets/images/avatar-placeholder.png";
import MenuDropDown from "../customComponents/MenuDropDown";
import { ReactComponent as PersonOutlinedIcon } from "../assets/svg-icon/PersonOutlinedIcon.svg";
import { ReactComponent as SettingsOutlinedIcon } from "../assets/svg-icon/SettingsOutlinedIcon.svg";
import { ReactComponent as DescriptionOutlinedIcon } from "../assets/svg-icon/DescriptionOutlinedIcon.svg";
import { ReactComponent as ExitToAppOutlinedIcon } from "../assets/svg-icon/ExitToAppOutlinedIcon.svg";

import { isEmpty } from "lodash";

import { truncate } from "../lib/data";

function NavMemberMenu(props) {
  const {
    member,
    signOut,
    userSession,
    history,
    smartistsUser,
    handleSignOut,
    isfetchingUser,
  } = props;
  const [memberMenuOpen, setmemberMenuOpen] = useState(false);
  const handleMenuMemberOpen = () => {
    setmemberMenuOpen(true);
  };

  const handleMenuClose = () => {
    setmemberMenuOpen(false);
  };

  const handleDisplayPicture = () => {
    if (!isfetchingUser && Array.isArray(smartistsUser)) {
      if (smartistsUser.length !== 0) {
        if (smartistsUser[0].attrs.displayPicture) {
          return smartistsUser[0].attrs.displayPicture;
        } else {
          return placeHolder;
        }
      } else {
        return placeHolder;
      }
    } else {
      return placeHolder;
    }
  };

  return (
    <li
      className={classNames(
        "nav-menu dropdown menu-member flex",
        memberMenuOpen ? "active-dropdown" : null
      )}
    >
      <button
        className="pl-0 pr-0"
        data-toggle="dropdown"
        onClick={() => {
          handleMenuMemberOpen();
        }}
      >
        <div
          style={{
            backgroundImage: `url(${handleDisplayPicture()})`,
          }}
          className=" rounded-full bg-center bg-cover w-10 h-10 border-gray-400 border cursor-pointer"
        ></div>
      </button>
      {memberMenuOpen ? (
        <MenuDropDown handleMenuClose={handleMenuClose}>
          <ul className="dropdown-menu member-menu">
            <li>
              <a
                href="# "
                onClick={(e) => {
                  e.preventDefault();
                  history.push("/documentation");
                  handleMenuClose();
                }}
              >
                <DescriptionOutlinedIcon className="menu-icon" />
                <span>Documentation</span>
              </a>
            </li>
            <li>
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  handleSignOut();
                  handleMenuClose();
                }}
              >
                <ExitToAppOutlinedIcon className="menu-icon" />
                <span>Sign Out</span>
              </a>
            </li>
          </ul>
        </MenuDropDown>
      ) : null}
    </li>
  );
}

export default NavMemberMenu;
