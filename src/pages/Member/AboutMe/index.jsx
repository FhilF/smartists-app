import { isMainnet } from "config";
import React from "react";
import { BsPersonCircle, BsPerson, BsPencil } from "react-icons/bs";
import {
  IoCallOutline,
  IoPeopleOutline,
  IoJournalOutline,
  IoMailOutline,
  IoEarthOutline,
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function AboutMe(props) {
  const { smartistsUserData, isSessionedUser } = props;
  const navigate = useNavigate();
  return (
    <div className="w-full mt-12 mx-8 2xl:w-11/12">
      <div className="mb-6 flex">
        <div className="w-4/6">
          <h1 className=" text-slate-800 text-4xl font-bold text tracking-tight">
            {isSessionedUser ? "Your Info" : "Member Info"}
          </h1>
        </div>
        <div className="flex-1 flex w-full justify-end">
          {isSessionedUser && (
            <div
              className="inline-flex space-x-2 items-center justify-center w-40 py-2 pl-2.5 pr-3 ml-2 bg-red-900 text-white shadow border rounded-full  cursor-pointer"
              onClick={() => {
                navigate(`/${smartistsUserData[isMainnet ? "walletAddress" : "walletAddressTestnet"]}/edit`);
              }}
            >
              <BsPencil />
              <p className="text-sm font-medium leading-none text-white">
                Edit your info
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="mt-12">
        <div className="w-full md:flex">
          <div className="w-full md:w-4/6 grid gap-6">
            <div className="flex">
              <div className="flex pr-4">
                <span className="text-2xl text-red-900">
                  <BsPersonCircle />
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Username</p>
                <p className="mt-2 text-sm text-gray-500">
                  {smartistsUserData.username
                    ? smartistsUserData.username
                    : "N/A"}
                </p>
              </div>
            </div>
            <div className="flex">
              <div className="flex pr-4">
                <span className="text-2xl text-red-900">
                  <BsPerson />
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Name</p>
                <p className="mt-2 text-sm text-gray-500">
                  {smartistsUserData.name ? smartistsUserData.name : "N/A"}
                </p>
              </div>
            </div>
            <div className="flex">
              <div className="flex pr-4">
                <span className="text-2xl text-red-900">
                  <IoJournalOutline />
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  Description about me
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  {smartistsUserData.description
                    ? smartistsUserData.description
                    : "N/A"}
                </p>
              </div>
            </div>
            <div className="flex">
              <div className="flex pr-4">
                <span className="text-2xl text-red-900">
                  <IoPeopleOutline />
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Role</p>
                <div>
                  {smartistsUserData.classification.isArtist.isTrue && (
                    <div>
                      <p className="mt-2 text-sm text-gray-600 font-bold">
                        Artist
                      </p>
                      {smartistsUserData.classification.isArtist.info
                        .openWork && (
                        <p className="mt-2 text-sm font-semibold text-red-900 ml-4">
                          Open to work on demand
                        </p>
                      )}
                      <p className="mt-2 text-sm text-gray-500 ml-4">
                        {smartistsUserData.classification.isArtist.info.skills
                          ? smartistsUserData.classification.isArtist.info.skills.join(
                              ", "
                            )
                          : "N/A"}
                      </p>
                    </div>
                  )}

                  {smartistsUserData.classification.isArtUser.isTrue && (
                    <div className="mt-4">
                      <p className="mt-2 text-sm text-gray-600 font-bold">
                        Art-user
                      </p>
                      <p className="mt-2 text-sm font-semibold text-red-900 ml-4">
                        {smartistsUserData.classification.isArtUser.info
                          .majorInterest
                          ? smartistsUserData.classification.isArtUser.info
                              .majorInterest
                          : "N/A"}
                      </p>
                      <p className="mt-2 text-sm text-gray-500 ml-4">
                        {smartistsUserData.classification.isArtUser.info
                          .primaryInterest
                          ? smartistsUserData.classification.isArtUser.info
                              .primaryInterest.join(
                                ", "
                              )
                          : "N/A"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="w-full mt-6 md:mt-0 md:flex-1">
            <div className=" grid gap-6">
              <div className="flex">
                <div className="flex pr-4">
                  <span className="text-2xl text-red-900">
                    <IoMailOutline />
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Contact Me</p>
                  <p className="mt-2 text-sm text-gray-500">
                    {smartistsUserData.email ? smartistsUserData.email : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex pr-4">
                  <span className="text-2xl text-red-900">
                    <IoEarthOutline />
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Website</p>
                  <p className="mt-2 text-sm text-gray-500">
                    {smartistsUserData.website
                      ? smartistsUserData.website
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutMe;
