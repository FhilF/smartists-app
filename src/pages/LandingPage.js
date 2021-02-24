import React, { useEffect } from "react";
import Button from "../customComponents/Button";

import VisualArtists from "../assets/images/visual-artist.jpg";
import "../styles/scss/landingPage.scss";
import { useConnect } from "@blockstack/connect";

function LandingPage() {
  const { doOpenAuth } = useConnect();
  return (
    <div className="page-root">
      <div>
        <div className="bg-primary px-14 py-32 text-center">
          <h1 className="text-gray-700 py-4">
            Private Art Studios
            <br />
            on the Internet of Value
          </h1>
          <h4 className="text-gray-400">Enter with your self-managed ID</h4>
          <div className="py-4">
            <Button
              size="large"
              variant="contained"
              color="secondary"
              className="rounded-2xl"
              style={{ borderRadius: "20px" }}
              onClick={(e) => {
                e.preventDefault();
                doOpenAuth(true);
              }}
            >
              Walk in, please!
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-20 relative max-w-screen-lg xl:max-w-screen-xl mx-auto">
        <div className="text-center py-20">
          <h2 className="text-gray-800 text-2xl font-semibold ">
            Welcome to the Internet of Value
            <br />
            <p className="font-semibold mt-2 text-secondary">
              Where you own your identity and you control your online presence
            </p>
          </h2>
        </div>

        <div className="grid gap-2 grid-cols-2 mt-20">
          <div className="">
            <div className="flex items-center h-full">
              <div>
                <h2 className="text-gray-800 text-5xl font-semibold">
                  About Smartists
                </h2>
                <p className="text-gray-500 mt-6 font-normal text-base leading-7">
                  A community who stands for Intellectual Property where visual
                  artists, musicians, performers, writers and digital editors
                  meet and can open their private studios. If you are a
                  Self-Managed artist, and you want privacy to collaborate or
                  work on demand, you can now open your studio on the web 3.0 .
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <div
              style={{
                backgroundImage: `url(${VisualArtists})`,
              }}
              className="featured-image w-2/3"
            ></div>
          </div>
        </div>
      </div>
      <div className="mt-20 bg-primary">
        <div className="mt-20 relative max-w-screen-lg xl:max-w-screen-xl mx-auto py-16">
          <div className="text-center">
            <h2 className="text-gray-400 text-3xl font-semibold">
              How much is that?
            </h2>
            <div className="text-gray-800 text-lg font-semibold">
              <p className="mt-4 font-semibold">
                Paid Services for self-managed artists are
              </p>
              <p className="text-secondary text-2xl mt-2 font-semibold">FREE</p>
              <p className="font-semibold mt-2 ">
                This is an opportunity for web 3.0 pioneers!
              </p>
              <p className="font-semibold mt-2 ">Come in to know more!</p>
            </div>
            <div className="mt-8">
              <Button
                size="large"
                variant="contained"
                color="secondary"
                className="rounded-2xl"
                style={{ borderRadius: "20px" }}
                onClick={(e) => {
                  e.preventDefault();
                  doOpenAuth(true);
                }}
              >
                Welcome to smartists
              </Button>
            </div>
            <div className="">
              <p className="font-semibold text-lg text-gray-400 mt-4">
                You will always remain in control of your data!
              </p>

              <p className="text-base text-gray-800 mt-4">
                Thank you for considering using Smartists
                <br />
                designed for the best Art to come to the new web,
                <br />
                with privacy, security, and benefits for all.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-900 text-center py-2">
        <p className="text-gray-50 text-sm">
          SMARTISTS is built on Stacks for authors to protect their rights on
          the Internet
        </p>
      </div>
    </div>
  );
}

export default LandingPage;
