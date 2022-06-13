import React, { Fragment } from "react";

import { useNavigate } from "react-router-dom";
import Button from "customComponents/Button";
import { Menu, Transition } from "@headlessui/react";
import logo from "assets/images/logo.png";
import placeHolder from "assets/images/avatar-placeholder.png";
import { BsJournalText, BsBoxArrowRight } from "react-icons/bs";

import { authenticate, userSession, signOut } from "utils/stacks-util/auth";
import { IoLogOutOutline } from "react-icons/io5";
import classNames from "classnames";

function Header(props) {
  const { smartistsUserSession, isMainnet } = props;
  const walletAddress =
    smartistsUserSession[isMainnet ? "walletAddress" : "walletAddressTestnet"];
  // console.log();
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
            <ul className="nav-menu-list text-gray-700 font-semibold">
              <li className="nav-menu hover:text-gray-900">
                <a
                  href={`/${walletAddress}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/${walletAddress}`);
                  }}
                >
                  My info
                </a>
              </li>
              <li className="nav-menu hover:text-gray-900">
                <a
                  href="/members"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/members");
                  }}
                >
                  Members
                </a>
              </li>
              <li className="nav-menu hover:text-gray-900">
                <a
                  href="/marketplace"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/marketplace");
                  }}
                >
                  Marketplace
                </a>
              </li>
              <li className="nav-menu hover:text-gray-900">
                <a
                  href="/faqs"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/faqs");
                  }}
                >
                  FAQs
                </a>
              </li>
              {/* <li className="nav-menu hover:text-gray-900">
                <a
                  href="/guides"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/guides");
                  }}
                >
                  Guides
                </a>
              </li> */}
            </ul>
          </div>

          <ul className="nav-menu-list text-gray-700 font-semibold">
            <Menu as="li" className="nav-menu relative inline-block text-left">
              <Menu.Button
                as="a"
                className="w-full px-4 py-2 text-sm font-medium text-gray-900 flex items-center cursor-pointer"
              >
                <div className=" mr-2">
                  <div className="h-10 w-10">
                    <div
                      style={{
                        backgroundImage: `url(${placeHolder})`,
                      }}
                      className="z-50 h-full w-full rounded-full bg-center bg-cover border-gray-400 border"
                    ></div>
                  </div>
                </div>
                {`${walletAddress.substr(0, 4)}...${walletAddress.substr(-4)}`}
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 w-56 -mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-1 py-1">
                    <Menu.Item>
                      <button
                        className={classNames(
                          "w-full px-4 py-2 text-sm font-medium text-gray-900 flex"
                        )}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate("/documentation");
                        }}
                      >
                        <span className="text-2xl mr-2">
                          <BsJournalText />
                        </span>
                        <span className="flex self-center">Documentation</span>
                      </button>
                    </Menu.Item>
                  </div>
                  <div className="px-1 py-1">
                    <Menu.Item>
                      <button
                        className={classNames(
                          "w-full px-4 py-2 text-sm font-medium text-gray-900 flex"
                        )}
                        onClick={(e) => {
                          e.preventDefault();
                          signOut();
                        }}
                      >
                        <span className="text-2xl mr-2">
                          <BsBoxArrowRight />
                        </span>
                        <span className="flex self-center">Sign Out</span>
                      </button>
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
            {/* <li className="nav-menu hover:text-gray-900">
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
            </li> */}
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

function ArchiveActiveIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="5"
        y="8"
        width="10"
        height="8"
        fill="#8B5CF6"
        stroke="#C4B5FD"
        strokeWidth="2"
      />
      <rect
        x="4"
        y="4"
        width="12"
        height="4"
        fill="#8B5CF6"
        stroke="#C4B5FD"
        strokeWidth="2"
      />
      <path d="M8 12H12" stroke="#A78BFA" strokeWidth="2" />
    </svg>
  );
}

export default Header;
