import React, { useState, useEffect } from "react";
// import View from "components/FeaturedArtwork/View"
import AddFeaturedWorkComponent from "./Add";
import FeaturedWorkCard from "./Card";
import { useSelector, useDispatch } from "react-redux";
import { getFeaturedWorkAsync } from "utils/redux/slice/featuredWorkSlice";
import { useAlert } from "react-alert";

function FeaturedWork(props) {
  const {
    isSessionedUser,
    signedInSmartistsUser,
    setSignedInSmartistsUser,
    smartistsUserData,
  } = props;

  const alert = useAlert();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);

  const [featuredWorks, setFeaturedWorks] = useState([]);

  useEffect(() => {
    dispatch(getFeaturedWorkAsync({ studioId: smartistsUserData.Studio.id }))
      .unwrap()
      .then((res) => {
        // console.log(res)
        setFeaturedWorks(res.FeaturedWorks);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        alert.error("There was an error fetching your featured works", {
          timeout: 5000,
        });
      });
  }, []);

  return (
    <div>
      <div className="mb-6 flex">
        <h1 className=" text-slate-800 text-4xl font-bold text tracking-tight">
          Featured Works
        </h1>
      </div>
      {!isLoading && (
        <>
          <div className="mt-12 grid grid-cols-3 gap-6">
            {isSessionedUser && featuredWorks.length < 3 && (
              <AddFeaturedWorkComponent
                setSignedInSmartistsUser={setSignedInSmartistsUser}
                setFeaturedWorks={setFeaturedWorks}
                smartistsUserData={smartistsUserData}
              />
            )}
            {featuredWorks.length > 0 &&
              featuredWorks.map((el, i) => {
                return (
                  <FeaturedWorkCard
                    key={i}
                    featuredWork={el}
                    isSessionedUser={isSessionedUser}
                    index={i}
                    smartistsUserData={smartistsUserData}
                    // handleDeleteUpdateList={handleDeleteUpdateList}
                    // isModifyingFeaturedWork={isModifyingFeaturedWork}
                  />
                );
              })}
          </div>

          {featuredWorks.length === 0 && !isSessionedUser && (
            <div className="w-full flex justify-center mt-16">
              <h3 className="text-base text-gray-400">
                No featured works available
              </h3>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default FeaturedWork;
