import React, { useEffect, useState } from "react";
import ContainedNavButton from "../customComponents/ContainedNavButton";
import TextNavButton from "../customComponents/TextNavButton";

function Welcome() {
  // const { userSession } = useBlockstack();
  useEffect(() => {
    
  }, []);
  return (
    <div>
      <div className="flex-column-center">
        <h1 className="mt-20">Welcome to smartists!</h1>
        <h4 className="mt-20">
          Set up your account to introduce yourself and connect with
          self-managed artists!
        </h4>
        <div className="mt-40 flex-column-center">
          <ContainedNavButton link="/account-setup">
            Start Now
          </ContainedNavButton>
          <TextNavButton className="mt-10">Learn More</TextNavButton>
          {/* <button>Know more</button> */}
        </div>

        {/* {loading ? (
          <>Loading</>
        ) : (
          <div
            style={{
              backgroundImage: `url(${URL.createObjectURL(
                new Blob([new Uint8Array(sample)])
              )})`,
              width: "250px",
              height: "250px",
            }}
          ></div>
        )} */}
      </div>
    </div>
  );
}

export default Welcome;
