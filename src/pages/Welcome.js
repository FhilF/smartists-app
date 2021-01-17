import React from "react";
import ContainedNavButton from "../customComponents/ContainedNavButton";
import TextNavButton from "../customComponents/TextNavButton";


function Welcome() {
  return (
    <div>
      <div className="flex-column-center">
        <h1 className="mt-20">Welcome to smartists!</h1>
        <h4 className="mt-20">
          Set up your account to introduce yourself and connect with
          self-managed artists!
        </h4>
        <div className="mt-40 flex-column-center">
            <ContainedNavButton link="/account-setup">Start Now</ContainedNavButton>
            <TextNavButton className="mt-10">Learn More</TextNavButton>
            {/* <button>Know more</button> */}
        </div>
      </div>
    </div>
  );
}

export default Welcome;
