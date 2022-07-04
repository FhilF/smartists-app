import React from "react";
import Image1 from "assets/images/Guides/ArtUser-Guide/art-user-guide-1.jpg";
import Image2 from "assets/images/Guides/ArtUser-Guide/art-user-guide-2.jpg";
import Image3 from "assets/images/Guides/ArtUser-Guide/art-user-guide-3.jpg";
import Image4 from "assets/images/Guides/ArtUser-Guide/art-user-guide-4.jpg";
import Image5 from "assets/images/Guides/ArtUser-Guide/art-user-guide-5.jpg";
import Image6 from "assets/images/Guides/ArtUser-Guide/art-user-guide-6.jpg";
import Image7 from "assets/images/Guides/ArtUser-Guide/art-user-guide-7.jpg";
import Image8 from "assets/images/Guides/ArtUser-Guide/art-user-guide-8.jpg";

function ArtUser() {
  return (
    <div className="mt-20">
      <h1 className=" font-medium text-3xl">A Guide for art-users</h1>
      <div className=" max-w-5xl">
        <div className="flex flex-col space-y-7 items-center justify-start">
          <img src={Image1} alt="artist-guide-1" />
          <img src={Image2} alt="artist-guide-2" />
          <img src={Image3} alt="artist-guide-3" />
          <img src={Image4} alt="artist-guide-4" />
          <img src={Image5} alt="artist-guide-5" />
          <img src={Image6} alt="artist-guide-6" />
          <img src={Image7} alt="artist-guide-7" />
          <a
            href="https://discord.gg/J39BcWVCTm"
            target="_blank"
            rel="noreferrer"
          >
            <img src={Image8} alt="artist-guide-8" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default ArtUser;
