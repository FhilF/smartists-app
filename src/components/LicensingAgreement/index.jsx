import React, { useState, useRef, createRef, useEffect } from "react";

import Dialog from "customComponents/Dialog";
import Button from "customComponents/Button";
import GeneralTerms from "./GeneralTerms";
import classNames from "classnames";
import SpecialTerms from "./SpecialTerms";

function LicensingAgreements(props) {
  const {
    agreedToTerms,
    setAgreedToTerms,
    disabled,
    alert,
    showTerms,
    setShowTerms,
    modalOnly,
    continueFn,
  } = props;
  const [page, setPage] = useState(1);
  const handleDialog = () => {
    // var x = document.getElementsByTagName("BODY")[0];
    // if (
    //   window.getComputedStyle(x).overflow === "visible" ||
    //   window.getComputedStyle(x).overflow === "auto"
    // ) {
    //   document.body.style.overflow = "hidden";
    // } else {
    //   document.body.style.overflow = "visible";
    // }
    setShowTerms((showTerms) => !showTerms);
  };

  const dialogRef = createRef();

  useEffect(() => {
    if (showTerms) {
      setPage(1);
    }
  }, [showTerms]);

  return (
    <div className="mt-4">
      {!modalOnly && (
        <div
          className="terms-and-agreements-root"
          style={{ display: "flex", alignItems: "center" }}
        >
          <input
            type="checkbox"
            id="term&agreements"
            name="term&agreements"
            checked={Object.keys(agreedToTerms).every(function (k) {
              return agreedToTerms[k];
            })}
            onChange={(e) => {
              // setAgreedToTerms(!agreedToTerms);
            }}
            onClick={(e) => {
              e.preventDefault();
              handleDialog();
            }}
            value={agreedToTerms}
            disabled={disabled}
            className="cursor-pointer form-checkbox text-red-900"
          />
          <p className="text-sm font-semibold leading-tight text-gray-700 ml-2">
            I agree to the Licensing Terms & Conditions
          </p>
        </div>
      )}

      {showTerms ? (
        <Dialog
          handleClose={handleDialog}
          style={{ marginTop: "10vh", marginBottom: "10vw", width: "900px" }}
          childRef={dialogRef}
        >
          <div className="p-16 bg-white rounded-lg">
            <div className="space-y-8 items-start justify-start">
              {page === 1 && (
                <>
                  <GeneralTerms />
                  <div className="inline-flex space-x-2 items-center justify-start">
                    <input
                      type="checkbox"
                      id="term&agreements2"
                      name="term&agreements2"
                      checked={agreedToTerms.ag1}
                      onChange={(e) => {
                        setAgreedToTerms({
                          ...agreedToTerms,
                          ag1: !agreedToTerms.ag1,
                        });
                      }}
                      disabled={disabled}
                      className="cursor-pointer form-checkbox text-red-900"
                    />
                    <label
                      htmlFor="term&agreements2"
                      className="text-sm font-medium leading-tight text-gray-700"
                    >
                      I’ve read and accept it
                    </label>
                  </div>
                </>
              )}

              {page === 2 && (
                <>
                  <SpecialTerms />
                  <div className="inline-flex space-x-2 items-center justify-start">
                    <input
                      type="checkbox"
                      id="term&agreements2"
                      name="term&agreements2"
                      checked={agreedToTerms.ag2}
                      onChange={(e) => {
                        setAgreedToTerms({
                          ...agreedToTerms,
                          ag2: !agreedToTerms.ag2,
                        });
                      }}
                      disabled={disabled}
                      className="cursor-pointer form-checkbox text-red-900"
                    />
                    <label
                      htmlFor="term&agreements2"
                      className="text-sm font-medium leading-tight text-gray-700"
                    >
                      I’ve read and accept it
                    </label>
                  </div>
                </>
              )}

              <div className="flex justify-center">
                <div
                  className={classNames(
                    "px-2 cursor-pointer",
                    page === 1 && "bg-red-900 text-white"
                  )}
                  onClick={() => {
                    setPage(1);
                    dialogRef.current.scrollTop = 0;
                  }}
                >
                  1
                </div>
                <div
                  className={classNames(
                    "px-2 cursor-pointer",
                    page === 2 && "bg-red-900 text-white"
                  )}
                  onClick={() => {
                    setPage(2);
                    dialogRef.current.scrollTop = 0;
                  }}
                >
                  2
                </div>
              </div>
            </div>
            <div className=" flex flex-col items-center">
              <div
                className="inline-flex items-center justify-center w-56 mt-8 px-4 py-2 bg-red-900 shadow rounded-full cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  if (
                    Object.keys(agreedToTerms).every(function (k) {
                      return agreedToTerms[k];
                    })
                  ) {
                    if (continueFn) {
                      setShowTerms((showTerms) => !showTerms);
                      continueFn();
                    } else {
                      handleDialog();
                    }
                  } else {
                    alert.error("You haven't agreed to all terms");
                  }
                }}
              >
                <p className="text-base font-semibold leading-normal text-white">
                  Continue
                </p>
              </div>
              <div
                className="inline-flex items-center justify-center w-56 mt-1 px-4 py-2 border border-solid  shadow rounded-full cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  setAgreedToTerms({ ag1: false, ag2: false });
                  setShowTerms((showTerms) => !showTerms);
                }}
              >
                <p className="text-base font-semibold leading-normal text-gray-600">
                  Cancel
                </p>
              </div>
            </div>
          </div>
        </Dialog>
      ) : null}
    </div>
  );
}

export default LicensingAgreements;
