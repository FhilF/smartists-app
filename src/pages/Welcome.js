import React, { useEffect, useState } from "react";
import Grid from "customComponents/Grid";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiServer } from "config";
import SmartistsMemberCard from "components/SmartistsMemberCard";

function Welcome() {
  let navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [smartistsUserList, setSmartistsUserList] = useState([]);
  useEffect(() => {
    axios.get(`${apiServer}/smartistsUsers`).then((res) => {
      setSmartistsUserList([...res.data.smartistsUserList]);
      setIsLoading(false);
    });
  }, []);

  return (
    <div>
      <Grid nested>
        <div className="col-span-full text-center mt-20">
          <p className="text-4xl font-medium leading-10 text-center">
            Welcome to Smartists
          </p>
          <p className="w-1/2 m-auto mt-4 text-base leading-normal text-center text-gray-600">
            Set up your account to introduce yourself and connect with
            self-managed artists!
          </p>
          <div className="mt-10">
            <div
              className="inline-flex items-center justify-center w-52 px-5 py-3 bg-red-900 shadow rounded-full cursor-pointer"
              onClick={() => navigate("/account-setup")}
            >
              <p className="text-sm font-medium leading-tight text-white">
                Start Now
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div
              className="inline-flex items-center justify-center w-52 px-1 py-2 cursor-pointer"
              onClick={() => navigate("/documentation")}
            >
              <p className="text-sm font-medium leading-tight text-gray-900 hover:underline">
                Learn More
              </p>
            </div>
          </div>
        </div>
        <div className="col-span-full flex justify-center mt-16 px-2">
          <div className="w-screen">
            <div className=" text-center mb-6">
              <p className="text-gray-800 text-2xl font-semibold">
                Some of our members
              </p>
            </div>
            <div className="box-border max-w-7xl mx-auto md:masonry before:box-inherit after:box-inherit">
              {!isLoading && (
                <>
                  {smartistsUserList.length !== 0 ? (
                    smartistsUserList.map((el, i) => {
                      if (i < 9) {
                        return (
                          <div className="" key={i}>
                            <SmartistsMemberCard
                              smartistsMember={el}
                              hideVisitStudio={true}
                            />
                          </div>
                        );
                      }
                      return null;
                    })
                  ) : (
                    <div className="py-10 text-center">
                      <p className="text-2xl text-gray-300">No members yet</p>
                    </div>
                  )}
                  {}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 inline-flex items-end justify-center w-full h-2/5 bg-gradient-to-t from-gray-300 to-transparent">
          <div
            className="px-24 py-3 mb-20 bg-red-900 shadow rounded-full cursor-pointer"
            onClick={() => navigate("/account-setup")}
          >
            <p className="text-base font-medium leading-normal text-white">
              Start Now
            </p>
          </div>
        </div>
      </Grid>
    </div>
  );
}

export default Welcome;
