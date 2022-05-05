import React from "react";

import { useNavigate } from "react-router-dom";
import Button from "customComponents/Button";

import logo from "assets/images/logo.png";

import { authenticate, userSession, signOut } from "utils/stacks-util/auth";

function Header(props) {
  const { setIsNewSignIn } = props;
  const navigate = useNavigate();
  return (
    <div>
      <div className="navbar bg-white">
        <div className="nav-content">
          <div className="nav-brand">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
              }}
            >
              <div className="logo-text">
                <img src={logo} alt="logo" style={{ maxHeight: "35px" }} />
              </div>
            </a>
          </div>
          <ul className="nav-menu-list text-gray-600 hover:text-gray-900">
            <li className="nav-menu hover:text-gray-900">
              <a
                href="/documentation"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/documentation");
                }}
              >
                Documentation
              </a>
            </li>
            <li className="nav-menu hover:text-gray-900">
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  signOut();
                }}
              >
                Sign out
              </a>
            </li>
            {/* <li className="nav-menu mt-3">
              <Button
                size="medium"
                variant="contained"
                color="secondary"
                className="rounded-2xl hover:bg-red-700"
                style={{ borderRadius: "20px" }}
                onClick={(e) => {
                  e.preventDefault();
                  if (userSession) {
                    if (!userSession.isUserSignedIn()) {
                      authenticate({setIsNewSignIn});
                    }
                  }
                }}
              >
                Join Smartists
              </Button>
            </li> */}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Header;
