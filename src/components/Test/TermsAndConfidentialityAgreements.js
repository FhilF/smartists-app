import React, { useState } from "react";

import Dialog from "../customComponents/Dialog";
import Button from "../customComponents/Button";

function TermsAndConfidentialityAgreements(props) {
  const { agreedToTerms, setAgreedToTerms, disabled, alert } = props;
  const [showTerms, setShowTerms] = useState(false);
  const handleDialog = () => {
    var x = document.getElementsByTagName("BODY")[0];
    if (window.getComputedStyle(x).overflow === "visible" || window.getComputedStyle(x).overflow === "auto") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }
    setShowTerms(!showTerms);
  };

  return (
    <div className="mt-4">
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
        <p className="text-sm font-medium leading-tight text-gray-700 ml-2">
          I agree to the Smartists Terms of Confidentiality
        </p>
      </div>
      {showTerms ? (
        <Dialog
          handleClose={handleDialog}
          style={{ marginTop: "10vh", marginBottom: "10vw", width: "800px" }}
        >
          <div className="p-16 bg-white rounded-lg">
            <div className="space-y-8 items-start justify-start">
              <p className="text-2xl font-medium">Before you continue, at Smartist we value Confidentiality and Intellectual Property</p>
              <div className="flex flex-col space-y-6 items-start justify-start">
                <div className="flex flex-col space-y-4 items-start justify-start">
                  <div className="flex flex-col space-y-2 items-start justify-start">
                    <p className="text-sm font-medium leading-tight text-gray-800">Intellectual Property & Copyrights</p>
                    <p className="text-xs leading-5 text-gray-500">In case of dispute between Smartists users, Intellectual Property Rights of any Art work or project on a Smartsist Studio belong to the first to introduce the art work on the Stacks blockchain.
                      <br />Authors in their Smartists' Studios are the owners of the intellectual property of art works in all extension.
                      <br />In case of On demand Art works, the artist will keep the Intellectual Property ownership of all materials delivered. The artist is the only owner of any concepts, ideas, copy sketches, artwork, electronic files and other materials delivered in connection with projects presented by the Art-Users.
                      <br />The Intellectual Property Rights related or derived from the information shared about a specific project on Smartists are property of the author who first introduced the project on Smartists.</p>
                  </div>
                  <div className="inline-flex space-x-2 items-center justify-start">
                    <input
                      type="checkbox"
                      id="term&agreements1"
                      name="term&agreements1"
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
                      htmlFor="term&agreements1"
                      className="text-sm font-medium leading-tight text-gray-700"
                    >
                      I’ve read and accept it
                    </label>
                  </div>
                </div>

                <div className="bg-gray-200" style={{ width: '100%', height: 1, }} />

                <div className="flex flex-col space-y-4 items-start justify-start">
                  <div className="flex flex-col space-y-2 items-start justify-start">
                    <p className="text-sm font-medium leading-tight text-gray-800">Confidentiality Definition</p>
                    <p className="text-xs leading-5 text-gray-500">All information -in any digital file format- provided by any Artist in his/her Smartists Studio is considered confidential. All information provided by any Art-user about any Art work project to an Artist on his/her Smartists Studio is also confidential. Such Confidentiality definition comes with the following exceptions:
                      <br />· Information in connection with an Art work project which is already in the possession of the interested user prior to the disclosure of the confidential information without any obligation of confidentiality;
                      <br />· Information which is or comes into the public domain or otherwise ceases to be of a confidential nature other than as a result of wrongful disclosure;
                      <br />· Information whose disclosure was previously authorized by written consent.
                      <br />· Information that must be disclosed pursuant to a legal obligation;</p>
                  </div>
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
                </div>

                <div className="bg-gray-200" style={{ width: '100%', height: 1, }} />

                <div className="flex flex-col space-y-4 items-start justify-start">
                  <div className="flex flex-col space-y-2 items-start justify-start">
                    <p className="text-sm font-medium leading-tight text-gray-800">Obligations</p>
                    <p className="text-xs leading-5 text-gray-500">Any Art-user interested in a specific Art work or project in a Smartists Studio has the following obligations:
                      <br />· Crediting the Artist for his/her work;
                      <br />· Keeping confidential information secret and never disclosing it to third parties;
                      <br />· Using the information only for the purposes determined by the author;
                      <br />· Making sure that the confidentiality of the information is respected by those who could have access through him by extending the present agreement to them, and answering for its compliance;
                      <br />· Return or destroy confidential information and its copies at the author’s request or when the relationship between the parties ends.
                      <br />In case of on-demand Art works, same obligations apply to artists when receiving information about a project.</p>
                  </div>
                  <div className="inline-flex space-x-2 items-center justify-start">
                    <input
                      type="checkbox"
                      id="term&agreements3"
                      name="term&agreements3"
                      checked={agreedToTerms.ag3}
                      onChange={(e) => {
                        setAgreedToTerms({
                          ...agreedToTerms,
                          ag3: !agreedToTerms.ag3,
                        });
                      }}
                      disabled={disabled}
                      className="cursor-pointer form-checkbox text-red-900"
                    />
                    <label
                      htmlFor="term&agreements3"
                      className="text-sm font-medium leading-tight text-gray-700"
                    >
                      I’ve read and accept it
                    </label>
                  </div>
                </div>

                <div className="bg-gray-200" style={{ width: '100%', height: 1, }} />

                <div className="flex flex-col space-y-4 items-start justify-start">
                  <div className="flex flex-col space-y-2 items-start justify-start">
                    <p className="text-sm font-medium leading-tight text-gray-800">Disclosure, Damages and Claims
                    </p>
                    <p className="text-xs leading-5 text-gray-500">The author and the interested-user are aware that disclosure or misuse of Confidential Information will produce irreparable damage to the commercial and financial interests of the other party. Therefore, both parties agree to indemnify the other party for the damage caused and claimed in accordance with the current legislation of the author's jurisdiction.</p>
                  </div>
                  <div className="inline-flex space-x-2 items-center justify-start">
                    <input
                      type="checkbox"
                      id="term&agreements4"
                      name="term&agreements4"
                      checked={agreedToTerms.ag4}
                      onChange={(e) => {
                        setAgreedToTerms({
                          ...agreedToTerms,
                          ag4: !agreedToTerms.ag4,
                        });
                      }}
                      disabled={disabled}
                      className="cursor-pointer form-checkbox text-red-900"
                    />
                    <label
                      htmlFor="term&agreements4"
                      className="text-sm font-medium leading-tight text-gray-700"
                    >
                      I agree to the Smartists Terms of Confidentiality
                    </label>
                  </div>
                </div>

              </div>
            </div>
            <div
              className="inline-flex items-center justify-center w-56 mt-8 px-4 py-2 bg-red-900 shadow rounded-full cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                if (
                  Object.keys(agreedToTerms).every(function (k) {
                    return agreedToTerms[k];
                  })
                ) {
                  handleDialog();
                } else {
                  alert.error("You haven't agreed to all terms")
                }
              }}
            >
              <p className="text-base font-medium leading-normal text-white">Continue</p>
            </div>
          </div>
        </Dialog>
      ) : null}
    </div>
  );
}

export default TermsAndConfidentialityAgreements;
