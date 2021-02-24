import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import placeHolder from "../assets/images/avatar-placeholder.png";
import MenuDropDown from "../customComponents/MenuDropDown";
import { ReactComponent as PersonOutlinedIcon } from "../assets/svg-icon/PersonOutlinedIcon.svg";
import { ReactComponent as SettingsOutlinedIcon } from "../assets/svg-icon/SettingsOutlinedIcon.svg";
import { ReactComponent as DescriptionOutlinedIcon } from "../assets/svg-icon/DescriptionOutlinedIcon.svg";
import { ReactComponent as ExitToAppOutlinedIcon } from "../assets/svg-icon/ExitToAppOutlinedIcon.svg";

function NavProfileMenu(props) {
  const { profile, signOut, userSession, history, smartistsUser } = props;
  const [profileMenuOpen, setprofileMenuOpen] = useState(false);
  const handleMenuProfileOpen = () => {
    setprofileMenuOpen(true);
  };

  const handleMenuClose = () => {
    setprofileMenuOpen(false);
  };

  return (
    <li
      className={classNames(
        "nav-menu dropdown menu-profile",
        profileMenuOpen ? "active-dropdown" : null
      )}
    >
      <a
        className="dropdown-toggle"
        data-toggle="dropdown"
        href="/"
        onClick={(e) => {
          e.preventDefault();
          handleMenuProfileOpen();
        }}
      >
        <img src={placeHolder} alt="..." className="profile-avatar-image" />
        <span className="profile-text">{profile.username}</span>
      </a>
      {profileMenuOpen ? (
        <MenuDropDown handleMenuClose={handleMenuClose}>
          <ul className="dropdown-menu profile-menu">
            {smartistsUser.length !== 0 && (
              <li>
                <a
                  href="# "
                  onClick={(e) => {
                    e.preventDefault();
                    history.push(`/member/${profile.username}`);
                  }}
                >
                  <PersonOutlinedIcon className="menu-icon" />
                  <span>View Profile</span>
                </a>
              </li>
            )}

            <li>
              <a href="# "
                  onClick={(e) => {
                    e.preventDefault();
                    history.push("/documentation");
                  }}>
                <DescriptionOutlinedIcon className="menu-icon" />
                <span>Documentation</span>
              </a>
            </li>
            <li>
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  userSession.signUserOut(window.location.origin);
                  signOut();
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

export default NavProfileMenu;
